let editButton = document.getElementById("editMovie");
editButton.addEventListener("click", editMovie);
let deleteButton = document.getElementById("deleteMovie");
deleteButton.addEventListener("click", deleteMovie);

function editMovie() {
    let id = document.getElementById("id").textContent.toString();
    let movieTitle = document.getElementById("movieTitle").value.toString();
    let runtime = document.getElementById("runtime").value.toString();
    let movieYear = document.getElementById("movieYear").value.toString();
    let genreList = document.getElementById("genreList").value.toString();
    let plot = document.getElementById("plot").value.toString();
    let poster = document.getElementById("poster").value.toString();
    let trailer = document.getElementById("trailer").value.toString();
    let actorList = document.getElementById("actorList").value.toString();
    let directorList = document.getElementById("directorList").value.toString();
    let writerList = document.getElementById("writerList").value.toString();
    let movieObj = {
        id: id,
        title: movieTitle,
        runtime: runtime,
        releaseYear: movieYear,
        genre: genreList,
        plot: plot,
        poster: poster,
        trailer: trailer,
        actors: actorList,
        director: directorList,
        writers: writerList
    }

    let req = new XMLHttpRequest();
    req.open("PUT", "http://localhost:3000/movies/"+id);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.onreadystatechange = function(){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.send(JSON.stringify(movieObj));
}

function deleteMovie() {
    let id = document.getElementById("id").textContent.toString();
    let req = new XMLHttpRequest();
    req.open("DELETE", "http://localhost:3000/movies/"+id);
    req.onreadystatechange = function(){
      if(req.readyState == 4 && req.status == 200){
        window.location.href = req.responseText;
     }
   };
    req.send();
}