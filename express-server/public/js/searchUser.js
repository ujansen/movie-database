let username = document.getElementById("username");

let searchDB = document.getElementById("submitSearch");
searchDB.addEventListener("click", searchDatabaseRequest);

function searchDatabaseRequest() {
  console.log("here");
  let searchQuery = "?";
  searchName = username.value.toString();
  if(searchName) {
    searchQuery += "username=";
    searchQuery += searchName.trim().split(" ").join("+");
  }

  let req = new XMLHttpRequest();
  req.open("GET", "/users/search/" + searchQuery);
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      console.log(req.responseText);
      window.location.href = req.responseText;
   }
 };
  req.send();
}
