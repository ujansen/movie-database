let emailBox = document.getElementById("emailAddress");
let passwordBox = document.getElementById("password");
let confirmPasswordBox = document.getElementById("confirmPassword");
let termsAndConditions = document.getElementById("termsAndConditions");
let button = document.getElementById("register");

button.disabled = true;

emailBox.addEventListener("keyup", enableButton);
passwordBox.addEventListener("keyup", enableButton);
//confirmPasswordBox.addEventListener("keyup", enableButton);
confirmPasswordBox.addEventListener("keyup", check);
termsAndConditions.addEventListener("change", enableButton);

function enableButton(){
  if (emailBox.value.toString() !== '' && passwordBox.value.toString() !== '' && confirmPasswordBox.value.toString() !== '' && termsAndConditions.checked){
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}

function check() {
  if (confirmPasswordBox.value.toString() !== passwordBox.value.toString()) {
      confirmPasswordBox.setCustomValidity('Password Must be Matching.');
  } else {
      // input is valid -- reset the error message
      confirmPasswordBox.setCustomValidity('');
  }
}

/*
function postUser() {
  if(passwordBox.value.toString() !== confirmPasswordBox.value.toString()) {
    alert("Passwords do not match. Please try again!");
  }
}
let req = new XMLHttpRequest();
req.open("POST", "http://localhost:3000/users");
req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
req.send(JSON.stringify(credentials));
*/
