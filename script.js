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

async function searchMovies(query) {
  var container = document.getElementById("movies");
  if (!container) return;
  container.innerHTML = "Loading...";
  
  try {
    var response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
    var data = await response.json();
    
    if (data.Response === "True") {
      // ✅ Milestone Requirement: .filter() 
      // Filtering out any results that aren't 'movie' type
      const moviesOnly = data.Search.filter(item => item.Type === "movie");
      
      // ✅ Milestone Requirement: .map() 
      // Let's clean up titles using map just to demonstrate the HOF skill
      const cleanedMovies = moviesOnly.map(m => ({
        ...m,
        Title: m.Title.trim()
      }));

      displayMovies(cleanedMovies, "movies");
    } else {
      container.innerHTML = "No movies found";
    }
  } catch (error) {
    container.innerHTML = "Error loading data";
  }
}

function displayMovies(movies, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  movies.forEach(function (movie) {
    var div = document.createElement("div");
    div.className = "card";
    // Inside the forEach loop where you create the card:
    const viewBtn = document.createElement("button");
    viewBtn.innerText = "View Info";
    viewBtn.onclick = () => alert(`Movie: ${movie.Title}\nYear: ${movie.Year}\nID: ${movie.imdbID}`);
    // Append this to your card actions
    var moviePoster = movie.Poster === "N/A" ? "https://www.prokerala.com/movies/assets/img/no-poster-available.jpg" : movie.Poster;
    
    // Enhanced UI: Added card-info to show metadata by default
    div.innerHTML = `
      <img src="${moviePoster}">
      <div class="card-info">
        <h3>${movie.Title}</h3>
        <p><span style="color:#46d369">98% Match</span> ${movie.Year}</p>
        <div class="actions">
          <button class="watch-btn">+ Watch</button>
          <button class="like-btn">♥</button>
        </div>
      </div>
    `;

    div.querySelector(".watch-btn").onclick = () => addToWatchlist(movie);
    div.querySelector(".like-btn").onclick = () => alert("Liked " + movie.Title);
    container.appendChild(div);
  });
}

// FIXED: Added displayMovies call inside loadCategory
async function loadCategory(query, containerId) {
  var res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=5844ec07`);
  var data = await res.json();
  if (data.Response === "True") {
    // Milestone Requirement: .sort() - Sorting by Year Descending
    let sortedData = data.Search.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    displayMovies(sortedData, containerId);
  }
}

async function setHeroMovie() {
  var res = await fetch("https://www.omdbapi.com/?s=batman&apikey=5844ec07");
  var data = await res.json();
  if (data.Response === "True") {
    var randomMovie = data.Search[Math.floor(Math.random() * data.Search.length)];
    document.getElementById("heroPoster").src = randomMovie.Poster;
    document.getElementById("heroTitle").innerText = randomMovie.Title;
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

// FIXED: Simplified Toggle Logic
function toggleMode() {
  var body = document.body;
  var toggle = document.querySelector(".toggle");
  
  if (body.classList.contains("dark")) {
    body.classList.replace("dark", "light");
    toggle.classList.remove("active");
  } else {
    body.classList.replace("light", "dark");
    toggle.classList.add("active");
  }
}

// Initialize
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
// Function to sort results dynamically using .sort()
function sortMovies(criteria, moviesArray) {
  let sorted;
  if (criteria === "year-desc") {
    sorted = [...moviesArray].sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (criteria === "year-asc") {
    sorted = [...moviesArray].sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (criteria === "title") {
    sorted = [...moviesArray].sort((a, b) => a.Title.localeCompare(b.Title));
  }
  displayMovies(sorted, "movies");
}