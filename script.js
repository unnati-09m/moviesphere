// --- GLOBAL STATE ---
let exploreMoviesList = []; 

// --- THEME & UI LOGIC ---
function toggleMode() {
  const body = document.body;
  const toggleCircle = document.querySelector(".toggle");
  
  body.classList.toggle("dark");
  body.classList.toggle("light");

  const currentMode = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", currentMode);

  if (toggleCircle) {
    currentMode === "dark" ? toggleCircle.classList.add("active") : toggleCircle.classList.remove("active");
  }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.className = savedTheme;
  const toggleCircle = document.querySelector(".toggle");
  if (toggleCircle) {
    if (savedTheme === "dark") toggleCircle.classList.add("active");
    else toggleCircle.classList.remove("active");
  }
}

// --- CORE FETCH & DISPLAY ---
async function loadCategory(query, containerId) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
    const data = await res.json();
    if (data.Response === "True") displayMovies(data.Search, containerId);
  } catch (err) { console.error(err); }
}

async function loadAllAvailableMovies(query, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "<h3>Loading huge collection...</h3>";

    let allMovies = [];
    for (let i = 1; i <= 4; i++) {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&page=${i}&apikey=5844ec07`);
        const data = await res.json();
        if (data.Response === "True") allMovies = allMovies.concat(data.Search);
    }
    // Filter N/A and store in memory for sorting
    exploreMoviesList = allMovies.filter(m => m.Poster !== "N/A");
    displayMovies(exploreMoviesList, containerId);
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.Poster || movie.Poster === "N/A") return;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${movie.Poster}">
      <div class="card-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <div class="actions">
          <button class="watch-btn" onclick='addToWatchlist(${JSON.stringify(movie).replace(/'/g, "&apos;")})'>+ Watchlist</button>
          <button class="like-btn" onclick='addToFavorites(${JSON.stringify(movie).replace(/'/g, "&apos;")})'><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>`;
    container.appendChild(div);
  });
}

// --- SORTING ---
function sortExploreMovies() {
    const val = document.getElementById("sortSelect").value;
    let sorted = [...exploreMoviesList];
    if (val === "year-desc") sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    else if (val === "year-asc") sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    else if (val === "alpha") sorted.sort((a, b) => a.Title.localeCompare(b.Title));
    displayMovies(sorted, "exploreGrid");
}

// --- WATCHLIST & FAVORITES ---
function addToWatchlist(movie) {
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!list.find(m => m.imdbID === movie.imdbID)) {
    list.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(list));
    alert("Added to Watchlist!");
  }
}

function displayWatchlist() {
  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  const container = document.getElementById("watchlistContainer");
  if (!container) return;
  if (list.length === 0) { container.innerHTML = "<p>Your watchlist is empty.</p>"; return; }
  
  container.innerHTML = "";
  list.forEach(movie => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${movie.Poster}"><h3>${movie.Title}</h3><button onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>`;
    container.appendChild(div);
  });
}

function removeFromWatchlist(id) {
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];
  list = list.filter(m => m.imdbID !== id);
  localStorage.setItem("watchlist", JSON.stringify(list));
  displayWatchlist();
}

function addToFavorites(movie) {
  let list = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!list.find(m => m.imdbID === movie.imdbID)) {
    list.push(movie);
    localStorage.setItem("favorites", JSON.stringify(list));
    alert("Added to Favorites!");
  }
}

function displayFavorites() {
  const list = JSON.parse(localStorage.getItem("favorites")) || [];
  const container = document.getElementById("favoritesContainer");
  if (!container) return;
  if (list.length === 0) { container.innerHTML = "<p>No favorites yet.</p>"; return; }
  
  container.innerHTML = "";
  list.forEach(movie => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${movie.Poster}"><h3>${movie.Title}</h3><button onclick="removeFromFavorites('${movie.imdbID}')">Remove</button>`;
    container.appendChild(div);
  });
}

function removeFromFavorites(id) {
  let list = JSON.parse(localStorage.getItem("favorites")) || [];
  list = list.filter(m => m.imdbID !== id);
  localStorage.setItem("favorites", JSON.stringify(list));
  displayFavorites();
}

// --- HERO SECTION ---
async function setHeroMovie() {
  const topics = ["Avengers", "Batman", "Interstellar"];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const res = await fetch(`https://www.omdbapi.com/?s=${topic}&apikey=5844ec07`);
  const data = await res.json();
  if (data.Response === "True") {
    const movie = data.Search[0];
    document.getElementById("heroPoster").src = movie.Poster;
    document.getElementById("heroTitle").innerText = movie.Title;
    document.getElementById("heroText").innerText = "Discover this cinematic masterpiece today.";
  }
}

// --- SEARCH LOGIC ---
function goToSearchPage() {
  const input = document.getElementById("navSearch");
  if (!input || input.value === "") return;
  window.location.href = `search.html?q=${input.value}`;
}

// --- MASTER ONLOAD ---
window.onload = () => {
  applySavedTheme();

  // Search Bar logic
  const icon = document.getElementById("searchIcon");
  const searchBtn = document.getElementById("searchBtn");
  if (icon) icon.onclick = () => document.getElementById("navSearch").style.display = "block";
  if (searchBtn) searchBtn.onclick = () => goToSearchPage();

  // Home Page
  if (document.getElementById("heroTitle")) {
    setHeroMovie();
    loadCategory("comedy", "comedy");
    loadCategory("star", "scifi");
    loadCategory("action", "action");
    loadCategory("love", "romance");
  }
  // Movies Page
  if (document.getElementById("exploreGrid")) loadAllAvailableMovies("movie", "exploreGrid");
  // Lists
  if (document.getElementById("watchlistContainer")) displayWatchlist();
  if (document.getElementById("favoritesContainer")) displayFavorites();
};