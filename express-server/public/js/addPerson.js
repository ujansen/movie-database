let name = document.getElementById("name");
let about = document.getElementById("about");
let movies = document.getElementById("movies");
let image = document.getElementById("image");

let button = document.getElementById("addPerson");
button.addEventListener("click", addPerson);
button.disabled = true;

name.addEventListener("keyup", enableButton);
movies.addEventListener("keyup", enableButton);

function enableButton() {
    if(name.value.toString() && movies.value.toString()) {
        button.disabled = false;
    }
}

function addPerson() {
    name = document.getElementById("name").value.toString();
    about = document.getElementById("about").value.toString();
    movies = document.getElementById("movies").value.toString();
    image = document.getElementById("image").value.toString();

    let personObj = {
        name: name,
        about: about,
        image: image,
        movies: movies
    }
    
    let req = new XMLHttpRequest();
    req.open("POST", "/people");
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.onreadystatechange = function () {
        if(req.readyState === 4 && req.status === 200) {
            window.location.href = req.responseText;
        }
    };
    req.send(JSON.stringify(personObj));
}