let followButton = document.getElementById("followPerson");
let urlArray = window.location.href.split("/");
let personID = urlArray[urlArray.length -1];

if (followButton.innerText == "Unfollow") {
    followButton.onclick = postUnfollowReq;
}
else {
    followButton.onclick = postFollowReq;
}

function postFollowReq() {
    followButton.innerText = "Unfollow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/people/"+personID+"/follow");
    req.onreadystatechange = function(){
      if (req.status === 200){
        window.location.href = req.responseText;
      }
    }
    req.send();
}

function postUnfollowReq() {
    followButton.innerText = "Follow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/people/"+personID+"/unfollow");
    req.onreadystatechange = function(){
      if (req.status === 200){
        window.location.href = req.responseText;
      }
    }
    req.send();
}