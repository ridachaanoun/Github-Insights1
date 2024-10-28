import moment from "../node_modules/moment/dist/moment.js";

const myName = document.getElementById("name");
const myUsername = document.getElementById("username");
const myAvatar = document.getElementById("avatar");
const myBio = document.getElementById("bio");
const myFollowers = document.getElementById("followers");
const myFollowing = document.getElementById("following");
const myRepos = document.getElementById("repos");
const myFlag = document.getElementById("my-flag");
const myMembership = document.getElementById("membership-duration");
const reposGrid = document.getElementById("reposGrid");
const insightsGrid = document.getElementById("insightsGrid");
const insightsBtn = document.getElementById("insights-btn");
const homePageLink = document.getElementById("homePageLink");
const userReposLink = document.getElementById("userReposLink");
const searchInput = document.getElementById("search-input");
const usersNameHeader = document.getElementById("usersNameHeader");
const usersAvatar = document.getElementById("users-avatar");
const usersFlag = document.getElementById("users-flag");
const usersNameStats = document.getElementById("usersNameStats");
const usersReposStats = document.getElementById("usersReposStats");
const languagesCount = document.getElementById("languagesCount");
const userTitle = document.getElementById("user-title");
const barChart = document.getElementById("myBarsChart");
const pieChart = document.getElementById("myPieChart");

const api = "https://api.github.com/user";
const emojiApi = "https://api.github.com/emojis";
const headers = new Headers();

headers.append("Authorization", "bearer {your token}");

const requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

async function getMyProfileData() {
  try {
    const response = await fetch(api, requestOptions);
    const data = await response.json();
    console.log(data);

    myName.textContent = data.name;
    myName.classList.add("my-name");
    myUsername.textContent = data.login;
    myUsername.classList.add("my-user-name");
    myAvatar.src = data.avatar_url;
    myBio.textContent = data.bio;
    myBio.classList.add("my-bio");
    myFollowers.textContent = `Followers: ${data.followers} `;
    myFollowing.textContent = `Following: ${data.following} `;
    myRepos.textContent = `Public Repos: ${data.public_repos} `;

    const createdDate = data.created_at;

    calculateMembership(createdDate);
  } catch (error) {
    console.log(error);
  }
}

getMyProfileData();

function calculateMembership(createdDate) {
  const currentDate = moment();

  const years = currentDate.diff(createdDate, "years");
  const months = currentDate.diff(createdDate, "months") % 12;

  let output = "Member for ";
  if (years > 0) {
    output = output + `${years} years, `;
  }
  if (months > 0) {
    output = output + `${months} months`;
  }
  myMembership.textContent = output;
}

