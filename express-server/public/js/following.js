let url = window.location.href;
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -2];
console.log(userID);

//let pageNum = document.getElementById("pageNum"); // easier to get this since the page number is being passed from the server directly
let pageNum;
if(url.lastIndexOf("page=") == -1) {
  pageNum = 1;
}
else {
  pageNum = Number(url.slice(url.lastIndexOf("page=") + 5, url.length));
}
console.log(pageNum);

let prev = document.getElementById("previous");
let next = document.getElementById("next");

prev.addEventListener("click", previousPage);
next.addEventListener("click", nextPage);

function previousPage() {
  let req = new XMLHttpRequest();
  req.open("GET", "/users/" + userID + "/following?page=" + (pageNum - 1).toString());
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}

function nextPage() {
  let req = new XMLHttpRequest();
  req.open("GET", "/users/" + userID + "/following?page=" + (pageNum + 1).toString());
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
   }
 };
  req.send();
}
