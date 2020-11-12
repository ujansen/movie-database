let movieTitle = document.getElementById("movieTitle");
let wait = document.getElementById("wait");

let searchIMDB = document.getElementById("searchIMDB");
searchIMDB.addEventListener("click", searchIMDBRequest);

function searchIMDBRequest() {
  console.log("clicked");
  wait.innerText = "Please wait for a few moments until the results load...";
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