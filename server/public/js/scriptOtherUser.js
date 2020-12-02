let button = document.getElementById("follow-user");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];

button.addEventListener("click", postFollowReq);
// handler for unfollow?

function postFollowReq() {
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/follow");
}

function postUnfollowReq() {
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/unfollow");
}