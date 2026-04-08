// 1. Get all the elements from the HTML
var icon = document.getElementById("searchIcon");
var input = document.getElementById("navSearch");
var searchBtn = document.getElementById("searchBtn");

// 2. Search Bar Toggle (Show input when icon is clicked)
if (icon && input && searchBtn) {
  icon.onclick = function () {
    input.style.display = "block";
    input.focus();
  };

  // Search when Enter key is pressed
  input.onkeypress = function (e) {
    if (e.key === "Enter") {
      goToSearchPage();
    }
  };

  // Search when Button is clicked
  searchBtn.onclick = function () {
    goToSearchPage();
  };
}

// 3. Function to redirect to the search results page
function goToSearchPage() {
  var query = input.value;

  if (query === "") {
    alert("Please enter a movie name");
    return;
  }

  // Use a simple URL string
  window.location.href = "search.html?q=" + query;
}

// 4. Main Function to Fetch Movies from API
async function searchMovies(query) {
  var container = document.getElementById("movies");
  if (!container) return;

  container.innerHTML = "Loading...";

  try {
    var response = await fetch("https://www.omdbapi.com/?s=" + query + "&apikey=5844ec07");
    var data = await response.json();

    if (data.Response === "False") {
      container.innerHTML = "No movies found";
      return;
    }

    var movies = data.Search;


    var filteredMovies = movies.filter(function(movie) {
      return movie.Title.toLowerCase().includes(query.toLowerCase());
    });

displayMovies(filteredMovies, "movies");

  } catch (error) {
    container.innerHTML = "Error loading data";
  }
}

// 5. Function to Display Movies in the HTML
function displayMovies(movies, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = ""; // Clear old content

  movies.forEach(function (movie) {
    var div = document.createElement("div");
    div.className = "card";

    // Fix: If there is no poster, use a placeholder image from the web
// If the poster is N/A, we use a generic image from another source
    var moviePoster = movie.Poster;
    if (moviePoster === "N/A") {
      moviePoster = "https://www.prokerala.com/movies/assets/img/no-poster-available.jpg";
    }

    // Create the HTML for the card
    div.innerHTML = `
      <img src="${moviePoster}">
      <h3>${movie.Title}</h3>
      <button class="watch-btn">+ Watchlist</button>
      <button class="like-btn">♥</button>
    `;

    // Add click event to the watchlist button
    var btn = div.querySelector(".watch-btn");
    btn.onclick = function() {
      addToWatchlist(movie);
    };

    container.appendChild(div);
  });
}

// 6. Category Loading Functions
async function loadCategory(query, containerId) {
  var res = await fetch("https://www.omdbapi.com/?s=" + query + "&apikey=5844ec07");
  var data = await res.json();

  if (data.Response === "True") {
    displayMovies(data.Search, containerId);
  }
}

// 7. Hero Section (Random Batman Movie)
async function setHeroMovie() {
  var res = await fetch("https://www.omdbapi.com/?s=batman&apikey=5844ec07");
  var data = await res.json();
  var movies = data.Search;

  var randomMovie = movies[Math.floor(Math.random() * movies.length)];

  var heroImg = document.getElementById("heroPoster");
  var heroTitle = document.getElementById("heroTitle");

  if (heroImg && randomMovie.Poster !== "N/A") {
    heroImg.src = randomMovie.Poster;
  }
  if (heroTitle) {
    heroTitle.innerText = randomMovie.Title;
  }
}

// 8. Watchlist Logic (LocalStorage)
function addToWatchlist(movie) {
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // Check if already exists to avoid duplicates
  var exists = false;
  for (var i = 0; i < watchlist.length; i++) {
    if (watchlist[i].imdbID === movie.imdbID) {
      exists = true;
      break;
    }
  }

  if (exists) {
    alert("Movie is already in your watchlist!");
  } else {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert(movie.Title + " added to watchlist!");
  }
}

// 9. Light/Dark Mode Toggle
function toggleMode() {
  var body = document.body;
  var toggle = document.querySelector(".toggle");

  body.classList.toggle("light");
  body.classList.toggle("dark");

  if (toggle) {
    toggle.classList.toggle("active");
  }
}

// 10. Run everything when page loads
var params = new URLSearchParams(window.location.search);
var queryValue = params.get("q");

if (queryValue) {
  searchMovies(queryValue);
}

// Only run these on the homepage where these IDs exist
if (document.getElementById("heroTitle")) {
  setHeroMovie();
  loadCategory("comedy", "comedy");
  loadCategory("romance", "romance");
  loadCategory("sci-fi", "scifi");
  loadCategory("action", "action");
}