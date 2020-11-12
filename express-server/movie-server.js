const express = require('express');
const app = express();

const model = require("./movie-database-module.js");
let requestingUser = "";

const session = require('express-session');
app.use(session({ secret: 'some secret here', resave: true, saveUninitialized: true, cookie: { maxAge: 24 * 60 * 60 * 1000}}));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use("/", function(req, res, next){
  console.log(req.session);
  if (req.session.user){
    req.session.user = model.getUser(req.session.user.username);
  }
  next();
});

// tested
app.get("/", function(req, res, next){
  let resultUpcoming = model.upcoming(requestingUser);
  let resultFanPicks = model.fanPicks(requestingUser);
  let resultYourList = model.yourList(requestingUser);
  if (resultUpcoming && resultFanPicks){
    res.render('pages/index', {user: req.session.user, resultUpcoming: resultUpcoming, resultYourList: resultYourList, resultFanPicks: resultFanPicks});
    res.status(200);
  }
  else{
    res.status(500).send("Unable to fetch movies.");
  }
});

//tested
app.get("/login", function(req, res, next){
  //show login page
  if (req.session.user){
    res.status(401).send("You are already logged in.");
  }
  else{
    res.render('pages/login');
    res.status(200);
  }
});

//tested
app.get("/register", function(req, res, next){
  if (req.session.user){
    res.status(401).send("You are already logged in.");
  }
  res.render('pages/register');
  res.status(200);
});

// tested
app.post("/login", function(req, res, next){
  if (model.login(req.body)){
    req.session.user = model.users[req.body.username];
    req.session.username = req.session.user.username;
    requestingUser = req.session.user.username;
    res.status(302);
    res.redirect("/users/" + req.session.user.id);
  }
  else{
    res.status(401).send("Invalid credentials");
  }
});

app.get("/logout", function(req, res, next){
  if (!req.session.user){
    res.status(401).send("You are not logged in.");
  }
  req.session.user = null;
  req.session.username = "";
  requestingUser = "";
  res.status(200).send("/");
});

app.get("/users", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else {
    if (!req.query.username){
      req.query.username = "";
    }
    let result = model.searchUsers(req.session.user.username, req.query.username);
    res.status(200);
    res.render('pages/search-user', {userObjects: result});
  }
});

app.get("/users/search/", function (req, res, next){
  if (!req.query){
    req.query.name = "";
  }
  //let result = model.searchPerson(req.query.name);
  let searchQuery = ""
  if (req.query.username){
      searchQuery += "?username=" + req.query.username;
  }
  else{
    searchQuery += "?username=";
  }
  res.status(200);
  res.send("/users" + searchQuery);
});



app.post("/users", function(req, res, next){
  let result = model.registerUser(req.body);
  if(result){
    req.session.user = result;
    req.session.username = req.session.user.username;
    requestingUser = req.session.user.username;
    res.status(200);
    res.redirect("/users/" + req.session.user.id);
  }
  else{
    res.status(500).send("Failed to add user.");
  }
});


app.get("/users/:uid/edit", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    res.status(200);
    res.render('pages/edit-user', {user: req.session.user});
  }
});

app.put("/users/:uid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (("user" + req.params.uid) !== requestingUser){
      res.status(403).send("Unauthorized");
    }
    else{
      let result = model.editUser(req.session.user.username, req.body);
      if(result) {
        res.status(200).send('/users/' + req.session.user.id);
      }
      else {
        res.status(500);
      }
    }
  }
});

// tested
app.post("/users/:uid/toggle", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (("user" + req.params.uid) !== requestingUser){
      res.status(403).send("Unauthorized");
    }
    else{
      let result = model.toggleContributing("user" + req.params.uid);
      //console.log(req.session.user);
      if (result){
        res.status(200);
        res.send("/users/" + req.params.uid);
      }
      else{
        res.status(404).send("User does not exist.");
      }
    }
  }
});

