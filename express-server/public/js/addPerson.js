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
    req.open("POST", "http://localhost:3000/people");
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send(JSON.stringify(personObj));
}
