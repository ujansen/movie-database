let followButton = document.getElementById("followPerson");
let urlArray = window.location.href.split("/");
let personID = urlArray[urlArray.length -1].toString();

if (followButton.innerText == "Unfollow") {
    followButton.onclick = postUnfollowReq;
}
else {
    followButton.onclick = postFollowReq;
}

function postFollowReq() {
    let req = new XMLHttpRequest();
    req.open("POST", "/people/"+personID+"/follow");
    req.onreadystatechange = function(){
      if (req.readyState === 4 && req.status === 200){
        window.location.href = req.responseText;
      }
    }
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send();
    followButton.innerText = "Unfollow";
}

function postUnfollowReq() {
    let req = new XMLHttpRequest();
    req.open("POST", "/people/"+personID+"/unfollow");
    req.onreadystatechange = function(){
      if (req.readyState === 4 && req.status === 200){
        window.location.href = req.responseText;
      }
    }
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send();
    followButton.innerText = "Follow";
}
