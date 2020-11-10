let emailBox = document.getElementById("emailAddress");
let usernameBox = document.getElementById("username");
let passwordBox = document.getElementById("password");
let confirmPasswordBox = document.getElementById("confirmPassword");
let termsAndConditions = document.getElementById("termsAndConditions");
let button = document.getElementById("register");

button.disabled = true;

emailBox.addEventListener("keyup", enableButton);
passwordBox.addEventListener("keyup", enableButton);
confirmPasswordBox.addEventListener("keyup", enableButton);
termsAndConditions.addEventListener("change", enableButton);
button.addEventListener("click", sendPost);

function enableButton(){
  console.log("Button Enabled");
  if (emailBox.value.toString() !== '' && passwordBox.value.toString() !== '' && confirmPasswordBox.value.toString() !== '' && termsAndConditions.checked){
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}

function sendPost(){
  let username = usernameBox.value.toString();
  let password = passwordBox.value.toString();

  let credentials = {username: username, password: password};
  /*
  let req = new XMLHttpRequest();
  req.open("POST", "http://localhost:3000/users");
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.send(JSON.stringify(credentials));
  */
}
