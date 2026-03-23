# MovieSphere – Movie Watchlist & Recommender

## Project Overview

This project is a movie discovery and watchlist web application built using JavaScript and public APIs.
The main idea behind the project is to help users search for movies, explore them, and maintain a personalized watchlist.

Along with basic search functionality, the application also focuses on improving user experience by adding sorting, simple recommendations, and a clean UI inspired by modern streaming platforms.

---

## Features

### Live Movie Search

Users can search for movies using keywords, and results are fetched dynamically using the OMDb API.

### Watchlist Toggle

Each movie card has a button to add or remove it from the watchlist.
The watchlist is stored using local storage so it remains saved even after refreshing.

### Sorting Options

Users can sort movies alphabetically (A–Z / Z–A) to organize results better.

### Random Movie Night

A feature where one random movie is selected from the saved watchlist to help users decide what to watch.

### Empty States

Clear messages are shown when:

* No movies are found
* Watchlist is empty

---

## Additional Concepts Used

* Basic recommendation idea based on user interaction (watchlist preferences)
* Use of Array Higher Order Functions like map(), filter(), and sort()
* Local Storage for saving user data

---

## API Used

* OMDb API for fetching movie data

---

## UI & Design

The UI is designed with a dark theme inspired by platforms like Netflix and HBO Max.
A simple and clean layout is used, with a separate section for the watchlist so users can easily track saved movies.

---

## Technologies Used

* HTML
* CSS
* JavaScript (Vanilla JS)
* Fetch API

---

## How to Run the Project

1. Clone the repository
2. Open the project folder
3. Add your OMDb API key in the JavaScript file
4. Open index.html in a browser

---

## Future Improvements

* Add filtering based on year or type
* Improve recommendation system
* Better UI animations and responsiveness

---

## Conclusion

This project helped me understand how to work with APIs, handle real-time data, and build interactive user interfaces. It also gave me practical experience in organizing code and improving user experience step by step.