//tested (other-user)
// remaining to be tested with user
app.get("/users/:uid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    let result = model.getUser("user" + req.params.uid);
    let resultReviews = model.viewReviewsOtherUser(requestingUser, "user" + req.params.uid);
    console.log(resultReviews);
    let reviewedMovies = [];
    if (resultReviews && resultReviews.length > 0){
      for (review of resultReviews){
          if (review && !reviewedMovies.includes(model.movies[review.movieID])){
            reviewedMovies.push(model.movies[review.movieID]);
          }
        }
    }
    console.log(reviewedMovies);
    if (result && result.id === req.session.user.id){
      res.status(200);
      res.render('pages/user', {user: result, likedMovies: reviewedMovies, resultReviews: resultReviews});
    }
    else if (result && result.id !== req.session.user.id){
      let followBool = model.getUser(req.session.user.username).followingUsers.includes(result.username);
      res.status(200);
      res.render('pages/other-user', {userFollowsOtherUser: followBool, requestedUser: result, likedMovies: reviewedMovies, reviewList: resultReviews});
    }
    else{
      res.status(404).send("User " + req.params.uid + " does not exist.");
    }
  }
});

app.get("/users/:uid/followers", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUser("user" + req.params.uid)){
      let result = model.viewFollowersOtherUser(requestingUser, "user" + req.params.uid);
      if (result){
        res.render("pages/followers", {user: model.getUser("user" + req.params.uid), followerList: result});
        res.status(200);
      }
      else{
        res.status(401).send("Cannot access followers of user" + req.params.uid + " as you don't follow them.");
      }
    }
    else{
      res.status(404).send("User does not exist.");
    }
  }
});

app.get("/users/:uid/following", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUser("user" + req.params.uid)){
      let result = model.viewFollowingOtherUser(requestingUser, "user" + req.params.uid);
      if (result){
        res.render("pages/following", {user: model.getUser("user" + req.params.uid), followingList: result});
        res.status(200);
      }
      else{
        res.status(401).send("Cannot access following of user" + req.params.uid + " as you don't follow them.");
      }
    }
    else{
      res.status(404).send("User does not exist.");
    }
  }
});

app.get("/users/:uid/people", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUser("user" + req.params.uid)){
      let result = model.viewPeopleOtherUser(requestingUser, "user" + req.params.uid);
      if (result){
        res.render("pages/following-people", {user: model.getUser("user" + req.params.uid), peopleList: result});
        res.status(200)
      }
      else{
        res.status(401).send("Cannot access people that user " + req.params.uid + " follows as you don't follow them.");
      }
    }
    else{
      res.status(404).send("User does not exist.");
    }

  }
});

app.post("/users/:uid/follow", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.session.user.id === req.params.uid){
      res.status(404).send("You can't follow yourself.");
    }
    let result = model.followUser(requestingUser, "user" + req.params.uid);
    if(result){
      res.status(200);
      res.send("/users/"+req.params.uid);
    }
    else{
      res.status(404).send("User" + req.params.uid + " does not exist or you already follow them.");
    }
  }
});

app.post("/users/:uid/unfollow", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.unfollowUser(req.session.user.username, "user" + req.params.uid);
    if (result){
      res.status(200);
      res.send("/users/"+req.params.uid);
    }
    else{
      res.status(404).send("User" + req.params.uid + " does not exist or you do not follow them.");
    }
  }
});

app.get("/users/:uid/recommended", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (("user" + req.params.uid) !== req.session.user.username){
      res.status(403).send("Unauthorized");
    }
    else{
      let result = model.viewRecommendedMovies(req.session.user.username);
      console.log(result);
      if (result){
        res.status(200); //.send("Recommended movies are: " + JSON.stringify(result));
        res.render('pages/recommended-movies', {user: req.session.user, movieObjects: result});
      }
      else{
        res.status(404).send("User" + req.params.uid + " does not exist.");
      }
    }
  }
});

app.get("/searchIMDB", function(req, res, next){
  let result = undefined;
  res.render("pages/imdb-result", {movie:result});
  res.status(200);
})

app.get("/searchIMDB/:sid", async function(req, res, next){
  let searchTerms = [];
  let searchTerm = req.params.sid;
  if (searchTerm.includes("+")){
    searchTerms = searchTerm.split("+");
    searchTerm = searchTerms[0];
    for (let i = 1; i < searchTerms.length; i++){
      searchTerm += " " + searchTerms[i];
    }
  }
  let result = await model.searchIMDB(searchTerm);
  if (result){
    res.status(200).send("/searchIMDB/" + searchTerm);
    res.render("pages/imdb-result", {movie:result});
  }
  else{
    res.status(500).send("Server could not access specified movie.");
  }
});

