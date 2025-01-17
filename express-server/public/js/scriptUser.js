let checkbox = document.getElementById("toggleContributing");
let urlArray = window.location.href.split("/");
let userID = urlArray[urlArray.length -1];
checkbox.addEventListener("click", changeUserType);

function changeUserType() {
    let req = new XMLHttpRequest();
    req.open("POST", "/users/"+userID+"/toggle");
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.onreadystatechange = function (){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send();
}
