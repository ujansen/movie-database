const express = require('express');
const app = express();

const model = require("./movie-database-module.js");

const session = require('express-session');
app.use(session({ secret: 'some secret here', resave: true, saveUninitialized: true, cookie: { maxAge: 24 * 60 * 60 * 1000}}));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use("/", function(req, res, next){
  if (req.session.user){
    req.session.user = model.getUser(req.session.user.username);
  }
  next();
});

// tested
app.get("/", function(req, res, next){
  let resultUpcoming = model.upcoming();
  let resultFanPicks = model.fanPicks();
  let resultYourList = [];
  if (req.session.user){
    resultYourList = model.yourList(req.session.user.username);
  }
  else{
    resultYourList = [];
  }
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
  }
});

//tested
app.get("/register", function(req, res, next){
  if (req.session.user){
    res.status(401).send("You are already logged in.");
  }
  else {
    res.render('pages/register');
    res.status(200);
  }
});

app.get("/tos", function(req, res, next){
  res.render('pages/tos');
  res.status(200);
});

// tested
app.post("/login", function(req, res, next){
  if (model.login(req.body)){
    req.session.user = model.users[req.body.username];
    res.status(302);
    res.redirect("/users/" + req.session.user.id);
  }
  else{
    res.status(401).send("Invalid credentials");
  }
});

app.get("/logout", function(req, res, next){
  if (!req.session.user){
    res.status(401);
    res.redirect("/login");
  }
  else{
    req.session.user = null;
    res.redirect("/");
  }
});

app.get("/users", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else {
    if (!req.query.hasOwnProperty("page")){
      req.query.page = 1;
    }
    let result = model.searchUsers(req.session.user.username, req.query.username);
    let paginatedResult = model.paginate(req.query.page, result);
    if(paginatedResult && result.length > 0) {
      res.status(200);
      res.format({
        html: function(){
          res.render('pages/search-user', {user: req.session.user, userObjects: paginatedResult.result,
            prev: paginatedResult.prev, next: paginatedResult.next, pageNum: req.query.page,
            totalPages: paginatedResult.totalPages});
        },
        json: function(){
          res.send(paginatedResult.result);
        }
      });
    }
    else if(result.length === 0) {
      res.status(200);
      res.format({
        html: function(){
          res.render('pages/search-user', {user: req.session.user, userObjects: result,
            prev: false, next: false, pageNum: req.query.page, totalPages: 1});
        },
        json: function(){
          res.send(result);
        }
      });
    }
    else{
      res.status(404).send("Page does not exist");
    }
  }
});

app.get("/users/search/", function (req, res, next){
  if (!req.query){
    req.query.name = "";
  }
  let searchQuery = ""
  if (req.query.username){
      searchQuery += "?username=" + req.query.username;
  }
  else{
    searchQuery += "?username=";
  }

  if(req.query.page) {
    searchQuery += "&page=" + req.query.page;
  }
  else if(!req.query.page) {
    searchQuery += "&page=1";
  }

  res.status(200);
  res.send("/users" + searchQuery);
});



