let id = document.getElementById("id").textContent.toString();
let editButton = document.getElementById("editUser");
editButton.addEventListener("click", editUser);

function editUser() {
    let username = document.getElementById("username").value.toString();
    let about = document.getElementById("about").value.toString();
    let profilePic = document.getElementById("profilePic").value.toString();
    let oldPassword = document.getElementById("oldPassword").value.toString();
    let newPassword = document.getElementById("newPassword").value.toString();
    let confirmNewPassword = document.getElementById("confirmNewPassword").value.toString();

    if(oldPassword) {
      // make changes
      // check if old password is same as what is on server
      // if yes
      if(newPassword === "" && confirmNewPassword === "") {
        // password not being changed
        let userObj = {
          "id": id,
          "username": username,
          "about": about,
          "profilePic": profilePic,
          "password": oldPassword
        }
        sendRequest(userObj);
      }
      else if(newPassword === confirmNewPassword) {
        // change
        let userObj = {
          "id": id,
          "username": username,
          "about": about,
          "profilePic": profilePic,
          "oldPassword": oldPassword,
          "password": newPassword
        }
        sendRequest(userObj);
      }
      else {
        alert("New passwords do not match.");
      }
    }
    else {
      alert("Enter your password to confirm changes!");
    }
}

function sendRequest(userObj) {
  let req = new XMLHttpRequest();
  req.open("PUT", "http://localhost:3000/users/" + id);
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.onreadystatechange = function(){
    if(req.readyState == 4 && req.status == 200){
      window.location.href = req.responseText;
    }
    else if(req.readyState == 4 && req.status == 500) {
      alert(req.responseText);
    }
  };
  req.send(JSON.stringify(userObj));
}
