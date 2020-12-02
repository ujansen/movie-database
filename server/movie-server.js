/*
missing get for register page
missing get for login
*/

const express = require('express');
const app = express();

const model = require("./movie-database-module.js");
let requestingUser = "";

const session = require('express-session')
app.use(session({ secret: 'some secret here'}))
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.set("view engine", "pug");

app.use(express.static('public'));

app.use("/", function(req, res, next){
  console.log(req.session);
  console.log("Request from user: " + !req.session.hasOwnProperty('user')? "guest user" :  req.session.user.username);
  // why is username not showing up correctly???
  next();
});

// INDEX
app.get("/", function(req, res, next){
  let resultUpcoming = model.upcoming(requestingUser);
  let resultFanPicks = model.fanPicks(requestingUser);
  let resultYourList = {};
  console.log("WHO IS THE REQ USER?");
  console.log(requestingUser);
  if(requestingUser) {
    resultYourList = model.yourList(requestingUser);
  }
  if (resultUpcoming && resultFanPicks){
    /* res.status(200).send("Upcoming movies are: " + JSON.stringify(resultUpcoming) +
                         "\nand fan picks are: " + JSON.stringify(resultFanPicks) +
                         "\n and your list is: " + JSON.stringify(resultYourList)); */
    res.render("pages/index", {resultUpcoming: resultUpcoming, resultFanPicks: resultFanPicks, resultYourList: resultYourList});
  }
  else{
    res.status(500).send("Unable to fetch movies.");
  }
});

// LOGIN
app.get("/login", (req, res, next)=> { res.render("pages/login"); });

app.post("/login", function(req, res, next){
  if (model.login(req.body)){
    req.session.user = model.users[req.body.username];
    requestingUser = req.session.user.username;
    /* console.log("BODY USERNAME: ");
    console.log(req.body.username); */
    res.redirect("/users/" + req.body.username);
    // does not redirect?
  }
  else{
    res.status(401).send("Invalid credentials");
  }
});

// USERS
// no webpage yet
app.get("/users", function(req, res, next){
  let result = model.searchUsers(requestingUser, req.query.name);
  res.status(200).json(result);
});

app.post("/users", function(req, res, next){
  let result = model.registerUser(req.body);
  if(result){
    res.status(200).send("User added: " + JSON.stringify(result));
  }
  else{
    res.status(500).send("Failed to add user.");
  }
});

app.put("/users/:uid", function(req, res, next){
  if (("user" + req.params.uid) !== requestingUser){
    res.status(403).send("Unauthorized");
  }
  else{
    let result = model.toggleContributing("user" + req.params.uid);
    if (result){
      res.status(200).send("Type changed " + JSON.stringify(model.users["user"+req.params.uid]));
    }
    else{
      res.status(404).send("User does not exist.");
    }
  }
});

app.get("/users/:uid", function(req, res, next){
  let result = model.getUser(requestingUser, req.params.uid);
  let resultReviews = model.viewReviewsOtherUser(requestingUser, "user" + req.params.uid);
  if (result){
    res.status(200).send("User found: " + JSON.stringify(result)+"\nand his reviews are " + JSON.stringify(resultReviews));
  }
  else{
    res.status(404).send("User " + req.params.uid + " does not exist.");
  }
});

app.get("/users/:uid/followers", function(req, res, next){
  let result = model.viewFollowersOtherUser(requestingUser, "user" + req.params.uid);
  if (result){
    res.status(200).send("Followers of user" + req.params.uid + " are: " + JSON.stringify(result));
  }
  else{
    res.status(401).send("Cannot access user" + req.params.uid);
  }
});

app.get("/users/:uid/following", function(req, res, next){
  let result = model.viewFollowingOtherUser(requestingUser, "user" + req.params.uid);
  if (result){
    res.status(200).send("Users that user" + req.params.uid + " follows are: " + JSON.stringify(result));
  }
  else{
    res.status(401).send("Cannot access user" + req.params.uid);
  }
});

app.get("/users/:uid/people", function(req, res, next){
  let result = model.viewPeopleOtherUser(requestingUser, "user" + req.params.uid);
  if (result){
    res.status(200).send("People that user" + req.params.uid + " follows are: " + JSON.stringify(result));
  }
  else{
    res.status(404).send("User" + req.params.uid + " does not exist.");
  }
});

app.post("/users/:uid/follow", function(req, res, next){
  let result = model.followUser(requestingUser, "user" + req.params.uid);
  if(result){
    res.status(200).send("User" + req.params.uid + " followed." +
                         "\n\n" + JSON.stringify(model.users[requestingUser]) + "\n" + JSON.stringify(model.users["user" + req.params.uid]));
  }
  else{
    res.status(404).send("User" + req.params.uid + " does not exist or you already follow them.");
  }
});

