let username = document.getElementById("username");

let searchDB = document.getElementById("submitSearch");
searchDB.addEventListener("click", searchDatabaseRequest);

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

prev.addEventListener("click", previousPage);
next.addEventListener("click", nextPage);


function searchDatabaseRequest() {
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
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.setRequestHeader('Accept', 'text/html, application/json');
  req.send();
}


function previousPage() {
  let req = new XMLHttpRequest();
  req.open("GET", "/users/search/" + remainingQuery + "page=" + (pageNum - 1).toString());
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}

function nextPage() {
  let req = new XMLHttpRequest();
  req.open("GET", "/users/search/" + remainingQuery + "page=" + (pageNum + 1).toString());
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}
