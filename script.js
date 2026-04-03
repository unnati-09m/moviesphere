let icon = document.getElementById("searchIcon");
let input = document.getElementById("navSearch");

icon.addEventListener("click", function () {
  input.style.display = "block";
  input.focus();
});

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovies(input.value);
  }
});
let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
  searchMovies(input.value);
});

// movie api fetch
async function searchMovies(query) {

  let container = document.getElementById("movies");

  container.innerHTML = "Loading...";

  try {
    let res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
    let data = await res.json();

    if (data.Response === "False") {
      container.innerHTML = "No movies found";
      return;
    }

    displayMovies(data.Search);

  } catch {
    container.innerHTML = "Error";
  }
}

// Movie-display 

function displayMovies(movies) {

  let container = document.getElementById("movies");
  container.innerHTML = "";

  movies.forEach(function (movie) {

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}">
      <h3>${movie.Title}</h3>
    `;

    container.appendChild(div);
  });
}

// dark-white

function toggleMode() {
  let body = document.body;
  let toggle = document.querySelector(".toggle");

  body.classList.toggle("light");
  body.classList.toggle("dark");

  toggle.classList.toggle("active");
}


// background

async function setHeroMovie() {

  let res = await fetch(`https://www.omdbapi.com/?s=batman&apikey=5844ec07`);
  let data = await res.json();

  let movies = data.Search;

  let randomMovie = movies[Math.floor(Math.random() * movies.length)];

  // poster
  if (randomMovie.Poster !== "N/A") {
    document.getElementById("heroPoster").src = randomMovie.Poster;
  }

  // title
  document.getElementById("heroTitle").innerText = randomMovie.Title;
}