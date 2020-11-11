let editButton = document.getElementById("editPerson");
editButton.addEventListener("click", editPerson);
let deleteButton = document.getElementById("deletePerson");
deleteButton.addEventListener("click", deletePerson);

function editPerson() {
    let id = document.getElementById("id").textContent.toString();
    let name = document.getElementById("name").value.toString();
    let about = document.getElementById("about").value.toString();
    let movies = document.getElementById("movies").value.toString();
    let image = document.getElementById("image").value.toString();
    let personObj = {
        id: id,
        name: name,
        about: about,
        image: image,
        movies: movies
    }
    
    let req = new XMLHttpRequest();
    req.open("PUT", "http://localhost:3000/person/"+id);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    req.send(JSON.stringify(personObj));
}

function deletePerson() {
    let req = new XMLHttpRequest();
    req.open("DELETE", "http://localhost:3000/person/"+id);
    req.send();
}