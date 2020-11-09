const express = require('express');
const app = express();

const model = require("./movie-database-module.js");
let requestingUser = "";

const session = require('express-session');
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(session({ secret: 'some secret here'}))
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.set("view engine", "pug");

app.use(express.static('public'));

app.use("/", function(req, res, next){
  console.log(req.session);
  console.log("Request from user: " + req.session.username);
  next();
});

// tested
app.get("/", function(req, res, next){
  let resultUpcoming = model.upcoming(requestingUser);
  let resultFanPicks = model.fanPicks(requestingUser);
  let resultYourList = model.yourList(requestingUser);
  if (resultUpcoming && resultFanPicks){
    res.render('pages/index', {resultUpcoming: resultUpcoming, resultFanPicks: resultFanPicks, resultYourList: resultYourList});
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


app.post("/login", function(req, res, next){
  if (model.login(req.body)){
    req.session.user = model.users[req.body.username];
    req.session.username = req.session.user.username;
    requestingUser = req.session.user.username;
    res.redirect("/users/" + req.session.user.id);
  }
  else{
    res.status(401).send("Invalid credentials");
  }
});

app.post("/logout", function(req, res, next){
  if (!req.session.user){
    res.status(401).send("You are not logged in.");
  }
  res.session.user = null;
  req.session.username = "";
  requestingUser = "";
});


app.get("/users", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (!req.query.name){
      req.query.name = "";
    }
    let result = model.searchUsers(requestingUser, req.query.name);
    res.status(200).json(result);
  }
});


app.post("/users", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    let result = model.registerUser(req.body);
    if(result){
      res.status(200).send("User added: " + JSON.stringify(result));
    }
    else{
      res.status(500).send("Failed to add user.");
    }
  }
});


app.get("/users/:uid/edit", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    // show editUser page
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
      // editUser function here
    }
  }
});


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
      if (result){
        res.status(200).send("Type changed " + JSON.stringify(model.users["user"+req.params.uid]));
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
    let result = model.getUser(requestingUser, "user" + req.params.uid);
    let resultReviews = model.viewReviewsOtherUser(requestingUser, "user" + req.params.uid);
    console.log(resultReviews);
    let reviewedMovies = [];
    if (resultReviews && resultReviews.length > 0){
      for (review of resultReviews){
          console.log(review);
          if (!reviewedMovies.includes(model.movies[review.movieID])){
            reviewedMovies.push(model.movies[review.movieID]);
          }
        }
    }
    if (result && result.id === req.session.user.uid){
      res.render('pages/user', {user: result, likedMovies: reviewedMovies, resultReviews: resultReviews});
      res.status(200);
    }
    else if (result && result.id !== req.session.user.uid){
      res.render('pages/other-user', {requestedUser: result, likedMovies: reviewedMovies, reviewList: resultReviews});
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
    let result = model.viewFollowersOtherUser(requestingUser, "user" + req.params.uid);
    if (result){
      res.status(200).send("Followers of user" + req.params.uid + " are: " + JSON.stringify(result));
    }
    else{
      res.status(401).send("Cannot access user" + req.params.uid);
    }
  }
});

app.get("/users/:uid/following", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    let result = model.viewFollowingOtherUser(requestingUser, "user" + req.params.uid);
    if (result){
      res.status(200).send("Users that user" + req.params.uid + " follows are: " + JSON.stringify(result));
    }
    else{
      res.status(401).send("Cannot access user" + req.params.uid);
    }
  }
});

app.get("/users/:uid/people", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    let result = model.viewPeopleOtherUser(requestingUser, "user" + req.params.uid);
    if (result){
      res.status(200).send("People that user" + req.params.uid + " follows are: " + JSON.stringify(result));
    }
    else{
      res.status(404).send("User" + req.params.uid + " does not exist.");
    }
  }
});

