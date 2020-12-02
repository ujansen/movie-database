let searchBar = document.getElementById("searchBar");
let searchButton = document.getElementById("searchButton");

searchButton.disabled = true;
searchBar.addEventListener("keyup", enableButton);

function enableButton(){
  if (searchBar.value.toString() !== ''){
    searchButton.disabled = false;
  }
  else{
    searchButton.disabled = true;
  }
}
