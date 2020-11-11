let emailBox = document.getElementById("emailAddress");
let passwordBox = document.getElementById("password");
let confirmPasswordBox = document.getElementById("confirmPassword");
let termsAndConditions = document.getElementById("termsAndConditions");
let button = document.getElementById("register");

button.disabled = true;

emailBox.addEventListener("keyup", enableButton);
passwordBox.addEventListener("keyup", enableButton);
confirmPasswordBox.addEventListener("keyup", enableButton);
termsAndConditions.addEventListener("change", enableButton);

function enableButton(){
  console.log("Button Enabled");
  if (emailBox.value.toString() !== '' && passwordBox.value.toString() !== '' && confirmPasswordBox.value.toString() !== '' && termsAndConditions.checked){
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}
/*
let req = new XMLHttpRequest();
req.open("POST", "http://localhost:3000/users");
req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
req.send(JSON.stringify(credentials));
*/
