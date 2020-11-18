const CREDENTIALS = {
  token: "9825ad1dccca971121877baab48f428a5cd70354",
  user: "theBashShell",
};

const URL = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${CREDENTIALS.token}`,
};

var myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Bearer 9825ad1dccca971121877baab48f428a5cd70354"
);
myHeaders.append("Content-Type", "application/json");

const body = JSON.stringify({
  query: `query getData {    
    user(login: "theBashShell") {
      name
      avatarUrl
      bioHTML
      repositories(first: 20) {
        edges {
          node {
            name
            stargazerCount
            languages(first: 1) {
              nodes {
                name
                color
              }
            }
            forkCount
            updatedAt
            url
          }
        }
      }
    }
  }
  
  
      
      `,
});

function fetGithubData() {
  fetch(URL, {
    headers,
    method: "POST",
    body,
  })
    .then((res) => res.json())
    .then((res) => {
      populateFields(res.data);

      // create repo fields
      res.data.user.repositories.edges.forEach((el) => createRepoFields(el));
    })
    .catch((err) => console.error(err));
}

function populateFields({ user }) {
  const bio = document.querySelector("#bio");
  const name = document.querySelector("#name");

  bio.innerHTML = user.bioHTML;
  name.textContent = user.name;
}

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function createRepoFields(data) {
  const parent = document.querySelector(".repo-list");

  const repo = document.createElement("div");
  const name = document.createElement("div");
  const info = document.createElement("div");
  const divider = document.createElement("hr");
  const link = document.createElement("a");
  const button = document.createElement("button");
  const color = document.createElement("span");
  const language = document.createElement("span");
  const star = document.createElement("img");
  const starCount = document.createElement("span");
  const fork = document.createElement("img");
  const forkCount = document.createElement("span");
  const updated = document.createElement("span");

  star.src = `https://api.iconify.design/clarity:star-line.svg?color=%236a737d&width=18&height=18`;
  fork.src = `https://api.iconify.design/tabler:git-fork.svg?color=%236a737d&width=18&height=18`;

  name.appendChild(link);
  name.appendChild(button);

  info.appendChild(color);
  info.appendChild(language);
  info.appendChild(star);
  info.appendChild(starCount);
  info.appendChild(fork);
  info.appendChild(forkCount);
  info.appendChild(updated);

  const date = new Date(data.node.updatedAt);

  button.textContent = "Star";
  button.innerHTML = `<img src=${star.src} alt="start" /> Star`;

  link.href = data.node.url;
  link.innerText = data.node.name;
  forkCount.innerText = data.node.forkCount;
  starCount.innerText = data.node.stargazerCount;
  updated.innerText = `Updated on ${date.getDate()} ${
    shortMonthNames[date.getMonth()]
  }`;

  const lang = data.node.languages.nodes[0]?.name;
  language.innerText = lang ? lang : "-";
  color.style.backgroundColor = data.node.languages.nodes[0]?.color;

  name.classList.add("first");
  info.classList.add("second");
  repo.classList.add("rep");
  color.classList.add("color");
  button.classList.add("btn");
  divider.classList.add("divider");

  repo.appendChild(name);
  repo.appendChild(info);
  repo.appendChild(divider);

  parent.appendChild(repo);
}

export { fetGithubData, createRepoFields };