async function getReposData() {
  try {
    let counter = 0;
    let searchedUser = searchInput.value;
    if (!searchedUser) {
      searchedUser = "ridachaanoun";
    }
    getFlag(searchedUser);
    const response = await fetch(
      api + `s/${searchedUser}/repos`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    countLanguages(data);
    reposGrid.innerHTML = "";

    data.forEach((repo) => {
      console.log(repo);

      const repocard = document.createElement("article");
      repocard.classList.add(
        "repo-card",
        "bg-asidecolor",
        "rounded-2xl",
        "h-[200px]",
        "pl-5",
        "pt-5"
      );

      const repoTitle = document.createElement("a");
      const repoDesc = document.createElement("p");
      const lang = document.createElement("p");

      repoTitle.innerText = repo.name;
      repoTitle.classList.add("repo-title");
      repoTitle.href = repo.html_url;
      repoDesc.innerText = repo.description;
      repoDesc.classList.add("pt-5");
      lang.innerText = repo.language;
      lang.classList.add("pt-5");

      repocard.appendChild(repoTitle);
      repocard.appendChild(repoDesc);
      repocard.appendChild(lang);

      reposGrid.appendChild(repocard);

      usersAvatar.src = repo.owner.avatar_url;
      usersNameHeader.innerText = repo.owner.login;
      usersNameStats.innerText = `${repo.owner.login} Stats:`;

      counter++;
    });
    usersReposStats.innerText = `Public Repositories: ${counter}`;
  } catch (error) {
    console.log(error);
  }
}

let timeoutId;
function debounce(func, delay) {
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}

function searchRepos(event) {
  const searchedUser = event.target.value;
  getReposData(searchedUser);
}

searchInput.addEventListener("keyup", debounce(searchRepos, 1500));
getReposData();

function countLanguages(data) {
  let languages = [];
  let langsFrequency = {};
  let langsPercentages = [];
  let countedLanguages = 0;
  let maxKey = null;
  let maxValue = 0;

  data.forEach((repo) => {
    if (repo.language !== null) {
      languages.push(repo.language);
    }
  });
  console.log(`languages: ${languages}`);

  for (let i of languages) {
    if (langsFrequency[i]) {
      langsFrequency[i] += 1;
    } else {
      langsFrequency[i] = 1;
    }
  }

  for (let key in langsFrequency) {
    if (key !== "HTML" && key !== "CSS" && langsFrequency[key] > maxValue) {
      maxKey = key;
      maxValue = langsFrequency[key];
    }
  }

  for (let i in langsFrequency) {
    langsPercentages.push((langsFrequency[i] / languages.length) * 100);
  }

  countedLanguages = Object.keys(langsFrequency).length;
  languagesCount.innerText = `${countedLanguages} Languages`;
  userTitle.innerText = `${maxKey} Master`;

  displayCharts(langsFrequency, langsPercentages);
  languages = [];
  langsFrequency = {};
  langsPercentages = [];
  countedLanguages = 0;
}

let pieChartInstance;
let barChartInstance;

function displayCharts(langsFrequency, langsPercentages) {
  // Destroy previous chart instances if they exist
  if (pieChartInstance && barChartInstance) {
    pieChartInstance.destroy();
    barChartInstance.destroy();
  }

  // Create new chart instances
  pieChartInstance = new Chart(pieChart, {
    type: "pie",
    data: {
      labels: Object.keys(langsFrequency),
      datasets: [
        {
          label: "percentage %",
          data: langsPercentages,
          backgroundColor: [
            "Red",
            "Blue",
            "Yellow",
            "Green",
            "Purple",
            "Orange",
          ],
          borderWidth: 1,
        },
      ],
    },
  });

  barChartInstance = new Chart(barChart, {
    type: "bar",
    data: {
      datasets: [
        {
          label: "N* of repos",
          data: langsFrequency,
          backgroundColor: [
            "Red",
            "Blue",
            "Yellow",
            "Green",
            "Purple",
            "Orange",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// async function getFlag(searchedUser) {
//   try {
//     const response = await fetch(api + `s/${searchedUser}`, requestOptions);
//     const data = await response.json();
//     console.log(`location: ${data.location}`);
//   } catch (error) {
//     console.log(error);
//   }
// }

// getFlag();

function getFlag(searchedUser) {
  const delimitersRegex = /[,.\s]+/;
  fetch(api + `s/${searchedUser}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const countrySplit = data.location.split(delimitersRegex);
      console.log(`countrySplit: ${countrySplit}`);
      getFlagEmojis(countrySplit);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

function getFlagEmojis(countrySplit) {
  fetch(emojiApi, requestOptions)
    .then((response) => response.json())
    .then((EmojisData) => {
      const country = countrySplit[countrySplit.length - 1].toLowerCase();

      if (country === "morocco") {
        myFlag.src = EmojisData["morocco"];
      }
      console.log(`country: ${country}`);
      const countryFlagUrl = EmojisData[country];
      if (countryFlagUrl) {
        usersFlag.src = countryFlagUrl;
      } else {
        console.error("Country flag not found for location:", location);
      }
    })
    .catch((error) => {
      console.error("Error fetching emoji data:", error);
    });
}

insightsBtn.addEventListener("click", function eventHandler() {
  reposGrid.classList.add("hidden");
  insightsGrid.classList.remove("hidden");
});

userReposLink.addEventListener("click", function eventHandler() {
  reposGrid.classList.remove("hidden");
  insightsGrid.classList.add("hidden");
});

homePageLink.addEventListener("click", function eventHandler() {
  location.reload();
});
