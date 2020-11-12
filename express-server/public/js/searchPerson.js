let personName = document.getElementById("personName");

let searchDB = document.getElementById("submitSearch");
searchDB.addEventListener("click", searchDatabaseRequest);

function searchDatabaseRequest() {
  let searchQuery = "?";
  searchName = personName.value.toString();
  if(searchName) {
    searchQuery += "name=";
    searchQuery += searchName.trim().split(" ").join("+");
  }

  let req = new XMLHttpRequest();
  req.open("GET", "/people/search/" + searchQuery);
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      console.log(req.responseText);
      window.location.href = req.responseText;
   }
 };
  req.send();
}