app.post("/users", function(req, res, next){
  let result = model.registerUser(req.body);
  if(result){
    req.session.user = result;
    res.status(302);
    res.redirect("/users/" + req.session.user.id);
  }
  else{
    res.status(500).send("Failed to add user: User already exists.");
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
    if ((model.getUserByID(req.params.uid).username) !== req.session.user.username){
      res.status(403).send("Unauthorized");
    }
    else{
      if (model.getUser(req.session.user.username).password !== req.body.oldPassword){
        res.status(500).send("Old password does not match.");
      }
      else{
        res.status(200);
        let result = model.editUser(req.session.user.username, req.body);
        if(result) {
          res.format({
            html: function(){
              res.send('/users/' + req.session.user.id);
            },
            json: function(){
              res.send(model.getUserByID(req.session.user.id));
            }
          });
        }
        else {
          res.status(500).send("Something went wrong. Please try again.");
        }
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
    if ((model.getUserByID(req.params.uid).username) !== req.session.user.username){
      res.status(403).send("Unauthorized");
    }
    else{
      let result = model.toggleContributing(model.getUserByID(req.params.uid).username);
      if (result){
        res.status(200);
        res.format({
          html: function(){
            res.send("/users/" + req.params.uid);
          },
          json: function(){
            res.send(model.getUserByID(req.params.uid));
          }
        });
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
    let result = model.getUserByID(req.params.uid);
    let resultReviews = model.viewReviewsOtherUser(req.session.user.username, model.getUserByID(req.params.uid).username);
    let reviewedMovies = [];
    if (resultReviews && resultReviews.length > 0){
      for (review of resultReviews){
          if (review && !reviewedMovies.includes(model.movies[review.movieID])){
            reviewedMovies.push(model.movies[review.movieID]);
          }
        }
    }
    if (result && result.id === req.session.user.id){
      res.status(200);
      res.format({
        html: function(){
          res.render('pages/user', {user: result, likedMovies: reviewedMovies, resultReviews: resultReviews});
        },
        json: function(){
          res.send(result);
        }
      });
    }
    else if (result && result.id !== req.session.user.id){
      let followBool = model.getUser(req.session.user.username).followingUsers.includes(result.username);
      res.status(200);
      res.format({
        html: function(){
          res.render('pages/other-user', {user: req.session.user, userFollowsOtherUser: followBool, requestedUser: result, likedMovies: reviewedMovies, reviewList: resultReviews});
        },
        json: function(){
          res.send(result);
        }
      });
    }
    else{
      res.status(404).send("User " + req.params.uid + " does not exist.");
    }
  }
});

app.get("/users/:uid/getFollowers", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUserByID(req.params.uid)){
      let result = model.viewFollowersOtherUser(req.session.user.username, model.getUserByID(req.params.uid).username);
      if (result){
        res.status(200);
        res.send(req.params.uid + "/followers?page=1");
      }
      else{
        res.status(401).send("Cannot access followers of " + model.getUserByID(req.params.uid).username + " as you don't follow them.");
      }
    }
    else{
      res.status(404).send("User does not exist.");
    }
  }
});

app.get("/users/:uid/followers", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUserByID(req.params.uid)){
      if (!req.query.hasOwnProperty("page")){
        req.query.page = 1;
      }
      let result = model.viewFollowersOtherUser(req.session.user.username, model.getUserByID(req.params.uid).username);
      let paginatedResult = model.paginate(req.query.page, result);
      if(paginatedResult && result.length > 0) {
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/followers', {user: req.session.user, otherUser: model.getUserByID(req.params.uid), followerList: paginatedResult.result,
              prev: paginatedResult.prev, next: paginatedResult.next, pageNum: req.query.page,
              totalPages: paginatedResult.totalPages});
          },
          json: function(){
            res.send(paginatedResult.result);
          }
        });
      }
      else if(result.length == 0) {
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/followers', {user: req.session.user, otherUser: model.getUserByID(req.params.uid), followerList: result,
              prev: false, next: false, pageNum: req.query.page, totalPages: 1});
          },
          json: function(){
            res.send(result);
          }
        });
      }
      else{
        res.status(404).send("Page does not exist");
      }
    }
  }
});

app.get("/users/:uid/getFollowing", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUserByID(req.params.uid)){
      let result = model.viewFollowingOtherUser(req.session.user.username, model.getUserByID(req.params.uid).username);
      if (result){
        //res.render("pages/following", {user: req.session.user, followingList: result});
        res.status(200);
        res.send(req.params.uid + "/following?page=1");
      }
      else{
        res.status(401).send("Cannot access following of " + model.getUserByID(req.params.uid).username + " as you don't follow them.");
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
    if (model.getUserByID(req.params.uid)){
      if (!req.query.hasOwnProperty("page")){
        req.query.page = 1;
      }
      let result = model.viewFollowingOtherUser(req.session.user.username, model.getUserByID(req.params.uid).username);
      let paginatedResult = model.paginate(req.query.page, result);
      if(paginatedResult && result.length > 0) {
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/following', {user: req.session.user, otherUser: model.getUserByID(req.params.uid), followingList: paginatedResult.result,
              prev: paginatedResult.prev, next: paginatedResult.next, pageNum: req.query.page,
              totalPages: paginatedResult.totalPages});
          },
          json: function(){
            res.send(paginatedResult.result);
          }
        });
      }
      else if(result.length == 0) {
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/following', {user: req.session.user, otherUser: model.getUserByID(req.params.uid), followingList: result,
              prev: false, next: false, pageNum: req.query.page, totalPages: 1});
          },
          json: function(){
            res.send(result);
          }
        });
      }
      else{
        res.status(404).send("Page does not exist");
      }
    }
  }
});

