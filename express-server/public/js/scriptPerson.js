let button = document.getElementById("followPerson");
let urlArray = window.location.href.split("/");
let personID = urlArray[urlArray.length -1];

if (button.innerText === "Unfollow") {
    button.onclick = postUnfollowReq;
}
else {
    button.onclick = postFollowReq;
}

function postFollowReq() {
    button.innerText = "Unfollow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/people/"+personID+"/follow");
}

function postUnfollowReq() {
    button.innerText = "Follow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/people/"+personID+"/unfollow");
}