let button = document.getElementById("follow-user");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];

if (button.innerText == "Unfollow") {
    console.log(button.innerText);
    button.onclick = postUnfollowReq;
}
else {
    console.log(button.innerText);
    button.onclick = postFollowReq;
}

function postFollowReq() {
    button.innerText = "Unfollow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/follow");
    req.send();
}

function postUnfollowReq() {
    button.innerText = "Follow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/unfollow");
    req.send();
}