app.get("/movies", function(req, res, next){
  if (!req.query){
    req.query = {};
  }
  let result = model.searchMovie(req.query);
  res.status(200); //.send("Movies found: " + JSON.stringify(result));
  res.render('pages/search-movie', {movieObjects: result});
  //res.send("/movies");
});

app.get("/movies/search/", function (req, res, next){
  if (!req.query){
    req.query = {};
  }
  let result = model.searchMovie(req.query);
  let searchQuery = ""
  if (req.query.title){
      searchQuery += "?title=" + req.query.title;
  }
  else{
    searchQuery += "?title=";
  }
  if (req.query.genre){
    searchQuery += "&genre=" + req.query.genre;
  }
  if (req.query.minRating){
    searchQuery += "&minRating=" + req.query.minRating;
  }
  if (req.query.year){
    searchQuery += "&year=" + req.query.year;
  }
  res.status(200);
  res.send("/movies" + searchQuery);
});

//tested
app.get("/movies/:mid", function(req, res, next){
  let result = model.getMovie(req.params.mid);
  if(!result) {
    res.status(404).send("Movie does not exist.");
  }
  let actorList = [];
  let writerList = [];
  let directorList = [];
  for (actorID of result.actors){
    if (!actorList.includes(model.getPerson(actorID))){
      actorList.push(model.getPerson(actorID));
    }
  }
  for (writerID of result.writers){
    if (!writerList.includes(model.getPerson(writerID))){
      writerList.push(model.getPerson(writerID));
    }
  }
  for (directorID of result.director){
    if (!directorList.includes(model.getPerson(directorID))){
      directorList.push(model.getPerson(directorID));
    }
  }
  let movieReviewList = [];
  if(result.reviews) {
    for (reviewID of result.reviews){
      if(!movieReviewList.includes(model.getReview(reviewID))){
        movieReviewList.push(model.getReview(reviewID));
      }
    }
  }

  if(result){
    res.render('pages/movie', {user: req.session.user, movie: result, similarMovies: model.similarMovies(req.params.mid), actorList: actorList, writerList: writerList, directorList: directorList, reviewList: movieReviewList});
    res.status(200);
  }
});

app.post("/movies", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.addMovie(req.session.user.username, req.body);
    if (result){
      console.log(model.movies);
      res.status(200);
      res.send("/movies");
      //res.redirect("/movies/" + result);
    }
    else{
      res.status(500).send("Failed to add movie.");
    }
  }
});

app.get("/addMovie", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    res.render("pages/add-movie", {user: req.session.user});
    res.status(200);
  }
});

app.get("/movies/:mid/edit", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //show edit movie page
    if (model.getMovie(req.params.mid)){
      res.render("pages/edit-movie", {movie: model.getMovie(req.params.mid), user: req.session.user});
      res.status(200);
    }
    else{
      res.status(404).send("Movie does not exist.");
    }
  }
});

// issues
app.put("/movies/:mid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.params.mid === req.body.id){
      let result = model.editMovie(req.session.user.username, req.body);
      if (result){
        res.status(200);
        res.send("/movies/" + req.params.mid);
      }
      else{
        res.status(500).send("Failed to edit movie.");
      }
    }
    else{
      res.status(404).send("Movie does not exist.");
    }
  }
});

app.delete("/movies/:mid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.removeMovie(req.session.user.username, req.params.mid);
    if (result){
      res.status(200).send("/movies");
    }
    else{
      res.status(500).send("Failed to delete movie.");
    }
  }
});

app.get("/people", function(req, res, next){
  if (!req.query.name){
    req.query.name = "";
  }
  let result = model.searchPerson(req.query.name);
  res.status(200);
  res.render('pages/search-person', {personObjects: result});
});

app.get("/people/search/", function (req, res, next){
  if (!req.query){
    req.query.name = "";
  }
  //let result = model.searchPerson(req.query.name);
  let searchQuery = ""
  if (req.query.name){
      searchQuery += "?name=" + req.query.name;
  }
  else{
    searchQuery += "?name=";
  }
  res.status(200);
  res.send("/people" + searchQuery);
});

