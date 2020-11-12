let button = document.getElementById("follow-user");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];

if (button.innerText == "Unfollow") {
    button.onclick = postUnfollowReq;
}
else {
    button.onclick = postFollowReq;
}

function postFollowReq() {
    button.innerText = "Unfollow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/follow");
    req.onreadystatechange = function (){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.send();
}

function postUnfollowReq() {
    button.innerText = "Follow";
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/users/"+userID+"/unfollow");
    req.onreadystatechange = function (){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.send();
}