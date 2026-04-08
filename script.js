var icon = document.getElementById("searchIcon");
var input = document.getElementById("navSearch");
var searchBtn = document.getElementById("searchBtn");

// --- NAVBAR LOGIC ---
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

// --- STATE MANAGEMENT ---
let currentSearchResults = []; 

// --- SEARCH LOGIC ---
async function searchMovies(query) {
  var container = document.getElementById("movies");
  if (!container) return;
  container.innerHTML = "Loading...";

  try {
    var response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
    var data = await response.json();

    if (data.Response === "True") {
      // ✅ HOF: .filter() and .map()
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

// --- UNIVERSAL SORTING LOGIC ---
const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.onchange = async (e) => {
    const criteria = e.target.value;
    
    // Check if we are on the Search Page (if search results exist)
    if (currentSearchResults.length > 0) {
      let sortedData = [...currentSearchResults];
      applySort(sortedData, criteria);
      displayMovies(sortedData, "movies");
    } 
    
    //   Home Page Categories if they exist
    const categories = [
      { query: "comedy", id: "comedy" },
      { query: "romance", id: "romance" },
      { query: "sci-fi", id: "scifi" },
      { query: "action", id: "action" }
    ];

    categories.forEach(async (cat) => {
      const container = document.getElementById(cat.id);
      if (!container) return; // Skip if not on home page

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

// Helper function to handle the HOF .sort() logic
function applySort(array, criteria) {
  if (criteria === "year-desc") {
    array.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (criteria === "year-asc") {
    array.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (criteria === "alpha") {
    array.sort((a, b) => a.Title.localeCompare(b.Title));
  }
}

// --- DISPLAY LOGIC ---
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
          <button class="watch-btn">+ Watchlist</button>
          <button class="like-btn">♥</button>
        </div>
      </div>
    `;

    div.querySelector(".watch-btn").onclick = () => addToWatchlist(movie);
    div.querySelector(".like-btn").onclick = (e) => {
      e.target.style.color = "#e50914"; 
    };
    
    container.appendChild(div);
  });
}

// --- CATEGORY LOADING ---
async function loadCategory(query, containerId) {
  var res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
  var data = await res.json();
  if (data.Response === "True") {
    displayMovies(data.Search, containerId);
  }
}

async function setHeroMovie() {
  var res = await fetch("https://www.omdbapi.com/?s=batman&apikey=5844ec07");
  var data = await res.json();
  if (data.Response === "True") {
    var randomMovie = data.Search[Math.floor(Math.random() * data.Search.length)];
    var heroPoster = document.getElementById("heroPoster");
    var heroTitle = document.getElementById("heroTitle");
    if(heroPoster) heroPoster.src = randomMovie.Poster;
    if(heroTitle) heroTitle.innerText = randomMovie.Title;
  }
}

function addToWatchlist(movie) {
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (watchlist.some(m => m.imdbID === movie.imdbID)) {
    alert("Already in watchlist!");
  } else {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Added!");
  }
}

function toggleMode() {
  var body = document.body;
  var toggle = document.querySelector(".toggle");
  body.classList.toggle("dark");
  body.classList.toggle("light");
  if(toggle) toggle.classList.toggle("active");
}

// --- INITIALIZE ---
window.onload = () => {
  var params = new URLSearchParams(window.location.search);
  var queryValue = params.get("q");
  if (queryValue) searchMovies(queryValue);

  if (document.getElementById("heroTitle")) {
    setHeroMovie();
    loadCategory("comedy", "comedy");
    loadCategory("romance", "romance");
    loadCategory("sci-fi", "scifi");
    loadCategory("action", "action");
  }
};
// --- WATCHLIST PAGE LOGIC ---
function displayWatchlist() {
    const container = document.getElementById("watchlistContainer");
    if (!container) return;

    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    container.innerHTML = "";

    if (watchlist.length === 0) {
        container.innerHTML = "<h3>Your watchlist is empty. Start adding some movies!</h3>";
        return;
    }

    // Reuse your existing display logic but add a Remove button
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
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    // ✅ HOF: Using .filter() to remove the item
    watchlist = watchlist.filter(m => m.imdbID !== id);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    displayWatchlist(); // Refresh the page
}