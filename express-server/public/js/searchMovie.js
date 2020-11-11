let movieTitle = document.getElementById("movieTitle");
let movieGenre = document.getElementById("movieGenre");
let movieMinRating = document.getElementById("movieMinRating");
let movieYear = document.getElementById("movieYear");

let searchDB = document.getElementById("submitSearch");
searchDB.addEventListener("click", searchDatabaseRequest);
let searchIMDB = document.getElementById("searchIMDB");
searchIMDB.addEventListener("click", searchIMDBRequest);

function searchDatabaseRequest() {
  let searchQuery = "?";
  searchTitle = movieTitle.value.toString();
  if(searchTitle) {
    searchQuery += "title=";
    searchQuery += searchTitle.trim().split(" ").join("+");
  }

  searchGenre = movieGenre.value.toString();
  if(searchGenre) {
    searchQuery += "&";
    searchQuery += "genre=";
    searchQuery += searchGenre.trim().split(" ").join("+");
  }

  searchMinRating = movieMinRating.value.toString();
  if(searchMinRating && Number(searchMinRating.trim()) > 0 && Number(searchMinRating.trim()) <= 10) {
    searchQuery += "&";
    searchQuery += "minRating=";
    searchQuery += searchMinRating.trim();
  }

  searchYear = movieYear.value.toString();
  if(searchYear && Number(searchYear.trim()) > 1600 && Number(searchYear.trim()) <= 2030) {
    searchQuery += "&";
    searchQuery += "year=";
    searchQuery += searchYear.trim();
  }
  let req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/movies/search/" + searchQuery);
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      console.log(req.responseText);
      window.location.href = req.responseText;
   }
 };
  req.send();
}

function searchIMDBRequest() {
  let searchQuery = "";
  if(movieTitle.value) {
    movieTitle = movieTitle.value.toString();
    searchQuery = movieTitle.trim().split(" ").join("+");
  }
  let req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/searchIMDB/"+searchQuery);
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      console.log(req.responseText);
      window.location.href = req.responseText;
   }
 };
  req.send();
}
