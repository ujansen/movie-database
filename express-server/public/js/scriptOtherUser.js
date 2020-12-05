let button = document.getElementById("follow-user");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];
let followers = document.getElementById("followerList");
let following = document.getElementById("followingList");

if (button.innerText == "Unfollow") {
    button.onclick = postUnfollowReq;
}
else {
    button.onclick = postFollowReq;
}
followers.onclick = getFollowerList;
following.onclick = getFollowingList;
//following.setAttribute("href", "")

function postFollowReq() {
    button.innerText = "Unfollow";
    let req = new XMLHttpRequest();
    req.open("POST", "/users/"+userID+"/follow");
    req.onreadystatechange = function (){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send();
}

function postUnfollowReq() {
    button.innerText = "Follow";
    let req = new XMLHttpRequest();
    req.open("POST", "/users/"+userID+"/unfollow");
    req.onreadystatechange = function (){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
      }
   };
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send();
}

function getFollowerList() {
  let req = new XMLHttpRequest();
  req.open("GET", "/users/"+ userID +"/getFollowers");
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
    }
    else if(req.readyState == 4 && req.status == 401) {
      alert(req.responseText);
    }
    else if(req.readyState == 4 && req.status == 404) {
      alert(req.responseText);
    }
  };
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.setRequestHeader('Accept', 'text/html, application/json');
  req.send();
}

function getFollowingList() {
  let req = new XMLHttpRequest();
  req.open("GET", "/users/"+ userID +"/getFollowing");
  req.onreadystatechange = function (){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
    }
    else if(req.readyState == 4 && req.status == 401) {
      alert(req.responseText);
    }
    else if(req.readyState == 4 && req.status == 404) {
      alert(req.responseText);
    }
  };
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.setRequestHeader('Accept', 'text/html, application/json');
  req.send();
}
