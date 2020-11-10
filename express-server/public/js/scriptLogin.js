let emailBox = document.getElementById("emailAddress");
let passwordBox = document.getElementById("password");
let button = document.getElementById("login");

button.disabled = true;

emailBox.addEventListener("keyup", enableButton);
passwordBox.addEventListener("keyup", enableButton);
button.addEventListener("click", sendPost);

function enableButton(){
  if (emailBox.value.toString() !== '' && passwordBox.value.toString() !== ''){
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}

function sendPost(){
  let username = emailBox.value.toString();
  let password = passwordBox.value.toString();
  let credentials = {username: username, password: password};
  /*let req = new XMLHttpRequest();

  req.open("POST", "http://localhost:3000/login");
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.onreadystatechange = function () {
    if (req.status === 304){
      console.log("Testing this OUT");
      //window.location.replace(req.responseText);
    }
  };
  req.send(JSON.stringify(credentials));*/
}
