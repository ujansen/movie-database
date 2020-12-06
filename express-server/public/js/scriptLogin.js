let emailBox = document.getElementById("emailAddress");
let passwordBox = document.getElementById("password");
let button = document.getElementById("login");

button.disabled = true;

emailBox.addEventListener("keyup", enableButton);
passwordBox.addEventListener("keyup", enableButton);
//button.addEventListener("click", sendPost);

function enableButton(){
  if (emailBox.value.toString() !== '' && passwordBox.value.toString() !== ''){
    button.disabled = false;
  }
  else{
    button.disabled = true;
  }
}