let movieTitle = document.getElementById("movieTitle");
let movieGenre = document.getElementById("movieGenre");
let movieMinRating = document.getElementById("movieMinRating");
let movieYear = document.getElementById("movieYear");

let searchDB = document.getElementById("submitSearch");
searchDB.addEventListener("click", searchDatabaseRequest);
let searchIMDB = document.getElementById("searchIMDB");
searchIMDB.addEventListener("click", searchIMDBRequest);

function searchDatabaseRequest() {
  let searchQuery = "";

  movieTitle = movieTitle.value.toString();
  if(movieTitle) {
    searchQuery += "title=";
    searchQuery += movieTitle.trim().split(" ").join("+");
  }

  movieGenre = movieGenre.value.toString();
  if(movieGenre) {
    searchQuery += "&";
    searchQuery += "genre=";
    searchQuery += movieGenre.trim().split(" ").join("+");
  }

  movieMinRating = movieMinRating.value.toString();
  if(movieMinRating && Number(movieMinRating.trim()) > 0 && Number(movieMinRating.trim()) <= 10) {
    searchQuery += "&";
    searchQuery += "minRating=";
    searchQuery += movieMinRating.trim();
  }

  movieYear = movieYear.value.toString();
  if(movieYear && Number(movieYear.trim()) > 1600 && Number(movieMinRating.trim()) <= 2030) {
    searchQuery += "&";
    searchQuery += "year=";
    searchQuery += movieYear.trim();
  }
  console.log(searchQuery);
  let req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/movies?"+searchQuery);
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}

function searchIMDBRequest() {
  console.log("Here");
  let searchQuery = "";
  if(movieTitle.value) {
    movieTitle = movieTitle.value.toString();
    searchQuery = movieTitle.trim().split(" ").join("+");
  }
  let req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/searchIMDB/"+searchQuery);
  req.send();
}
