let movieTitle = document.getElementById("movieTitle");
let runtime = document.getElementById("runtime");
let movieYear = document.getElementById("movieYear");
let genreList = document.getElementById("genreList");
let plot = document.getElementById("plot");
let poster = document.getElementById("poster");
let trailer = document.getElementById("trailer");
let actorList = document.getElementById("actorList");
let directorList = document.getElementById("directorList");
let writerList = document.getElementById("writerList");

let button = document.getElementById("addMovie");
button.addEventListener("click", addMovie);
button.disabled = true;

movieTitle.addEventListener("keyup", enableButton);
genreList.addEventListener("keyup", enableButton);
actorList.addEventListener("keyup", enableButton);
directorList.addEventListener("keyup", enableButton);
writerList.addEventListener("keyup", enableButton);

function enableButton() {
    if (movieTitle.value.toString().trim() && genreList.value.toString().trim() && actorList.value.toString().trim() && directorList.value.toString().trim() && writerList.value.toString().trim() && movieYear.value.toString()) {
        button.disabled = false;
    }
}

function addMovie() {
    let movieTitleVal = movieTitle.value.toString();
    let runtimeVal = runtime.value.toString();
    let movieYearVal = movieYear.value.toString();
    let genreListVal = genreList.value.toString();
    let plotVal = plot.value.toString();
    let posterVal = poster.value.toString();
    let trailerVal = trailer.value.toString();
    let actorListVal = actorList.value.toString();
    let directorListVal = directorList.value.toString();
    let writerListVal = writerList.value.toString();

    if(movieYearVal && Number(movieYearVal) <= 2030 && Number(movieYearVal) >= 1895) {
        if(runtimeVal && Number(runtimeVal) >= 1) {
            let movieObj = {
                title: movieTitleVal,
                runtime: runtimeVal + " min",
                releaseYear: movieYearVal,
                genre: genreListVal,
                plot: plotVal,
                poster: posterVal,
                trailer: trailerVal,
                actors: actorListVal,
                director: directorListVal,
                writers: writerListVal
            }
            
            let req = new XMLHttpRequest();
            req.open("POST", "/movies");
            req.onreadystatechange = function () {
                if(req.readyState === 4 && req.status === 200) {
                    window.location.href = req.responseText;
                }
                else if(req.readyState == 4 && req.status == 500) {
                    alert(req.responseText);
                }
            };
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            req.send(JSON.stringify(movieObj));
        }
        else {
            alert("Please enter a valid runtime!");
        }
    }
    else {
        alert("Please enter a valid year!");
    }
}