app.post("/users/:uid/unfollow", function(req, res, next){
  let result = model.unfollowUser(requestingUser, "user" + req.params.uid);
  if (result){
    res.status(200).send("User" + req.params.uid + " unfollowed." +
                       "\n\n" + JSON.stringify(model.users[requestingUser]) + "\n" + JSON.stringify(model.users["user" + req.params.uid]));
  }
  else{
    res.status(404).send("User" + req.params.uid + " does not exist or you do not follow them.");
  }
});

app.get("/users/:uid/recommended", function(req, res, next){
  let result = model.viewRecommendedMovies(requestingUser);
  if (result){
    res.status(200).send("Recommended movies are: " + JSON.stringify(result));
  }
  else{
    res.status(404).send("User" + req.params.uid + " does not exist.");
  }
});

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
  let result = await model.searchIMDB(requestingUser, searchTerm);
  if (result){
    res.status(200).send(JSON.stringify(result));
  }
  else{
    res.status(500).send("Server could not access specified movie.");
  }
});

// MOVIES
app.get("/movies", function(req, res, next){
  if (!req.query.name){
    req.query.name = "";
  }
  let result = model.searchMovie(requestingUser, req.query.name);
  res.status(200).send("Movies found: " + JSON.stringify(result));
});

app.get("/movies/:mid", function(req, res, next){
  let result = model.getMovie(req.params.mid);
  if(result){
    res.status(200).send(JSON.stringify(result) +
                        "\n\nReviews are: " + JSON.stringify(model.getReviewMovie(requestingUser, req.params.mid)) +
                        "\n\nSimilar movies are: " + JSON.stringify(model.similarMovies(requestingUser, req.params.mid)));
  }
  else{
    res.status(404).send("Movie does not exist.");
  }
});

app.post("/movies", function(req, res, next){
  let result = model.addMovie(requestingUser, req.body);
  if (result){
    res.status(200).send("Movie successfully added.\n\n" + JSON.stringify(model.movies));
  }
  else{
    res.status(500).send("Failed to add movie.");
  }
});

app.put("/movies/:mid", function(req, res, next){
  if (req.params.mid === req.body.id){
    let result = model.editMovie(requestingUser, req.body);
    if (result){
      res.status(200).send("Movie successfully edited.\n\n" + JSON.stringify(model.movies));
    }
    else{
      res.status(500).send("Failed to edit movie.");
    }
  }
  else{
    res.status(404).send("Movie does not exist.");
  }
});

app.delete("/movies/:mid", function(req, res, next){
  let result = model.removeMovie(requestingUser, req.params.mid);
  if (result){
    res.status(200).send("Movie successfully deleted.\n\n" + JSON.stringify(model.movies));
  }
  else{
    res.status(404).send("Movie does not exist.");
  }
});

// PEOPLE
app.get("/people", function(req, res, next){
  if (!req.query.name){
    req.query.name = "";
  }
  let result = model.searchPerson(requestingUser, req.query.name);
  res.status(200).send("People found: " + JSON.stringify(result));
});

app.get("/people/:pid", function(req, res, next){
  let result = model.getPerson(req.params.pid);
  if (result){
    res.status(200).send(JSON.stringify(result));
  }
  else{
    res.status(404).send("Person does not exist.");
  }
});

app.post("/people", function(req, res, next){
  let result = model.addPerson(req.body);
  if (result){
    res.status(200).send("Person added successfully.\n\n" + JSON.stringify(model.people));
  }
  else{
    res.status(500).send("Failed to add person.");
  }
});

app.delete("/people/:pid", function(req, res, next){
  let result = model.removePerson(requestingUser, req.params.pid);
  if (result){
    res.status(200).send("Person successfully deleted.\n\n" + JSON.stringify(model.people));
  }
  else{
    res.status(404).send("Person does not exist.");
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

// REVIEWS
app.get("/reviews/:rid", function(req, res, next){
  let result = model.getReview(requestingUser, req.params.rid);
  if (result){
    res.status(200).send(JSON.stringify(result));
  }
  else{
    res.status(404).send("Review does not exist.");
  }
});

app.post("/movies/:mid/basicReview/:rating", function(req, res, next){
  let result = model.addBasicReview(requestingUser, req.params.mid, req.params.rating);
  if (result){
    res.status(200).send("Basic review added.");
  }
  else{
    res.status(404).send("Movie does not exist.");
  }
});

app.post("/movies/:mid/fullReview", function(req, res, next){
  let result = model.addFullReview(requestingUser, req.body);
  if (result){
    res.status(200).send("Full review added.\n\n" + JSON.stringify(model.reviews));
  }
  else{
    res.status(500).send("Review could not be added.");
  }
});


app.listen(3000);
console.log("Server listening at http://localhost:3000");