app.get("/people/:pid", function(req, res, next){
  if (model.getPerson(req.params.pid)){
    let result = model.getPerson(req.params.pid);
    let movieList = [];
    for (movie of result.movies){
      if (!movieList.includes(movie)){
        movieList.push(model.movies[movie]);
      }
    }
    if (result){
      let followBool = false;
      if (req.session.user){
        followBool = model.getUser(req.session.user.username).followingPeople.includes(result.id);
      }
      res.render("pages/person", {userFollowsPerson: followBool, person: result, movieList: movieList, user: req.session.user});
      res.status(200);
    }
    else{
      res.status(500).send("Cannot access person.");
    }
  }
  else{
    res.status(404).send("Person does not exist.");
  }
});

app.post("/people", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.addPerson(req.session.user.username, req.body);
    console.log(req.body);
    if (result){
      res.status(200);
      res.send("/people/" + result);
    }
    else{
      res.status(500).send("Failed to add person.");
    }
  }
});

app.post("/people/:pid/follow", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.followPerson(req.session.user.username, req.params.pid);
    if(result){
      res.status(200);
      res.send("/people/"+req.params.pid);
    }
    else{
      res.status(404).send("Person with id" + req.params.pid + " does not exist or you already follow them.");
    }
  }
});

app.post("/people/:pid/unfollow", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.unfollowPerson(req.session.user.username, req.params.pid);
    if (result){
      res.status(200);
      res.send("/people/"+req.params.pid);
    }
    else{
      res.status(404).send("Person with id" + req.params.pid + " does not exist or you do not follow them.");
    }
  }
});

app.get("/people/:pid/edit", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //show editing person page after checking if that ID exists
    if (model.getPerson(req.params.pid)){
      res.render("pages/edit-person", {person: model.getPerson(req.params.pid), user: req.session.user});
      res.status(200);
    }
    else{
      res.status(404).send("Movie does not exist.");
    }
  }
});

app.get("/addPerson", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    res.render("pages/add-person", {user: req.session.user});
    res.status(200);
  }
});

app.put("/people/:pid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.params.pid === req.body.id){
      let result = model.editPerson(req.session.user.username, req.body);
      if (result){
        res.status(200);
        res.send("/people/" + req.params.pid);
      }
      else{
        res.status(500).send("Failed to edit person.");
      }
    }
    else{
      res.status(404).send("Person does not exist.");
    }
  }
});

app.delete("/people/:pid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
      let result = model.removePerson(req.session.user.username, req.params.pid);
      if (result){
        res.status(200);
        res.send("/people");
      }
      else{
        res.status(500).send("Failed to delete person.");
      }
    }
});

app.get("/people/:pid/collaborators", function(req, res, next){
  let result = model.getFrequentCollaborator(req.params.pid);
  if (result){
    res.status(200).send("Frequent Collaborators are: " + JSON.stringify(result));
  }
  else{
    res.status(404).send("Person does not exist.");
  }
});

app.get("/reviews/:rid", function(req, res, next){
  let result = model.getReview(req.params.rid);
  if (result){
    res.status(200); //.send(JSON.stringify(result));
    res.render('pages/review', {review: result, reviewUser: model.getUser(result.userID)});
  }
  else{
    res.status(404).send("Review does not exist.");
  }
});

app.post("/movies/:mid/basicReview/:rating", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.addBasicReview(req.session.user.username, req.params.mid, req.params.rating);
    if (result){
      res.status(200).send("/movies/"+req.params.mid);
      // window location href in client side js
    }
    else{
      res.status(404).send("Movie does not exist.");
    }
  }
});

app.post("/movies/:mid/fullReview", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.params.mid === req.body.movieID){
      let result = model.addFullReview(req.session.user.username, req.body);
      if (result){
        res.status(200).send("/movies/"+req.params.mid);
      }
      else{
        res.status(500).send("Review could not be added.");
      }
    }
    else{
      res.status(500).send("Review could not be added.");
    }
  }
});

// testing method
app.get("/test", function(req, res, next){
  if (!req.query.name){
    req.query.name = "";
  }
  else{
    //let result = model.searchPerson(req.query.name);
    res.status(200); //.send("OK: " + JSON.stringify(result));
    res.render('pages/imdb-result', {movie: model.getMovie("1")});
  }
});


app.listen(3000);
console.log("Server listening at http://localhost:3000");
