// --- NAVBAR & SEARCH LOGIC ---
var icon = document.getElementById("searchIcon");
var input = document.getElementById("navSearch");
var searchBtn = document.getElementById("searchBtn");

if (icon && input && searchBtn) {
  icon.onclick = () => { input.style.display = "block"; input.focus(); };
  input.onkeypress = (e) => { if (e.key === "Enter") goToSearchPage(); };
  searchBtn.onclick = () => goToSearchPage();
}

function goToSearchPage() {
  var query = input.value;
  if (query === "") { alert("Please enter a movie name"); return; }
  window.location.href = "search.html?q=" + query;
}

// --- STATE & HERO SECTION ---
let currentSearchResults = []; 

async function setHeroMovie() {
  // Array of keywords to get a random vibe each time
  const topics = ["Avengers", "Batman", "Interstellar", "Star Wars", "Inception", "Joker"];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  try {
    const res = await fetch(`https://www.omdbapi.com/?s=${randomTopic}&apikey=5844ec07`);
    const data = await res.json();

    if (data.Response === "True") {
      const randomMovie = data.Search[Math.floor(Math.random() * data.Search.length)];
      
      // Update UI Elements
      const heroPoster = document.getElementById("heroPoster");
      const heroTitle = document.getElementById("heroTitle");
      const heroText = document.getElementById("heroText");

      if (heroPoster) heroPoster.src = randomMovie.Poster;
      if (heroTitle) heroTitle.innerText = randomMovie.Title;

      // SECOND FETCH: Get movie details (Plot/Description)
      const detailRes = await fetch(`https://www.omdbapi.com/?i=${randomMovie.imdbID}&apikey=5844ec07`);
      const details = await detailRes.json();
      if (heroText) heroText.innerText = details.Plot;
    }
  } catch (err) {
    console.log("Hero Error:", err);
  }
}

// --- CORE LOGIC: SEARCH & CATEGORIES ---
async function searchMovies(query) {
  var container = document.getElementById("movies");
  if (!container) return;
  container.innerHTML = "Loading...";

  try {
    var response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
    var data = await response.json();

    if (data.Response === "True") {
      // ✅ HOF: .filter() and .map() - REQ FOR MILESTONE
      currentSearchResults = data.Search
        .filter(movie => movie.Poster !== "N/A")
        .map(movie => ({ ...movie, Title: movie.Title.trim() }));

      displayMovies(currentSearchResults, "movies");
    } else {
      container.innerHTML = "No movies found";
    }
  } catch (error) {
    container.innerHTML = "Error loading data";
  }
}

async function loadCategory(query, containerId) {
  var res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
  var data = await res.json();
  if (data.Response === "True") {
    displayMovies(data.Search, containerId);
  }
}

// --- DISPLAY & SORTING ---
function displayMovies(movies, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  movies.forEach(function (movie) {
    var div = document.createElement("div");
    div.className = "card";
    var poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Poster";
    
    div.innerHTML = `
      <img src="${poster}">
      <div class="card-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <div class="actions">
          <button class="watch-btn" onclick='addToWatchlist(${JSON.stringify(movie).replace(/'/g, "&apos;")})'>+ Watchlist</button>
          <button class="like-btn" onclick='addToFavorites(${JSON.stringify(movie).replace(/'/g, "&apos;")})'>❤️</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// --- SORTING LOGIC ---
const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.onchange = async (e) => {
    const criteria = e.target.value;
    
    // 1. Sort Search Results (if they exist)
    if (currentSearchResults.length > 0) {
      applySort(currentSearchResults, criteria);
      displayMovies(currentSearchResults, "movies");
    }

    // 2. Sort Home Categories (Comedy, Romance, etc.)
    const categories = [
      { query: "comedy", id: "comedy" },
      { query: "romance", id: "romance" },
      { query: "sci-fi", id: "scifi" },
      { query: "action", id: "action" }
    ];

    categories.forEach(async (cat) => {
      const container = document.getElementById(cat.id);
      if (!container) return; // Only runs if on Home Page

      var res = await fetch(`https://www.omdbapi.com/?s=${cat.query}&apikey=5844ec07`);
      var data = await res.json();
      if (data.Response === "True") {
        let movies = data.Search;
        applySort(movies, criteria); 
        displayMovies(movies, cat.id);
      }
    });
  };
}

// Helper for sorting
function applySort(array, criteria) {
  if (criteria === "year-desc") array.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  else if (criteria === "year-asc") array.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  else if (criteria === "alpha") array.sort((a, b) => a.Title.localeCompare(b.Title));
}
// --- WATCHLIST LOGIC ---
function addToWatchlist(movie) {
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (watchlist.some(m => m.imdbID === movie.imdbID)) {
    alert("Already in watchlist!");
  } else {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Added to Watchlist!");
  }
}

function displayWatchlist() {
    const container = document.getElementById("watchlistContainer");
    if (!container) return;
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    container.innerHTML = watchlist.length ? "" : "<h3>Your watchlist is empty.</h3>";
    

    watchlist.forEach(movie => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <img src="${movie.Poster}">
            <div class="card-info">
                <h3>${movie.Title}</h3>
                <button class="remove-btn" onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function removeFromWatchlist(id) {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    list = list.filter(m => m.imdbID !== id); // ✅ HOF: .filter()
    localStorage.setItem("watchlist", JSON.stringify(list));
    displayWatchlist();
}

// --- THEME & INIT ---
function toggleMode() {
  const body = document.body;
  const toggleCircle = document.querySelector(".toggle");
  
  body.classList.toggle("dark");
  body.classList.toggle("light");
  toggleCircle.classList.toggle("active");
}
window.onload = () => {
  var params = new URLSearchParams(window.location.search);
  var q = params.get("q");
  if (q) searchMovies(q);

  if (document.getElementById("heroTitle")) {
    setHeroMovie();
    loadCategory("comedy", "comedy");
    loadCategory("romance", "romance");
    loadCategory("sci-fi", "scifi");
    loadCategory("action", "action");
  }
  displayWatchlist();
};

// fav logic
function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.some(m => m.imdbID === movie.imdbID)) {
    alert("Already in Favorites!");
  } else {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to Favorites!");
  }
}

function displayFavorites() {
    const container = document.getElementById("favoritesContainer");
    if (!container) return;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    container.innerHTML = favorites.length ? "" : "<h3>Your favorites list is empty.</h3>";

    favorites.forEach(movie => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <img src="${movie.Poster}">
            <div class="card-info">
                <h3>${movie.Title}</h3>
                <button class="remove-btn" onclick="removeFromFavorites('${movie.imdbID}')">Remove</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function removeFromFavorites(id) {
    let list = JSON.parse(localStorage.getItem("favorites")) || [];
    list = list.filter(m => m.imdbID !== id);
    localStorage.setItem("favorites", JSON.stringify(list));
    displayFavorites();
}