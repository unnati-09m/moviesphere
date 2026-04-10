let exploreMoviesList = []; 

// toggle 
function toggleMode() {
  var body = document.body;
  var toggleCircle = document.querySelector(".toggle");
  
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");
    localStorage.setItem("theme", "light"); 
    if (toggleCircle) toggleCircle.classList.remove("active");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
    localStorage.setItem("theme", "dark"); 
    if (toggleCircle) toggleCircle.classList.add("active");
  }
}

function applySavedTheme() {
  var savedTheme = localStorage.getItem("theme") || "dark";
  document.body.className = savedTheme;
  
  var toggleCircle = document.querySelector(".toggle");
  if (toggleCircle) {
    if (savedTheme === "dark") {
      toggleCircle.classList.add("active");
    } else {
      toggleCircle.classList.remove("active");
    }
  }
}

// Movie Display Logic
function displayMovies(movies, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = ""; 

  movies.forEach(function(movie) {
    if (movie.Poster === "N/A" || !movie.Poster) return;

    var div = document.createElement("div");
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
      </div>
    `;
    container.appendChild(div);
  });
}

// Fetch Categories
async function loadCategory(query, containerId) {
  var res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
  var data = await res.json();
  if (data.Response === "True") {
    displayMovies(data.Search, containerId);
  }
}

// SEARCH LOGIC
function initiateSearch() {
    const query = document.getElementById("navSearch").value;
    if (query) {
        // Redirects to search.html with the query in the URL
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
}

async function loadSearchResults() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    
    // Uses the "movies" div in search.html
    if (query && document.getElementById("movies")) {
        loadCategory(query, "movies");
    }
}

// Explore All Movies Logic
async function loadAllAvailableMovies(query, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "<h3>Loading Movies...</h3>";

  let allResults = [];
  for (let i = 1; i <= 5; i++) {
    var res = await fetch(`https://www.omdbapi.com/?s=${query}&page=${i}&apikey=5844ec07`);
    var data = await res.json();
    if (data.Response === "True") {
      allResults = allResults.concat(data.Search);
    }
  }
  exploreMoviesList = allResults.filter(m => m.Poster !== "N/A");
  displayMovies(exploreMoviesList, containerId);
}

function sortExploreMovies() {
  var sortValue = document.getElementById("sortSelect").value;
  var sortedList = [...exploreMoviesList];

  if (sortValue === "year-desc") {
    sortedList.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortValue === "year-asc") {
    sortedList.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (sortValue === "alpha") {
    sortedList.sort((a, b) => a.Title.localeCompare(b.Title));
  }
  displayMovies(sortedList, "exploreGrid");
}

// Watchlist & Favorites Logic
function addToWatchlist(movie) {
  var list = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!list.find(m => m.imdbID === movie.imdbID)) {
    list.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(list));
    alert("Added to Watchlist!");
  }
}

function displayWatchlist() {
  var list = JSON.parse(localStorage.getItem("watchlist")) || [];
  var container = document.getElementById("watchlistContainer");
  if (!container) return;
  
  if (list.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No movies in your watchlist yet.</p>";
    return;
  }

  container.innerHTML = "";
  list.forEach(movie => {
    var div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${movie.Poster}">
      <div class="card-info">
        <h3>${movie.Title}</h3>
        <div class="actions">
          <button class="watch-btn" onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
          <button class="like-btn" onclick='addToFavorites(${JSON.stringify(movie).replace(/'/g, "&apos;")})'><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function removeFromWatchlist(id) {
  var list = JSON.parse(localStorage.getItem("watchlist")) || [];
  var newList = list.filter(m => m.imdbID !== id);
  localStorage.setItem("watchlist", JSON.stringify(newList));
  displayWatchlist();
}

function addToFavorites(movie) {
  var list = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!list.find(m => m.imdbID === movie.imdbID)) {
    list.push(movie);
    localStorage.setItem("favorites", JSON.stringify(list));
    alert("Added to Favorites!");
  }
}

function displayFavorites() {
  var list = JSON.parse(localStorage.getItem("favorites")) || [];
  var container = document.getElementById("favoritesContainer");
  if (!container) return;
  
  if (list.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No favorites added yet.</p>";
    return;
  }

  container.innerHTML = "";
  list.forEach(movie => {
    var div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${movie.Poster}">
      <div class="card-info">
        <h3>${movie.Title}</h3>
        <div class="actions">
          <button class="watch-btn" onclick='addToWatchlist(${JSON.stringify(movie).replace(/'/g, "&apos;")})'>+ Watchlist</button>
          <button class="like-btn" onclick="removeFromFavorites('${movie.imdbID}')">💔</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function removeFromFavorites(id) {
  var list = JSON.parse(localStorage.getItem("favorites")) || [];
  var newList = list.filter(m => m.imdbID !== id);
  localStorage.setItem("favorites", JSON.stringify(newList));
  displayFavorites();
}

async function setHeroMovie() {
  var res = await fetch(`https://www.omdbapi.com/?t=Interstellar&apikey=5844ec07`);
  var movie = await res.json();
  if (movie.Response === "True") {
    document.getElementById("heroPoster").src = movie.Poster;
    document.getElementById("heroTitle").innerText = movie.Title;
    document.getElementById("heroText").innerText = movie.Plot;
  }
}

// Master Initialization
window.onload = function() {
  applySavedTheme();

  // Home Page
  if (document.getElementById("heroTitle")) {
    setHeroMovie();
    loadCategory("comedy", "comedy");
    loadCategory("star", "scifi");
    loadCategory("action", "action");
    loadCategory("romance", "romance"); 

    // Connect search button
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.onclick = initiateSearch;
    }
  }

  // Search Results Page
  if (window.location.pathname.includes("search.html")) {
    loadSearchResults();
  }

  // Movies Page 
  if (document.getElementById("exploreGrid")) {
    loadAllAvailableMovies("movie", "exploreGrid");
  }

  // Watchlist Page
  if (document.getElementById("watchlistContainer")) {
    displayWatchlist();
  }

  // Favorites Page
  if (document.getElementById("favoritesContainer")) {
    displayFavorites();
  }
};