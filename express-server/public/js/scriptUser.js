let checkbox = document.getElementById("toggleContributing");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];
console.log("User trying to toggle is " +userID);
checkbox.addEventListener("click", changeUserType);

function changeUserType() {
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/toggle");
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send();
}