app.post("/users/:uid/follow", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.followUser(requestingUser, "user" + req.params.uid);
    if(result){
      res.status(200).send("User" + req.params.uid + " followed." +
                           "\n\n" + JSON.stringify(model.users[requestingUser]) + "\n" + JSON.stringify(model.users["user" + req.params.uid]));
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
    let result = model.unfollowUser(requestingUser, "user" + req.params.uid);
    if (result){
      res.status(200).send("User" + req.params.uid + " unfollowed." +
                         "\n\n" + JSON.stringify(model.users[requestingUser]) + "\n" + JSON.stringify(model.users["user" + req.params.uid]));
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
    if (("user" + req.params.uid) !== requestingUser){
      res.status(403).send("Unauthorized");
    }
    else{
      let result = model.viewRecommendedMovies(requestingUser);
      if (result){
        res.status(200).send("Recommended movies are: " + JSON.stringify(result));
      }
      else{
        res.status(404).send("User" + req.params.uid + " does not exist.");
      }
    }
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
  let result = await model.searchIMDB(searchTerm);
  if (result){
    res.status(200).send(JSON.stringify(result));
  }
  else{
    res.status(500).send("Server could not access specified movie.");
  }
});

app.get("/movies", function(req, res, next){
  if (!req.query.name){
    req.query.name = "";
  }
  let result = model.searchMovie(req.query.name);
  res.status(200).send("Movies found: " + JSON.stringify(result));
});

//tested
app.get("/movies/:mid", function(req, res, next){
  let result = model.getMovie(req.params.mid);
  if(result){
    res.render('pages/movie', {movie: result, similarMovies: [model.movies["0"], model.movies["4"], model.movies["3"]]});
    res.status(200);                    
  }
  else{
    res.status(404).send("Movie does not exist.");
  }
});

app.post("/movies", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.addMovie(requestingUser, req.body);
    if (result){
      res.status(200).send("Movie successfully added.\n\n" + JSON.stringify(model.movies[model.movies.length-1]));
    }
    else{
      res.status(500).send("Failed to add movie.");
    }
  }
});

app.get("/movies/add", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //show add movie page
  }
});

app.get("/movies/:mid/edit", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //show edit movie page
  }
});


app.put("/movies/:mid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
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
  }
});

app.delete("/movies/:mid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.params.mid === req.body.id){
      let result = model.removeMovie(requestingUser, req.params.mid);
      if (result){
        res.status(200).send("Movie successfully deleted.\n\n" + JSON.stringify(model.movies));
      }
      else{
        res.status(500).send("Failed to delete movie.");
      }
    }
    else{
      res.status(404).send("Movie does not exist.");
    }
  }
});

app.get("/people", function(req, res, next){
  if (!req.query.name){
    req.query.name = "";
  }
  else{
    let result = model.searchPerson(req.query.name);
    res.status(200).send("People found: " + JSON.stringify(result));
  }
});

app.get("/people/:pid", function(req, res, next){
  let result = model.getPerson(req.params.pid);
  let movieList = [];
  for (movie of result.movies){
    if (!movieList.includes(movie)){
      movieList.push(model.movies[movie]);
    }
  }
  if (result){
    res.status(200).send(JSON.stringify(result) + "\nand their movies are: " + JSON.stringify(movieList));
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
    let result = model.addPerson(req.body);
    if (result){
      res.status(200).send("Person added successfully.\n\n" + JSON.stringify(model.people));
    }
    else{
      res.status(500).send("Failed to add person.");
    }
  }
});

app.get("/people/:pid/edit", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //show editing person page after checking if that ID exists
  }
});

app.get("/people/add", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //show adding person page
  }
});

app.put("/people/:pid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
  //call editPerson function
  }
});

app.delete("/people/:pid", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.params.pid === req.body.id){
      let result = model.removePerson(requestingUser, req.params.pid);
      if (result){
        res.status(200).send("Person successfully deleted.\n\n" + JSON.stringify(model.people));
      }
      else{
        res.status(500).send("Failed to delete person.");
      }
    }
    else{
      res.status(404).send("Person does not exist.");
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
  let result = model.getReview(requestingUser, req.params.rid);
  if (result){
    res.status(200).send(JSON.stringify(result));
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
    let result = model.addBasicReview(requestingUser, req.params.mid, req.params.rating);
    if (result){
      res.status(200).send("Basic review added.");
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
    if (requestingUser === req.body.userID){
      let result = model.addFullReview(requestingUser, req.body);
      if (result){
        res.status(200).send("Full review added.\n\n" + JSON.stringify(model.reviews));
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


app.listen(3000);
console.log("Server listening at http://localhost:3000");