app.get("/users/:uid/people", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else
  {
    if (model.getUserByID(req.params.uid)){
      let result = model.viewPeopleOtherUser(req.session.user.username, model.getUserByID(req.params.uid).username);
      let paginatedResult = model.paginate(req.query.page, result);
      if(paginatedResult && result.length > 0) {
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/following-people', {user: req.session.user, otherUser: model.getUserByID(req.params.uid), peopleList: paginatedResult.result,
              prev: paginatedResult.prev, next: paginatedResult.next, pageNum: req.query.page,
              totalPages: paginatedResult.totalPages});
          },
          json: function(){
            res.send(paginatedResult.result);
          }
        });
      }
      else if(result.length == 0) {
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/following-people', {user: req.session.user, otherUser: model.getUserByID(req.params.uid), peopleList: result,
              prev: false, next: false, pageNum: req.query.page, totalPages: 1});
          },
          json: function(){
            res.send(result);
          }
        });
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
    let result = model.followUser(req.session.user.username, model.getUserByID(req.params.uid).username);
    if(result){
      res.status(200);
      res.format({
        html: function(){
          res.send("/users/"+req.params.uid);
        },
        json: function(){
          res.send(model.getUserByID(req.params.uid));
        }
      });
    }
    else{
      res.status(404).send(model.getUserByID(req.params.uid).username + " does not exist or you already follow them.");
    }
  }
});

app.post("/users/:uid/unfollow", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.unfollowUser(req.session.user.username, model.getUserByID(req.params.uid).username);
    if (result){
      res.status(200);
      res.format({
        html: function(){
          res.send("/users/"+req.params.uid);
        },
        json: function(){
          res.send(model.getUserByID(req.params.uid));
        }
      });
    }
    else{
      res.status(404).send(model.getUserByID(req.params.uid).username + " does not exist or you do not follow them.");
    }
  }
});

app.get("/users/:uid/recommended", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    if (req.params.uid !== req.session.user.id){
      res.status(403).send("Unauthorized");
    }
    else{
      let result = model.viewRecommendedMovies(req.session.user.username);
      if (result){
        res.status(200);
        res.format({
          html: function(){
            res.render('pages/recommended-movies', {user: req.session.user, movieObjects: result});
          },
          json: function(){
            res.send(result);
          }
        });
      }
      else{
        res.status(404).send(model.getUserByID(req.params.uid).username + " does not exist.");
      }
    }
  }
});

app.get("/searchIMDB", function(req, res, next){
  let result = undefined;
  res.render("pages/imdb-result", {user: req.session.user, movie:result});
  res.status(200);
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
  let timeoutID = setTimeout(function(){
    let emptyResult = [];
    res.format({
      html: function(){
        res.render("pages/imdb-result", {user: req.session.user, movie:"No result"});
      },
      json: function(){
        res.send(emptyResult);
      }
    });
  }, 15000);
  let result = await model.searchIMDB(searchTerm);
  if (result){
    res.status(200);
    clearTimeout(timeoutID);
    res.format({
      html: function(){
        res.render("pages/imdb-result", {user: req.session.user, movie:result});
      },
      json: function(){
        res.send(result);
      }
    });
  }
  else{
    res.status(500).send("Server could not access specified movie.");
  }
});

app.get("/movies", function(req, res, next){
  if (!req.query.hasOwnProperty("page")){
    req.query.page = 1;
  }
  let result = model.searchMovie(req.query);
  let paginatedResult = model.paginate(req.query.page, result);
  if(paginatedResult && result.length > 0) {
    res.status(200);
    res.format({
      html: function(){
        res.render('pages/search-movie', {user: req.session.user, movieObjects: paginatedResult.result,
                    prev: paginatedResult.prev, next: paginatedResult.next, pageNum: req.query.page,
                    totalPages: paginatedResult.totalPages});
      },
      json: function(){
        res.send(paginatedResult.result);
      }
    });
  }
  else if (result.length == 0){
    res.status(200);
    res.format({
      html: function(){
        res.render('pages/search-movie', {user: req.session.user, movieObjects: result,
          prev: false, next: false, pageNum: req.query.page, totalPages: 1});
      },
      json: function(){
        res.send(result);
      }
    });
  }
  else {
    res.status(404).send("Page does not exist");
  }
});

