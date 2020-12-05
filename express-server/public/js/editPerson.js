let id = document.getElementById("id").textContent.toString();
let name = document.getElementById("name");
let about = document.getElementById("about");
let movies = document.getElementById("movies");
let image = document.getElementById("image");

let editButton = document.getElementById("editPerson");
editButton.addEventListener("click", editPerson);
editButton.disabled = true;

let deleteButton = document.getElementById("deletePerson");
deleteButton.addEventListener("click", deletePerson);

name.addEventListener("keyup", enableButton);
movies.addEventListener("keyup", enableButton);

function enableButton() {
    if(name.value.toString() && movies.value.toString()) {
        editButton.disabled = false;
    }
}

function editPerson() {
    name = document.getElementById("name").value.toString();
    about = document.getElementById("about").value.toString();
    movies = document.getElementById("movies").value.toString();
    image = document.getElementById("image").value.toString();
    personObj = {
        id: id,
        name: name,
        about: about,
        image: image,
        movies: movies
    }

    let req = new XMLHttpRequest();
    req.open("PUT", "/people/"+id);
    req.onreadystatechange = function(){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send(JSON.stringify(personObj));
}

function deletePerson() {
    let id = document.getElementById("id").textContent.toString();
    let req = new XMLHttpRequest();
    req.open("DELETE", "/people/"+id);
    req.onreadystatechange = function(){
      if (req.readyState == 4 && req.status === 200){
        window.location.href = req.responseText;
      }
    }
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.setRequestHeader('Accept', 'text/html, application/json');
    req.send();
}
