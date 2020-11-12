let name = document.getElementById("name");
let about = document.getElementById("about");
let movies = document.getElementById("movies");
let image = document.getElementById("image");

let button = document.getElementById("addPerson");
button.addEventListener("click", addPerson);

function addPerson() {
    let name = document.getElementById("name").value.toString();
    let about = document.getElementById("about").value.toString();
    let movies = document.getElementById("movies").value.toString();
    let image = document.getElementById("image").value.toString();

    let personObj = {
        name: name,
        about: about,
        image: image,
        movies: movies
    }

    let req = new XMLHttpRequest();
    req.open("POST", "/people");
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    req.onreadystatechange = function(){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.send(JSON.stringify(personObj));
}