app.get("/movies/search/", function (req, res, next){
  if (!req.query.hasOwnProperty("page")){
    req.query.page = 1;
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

  if(req.query.page) {
    searchQuery += "&page=" + req.query.page;
  }
  else if(!req.query.page) {
    searchQuery += "&page=1";
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
    else{
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
      res.status(200);
      res.format({
        html: function(){
          res.render('pages/movie', {user: req.session.user, movie: result, similarMovies: model.similarMovies(req.params.mid), actorList: actorList, writerList: writerList, directorList: directorList, reviewList: movieReviewList});
        },
        json: function(){
          res.send(result);
        }
      });
    }
  }
});

app.post("/movies", function(req, res, next){
  if (!req.session.user){
    res.redirect("/login");
  }
  else{
    let result = model.addMovie(req.session.user.username, req.body);
    if (result.status){
      res.status(200);
      res.format({
        html: function(){
          res.send("/movies/" + result.id);
        },
        json: function(){
          res.send(model.getMovie(result.id));
        }
      });
    }
    else{
      res.status(500).send("Failed to add movie. Please check the input and try again.");
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
        res.format({
          html: function(){
            res.send("/movies/" + req.params.mid);
          },
          json: function(){
            res.send(model.getMovie(req.params.mid));
          }
        })

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
  if (!req.query.hasOwnProperty("page")){
    req.query.page = 1;
  }
  let result = model.searchPerson(req.query.name);
  let paginatedResult = model.paginate(req.query.page, result);
  if(paginatedResult && result.length > 0) {
    res.status(200);
    res.format({
      html: function(){
        res.render('pages/search-person', {user: req.session.user, personObjects: paginatedResult.result,
          prev: paginatedResult.prev, next: paginatedResult.next, pageNum: req.query.page,
          totalPages: paginatedResult.totalPages});
      },
      json: function(){
        res.send(paginatedResult.result);
      }
    });
  }
  else if(result.length == 0) {
    res.status(200);
    res.format({
      html: function(){
        res.render('pages/search-person', {user: req.session.user, personObjects: result,
          prev: false, next: false, pageNum: req.query.page, totalPages: 1});
      },
      json: function(){
        res.send(result);
      }
    });
  }
  else {
    res.status(404).send("Page does not exist");
  }
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

  if(req.query.page) {
    searchQuery += "&page=" + req.query.page;
  }
  else if(!req.query.page) {
    searchQuery += "&page=1";
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
      res.format({
        html: function(){
          res.render("pages/person", {userFollowsPerson: followBool, person: result, movieList: movieList, user: req.session.user});
        },
        json: function(){
          res.send(result);
        }
      });
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
    if (result.status){
      res.status(200);
      res.format({
        html: function(){
          res.send("/people/" + result.id);
        },
        json: function(){
          res.send(model.getPerson(result.id));
        }
      });
    }
    else{
      res.status(500).send("Failed to add person. Please check the input and try again.");
    }
  }
});

app.post("/people/:pid/follow", function(req, res, next){
  if (!req.session.user){
    res.send("/login");
  }
  else{
    let result = model.followPerson(req.session.user.username, req.params.pid);
    if(result){
      res.status(200);
      res.format({
        html: function(){
          res.send("/people/"+req.params.pid);
        },
        json: function(){
          res.send(model.getPerson(req.params.pid));
        }
      });
    }
    else{
      res.status(404).send("Person with id" + req.params.pid + " does not exist or you already follow them.");
    }
  }
});

app.post("/people/:pid/unfollow", function(req, res, next){
  if (!req.session.user){
    res.send("/login");
  }
  else{
    let result = model.unfollowPerson(req.session.user.username, req.params.pid);
    if (result){
      res.status(200);
      res.format({
        html: function(){
          res.send("/people/"+req.params.pid);
        },
        json: function(){
          res.send(model.getPerson(req.params.pid));
        }
      });
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
        res.format({
          html: function(){
            res.send("/people/" + req.params.pid);
          },
          json: function(){
            res.send(model.getPerson(req.params.pid));
          }
        });

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
    res.status(200);
    res.format({
      html: function(){
        res.render('pages/collaborators', {person: model.getPerson(req.params.pid), collaborators: result, user: req.session.user});
      },
      json: function(){
        res.send(result);
      }
    });
  }
  else{
    res.status(404).send("Person does not exist.");
  }
});

app.get("/reviews/:rid", function(req, res, next){
  let result = model.getReview(req.params.rid);
  if (result){
    res.status(200);
    res.format({
      html: function(){
        res.render('pages/review', {user: req.session.user, review: result, reviewUser: model.getUser(result.userID)});
      },
      json: function(){
        res.send(result);
      }
    });
  }
  else{
    res.status(404).send("Review does not exist.");
  }
});

app.post("/movies/:mid/basicReview/:rating", function(req, res, next){
    let result = model.addBasicReview(req.params.mid, req.params.rating);
    if (result){
      res.status(200);
      // window location href in client side js
      res.format({
        json: function () {
          res.send(model.getMovie(req.params.mid));
        },
        html: function () {
          res.status(200).send("/movies/"+req.params.mid);
        }
      });
    }
    else{
      res.status(404).send("Movie does not exist.");
    }
});

app.post("/movies/:mid/fullReview", function(req, res, next){
  if (!req.session.user){
    res.send("/login");
  }
  else{
    if (req.params.mid === req.body.movieID){
      let result = model.addFullReview(req.session.user.username, req.body);
      if (result){
        res.format({
          json: function () {
            res.send(model.getMovie(req.params.mid));
          },
          html: function () {
            res.status(200).send("/movies/"+req.params.mid);
          }
        });
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
