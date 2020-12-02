let movieTitle = document.getElementById("movieTitle");
let wait = document.getElementById("wait");

let searchIMDB = document.getElementById("searchIMDB");
searchIMDB.addEventListener("click", searchIMDBRequest);

function searchIMDBRequest() {
  console.log("clicked");
  if (wait){
    wait.innerText = "Please wait for a few moments until the results load...";
  }
  let searchQuery = "";
  if(movieTitle.value) {
    movieTitle = movieTitle.value.toString();
    searchQuery = movieTitle.trim().split(" ").join("+");
  }
  window.location.href = "/searchIMDB/"+searchQuery;
}
