/*
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
*/

try {
  let logout = document.getElementById("logout");
  logout.onclick = logoutRedirect;

  function logoutRedirect() {
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/logout");
    req.onreadystatechange = function() {
      if(req.readyState === 4 && req.status === 200) {
        console.log(req.responseText);
        window.location.href = req.responseText;
      }
    }
    req.send();
  }
}
catch (err) {
  // do nothing
}