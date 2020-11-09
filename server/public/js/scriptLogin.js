let emailBox = document.getElementById("emailAddress");
let passwordBox = document.getElementById("password");
let button = document.getElementById("login");

button.disabled = true;

emailBox.addEventListener("keyup", enableButton);
passwordBox.addEventListener("keyup", enableButton);
//button.onclick = sendPost;
//console.log("OK5");
button.addEventListener("click", sendPost);

function enableButton(){
  console.log("Button Enabled");
  if (emailBox.value.toString() !== '' && passwordBox.value.toString() !== ''){
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}

function sendPost(){
  //console.log("OK");
  let username = emailBox.value.toString();
  let password = passwordBox.value.toString();
  //console.log("OK1");
  console.log(username);
  console.log(password);
  //console.log("OK3");

  let credentials = {username: username, password: password};
  //console.log(credentials);

  let req = new XMLHttpRequest();
  /* req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
      console.log("All good. " + this.responseText);
      window.location.href = "http://localhost:3000/" + this.responseText;
		}
  } */
  
  req.open("POST", "http://localhost:3000/login");
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  req.send(JSON.stringify(credentials));
}
