let movieTitle = document.getElementById("movieTitle");
let movieGenre = document.getElementById("movieGenre");
let movieMinRating = document.getElementById("movieMinRating");
let movieYear = document.getElementById("movieYear");

let url = window.location.href;

//let pageNum = document.getElementById("pageNum"); // easier to get this since the page number is being passed from the server directly
let pageNum;
if(url.lastIndexOf("page=") == -1) {
  pageNum = 1;
}
else {
  pageNum = Number(url.slice(url.lastIndexOf("page=") + 5, url.length));
}
console.log(pageNum);
let remainingQuery = url.slice(url.lastIndexOf("?"), url.lastIndexOf("page="));
if(remainingQuery == "") {
  remainingQuery = "?";
}
console.log(remainingQuery);
let prev = document.getElementById("previous");
let next = document.getElementById("next");

let searchDB = document.getElementById("submitSearch");
searchDB.addEventListener("click", searchDatabaseRequest);
/* let searchIMDB = document.getElementById("searchIMDB");
searchIMDB.addEventListener("click", searchIMDBRequest); */

prev.addEventListener("click", previousPage);
next.addEventListener("click", nextPage);

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
  req.open("GET", "/movies/search/" + searchQuery);
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}

function previousPage() {
  let req = new XMLHttpRequest();
  req.open("GET", "/movies/search/" + remainingQuery + "page=" + (pageNum - 1).toString());
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}

function nextPage() {
  let req = new XMLHttpRequest();
  req.open("GET", "/movies/search/" + remainingQuery + "page=" + (pageNum + 1).toString());
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}

/*
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
*/
