let checkbox = document.getElementById("toggleContributing");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];

checkbox.addEventListener("onclick", changeUserType);

function changeUserType() {
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users"+userID+"/toggle");
    //req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
}
