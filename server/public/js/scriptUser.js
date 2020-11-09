let checkbox = document.getElementById("toggleContributing");
let userID = document.getElementById("username");

checkbox.addEventListener("onclick", changeUserType);

function changeUserType() {
    let req = new XMLHttpRequest();
    req.open("PUT", "http://localhost:3000/users"+userID, true, userID);
    //req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
}
