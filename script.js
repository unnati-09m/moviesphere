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