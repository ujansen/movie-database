let users = require("./users.json");
let movies = require("./movies.json");
//console.log(users);

let nextUserID = -1;
for(uid in users){
  if(Number(users[uid].id) >= nextUserID){
    nextUserID = Number(users[uid].id) + 1  ;
  }
}

// USER

function isValidUser(userObj){    // checks if the user exists
  if(!userObj){
    return false;
  }
  if(!userObj.username || !users.hasOwnProperty(userObj.username)){
    return false;
  }
  return true;
}

function registerUser(newUser){
  if (!newUser.username || !newUser.password){
    return null;
  }
  if (users.hasOwnProperty(newUser.username)){
    return null;
  }

  newUser.id = String(nextUserID);
  newUser.userType = false;
  newUser.followers = [];
  newUser.followingUsers = [];
  newUser.followingPeople = [];
  newUser.reviews = [];
  newUser.recommendedMovies = [];
  users[newUser.username] =  newUser;
  nextUserID++;
  return users[newUser.username];
}

function login(username, password){
  if (!users.hasOwnProperty(username)){
    return false;
  }
  if (users[username].password !== password){
    return false;
  }
  return true;
}

function showReviews(requestedUser){    // displays requested user's reviews 
  let reviewList = [];
  for (reviewID in users[requestedUser].reviews){
    reviewList.push(reviews[reviewID]);
  }
  return reviewList;
}

function showPeople(requestedUser){   // displays the people the user follows
  let peopleList = [];
  for (peopleID in users[requestedUser].followingPeople){
    peopleList.push(people[peopleID]);
  }
  return peopleList;
}

function showFollowers(requestedUser){    // lists all of user's followers
  let followerList = [];
  for (userID in users[requestedUser].followers){
    followerList.push(users[userID]);
  }
  return followerList;
}

function showFollowing(requestedUser){    // displays the list of users the user follows
  let followingList = [];
  for (userID in users[requestedUser].followingUsers){
    followingList.push(users[userID]);
  }
  return followingList;
}

function getUser(requesting, requested){    // gets the user object when supplied with username
  if (!users.hasOwnProperty(requested)){
    return users[requested];
  }
  return null;
}

function viewRecommendedMovies(requesting){     // lists recommended movies for requesting user
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  return users[requesting].recommendedMovies;
}


// OTHER USER 

function canAccessUser(requesting, requested){    // checks if user can access other user's profile
  if (users.hasOwnProperty(requested)){
    let requestingUser = users[requesting];
    if (requestingUser.username === requested || requestingUser.followingUsers.includes(requested)){
      return true;
    }
  }
  return false;
}

function removeUser(requestingUser, requestedUser){   // when requesting user unfollows another (requested) user
  requestingUser.followingUsers = requestingUser.followingUsers.filter(user => user !== requestedUser.username); // removes follower (requested user) from requesting user's following
  requestedUser.followers = requestedUser.followers.filter(user => user !== requestingUser.username); // removes requesting user from requested user's follower list
}

function searchUsers(requesting, keyWord){    // searches user by given keyword
  let results = [];
  if (!users.hasOwnProperty(requesting)){
    return results;
  }
  for (username in users){
    let user = users[username];
    if (user.username.toLowerCase().indexOf(keyWord) >= 0){
      results.push(user);
    }
  }
  return results;
}

function followUser(requesting, requested){   // requesting user follows requested user
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return null;
  }
  let requestingUser = users[requesting];
  let requestedUser = users[requested];
  requestingUser.followingUsers.push(requested);
  requestedUser.followers.push(requesting);
}

function unfollowUser(requesting, requested){   // requesting user unfollows requested user
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return null;
  }
  let requestingUser = users[requesting];
  let requestedUser = users[requested];
  if (!requestingUser.followingUsers.includes(requested)){
    return null;
  }

  removeUser(requestingUser, requestedUser);
}

function viewReviewsOtherUser(requesting, requested){   // requesting user viewing the reviews of another user
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return showReviews(requesting);
  }
    return showReviews(requested);
}

function viewPeopleOtherUser(requesting, requested){  // requesting user viewing the people followed by another user
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return showPeople(requesting);
  }
  if (canAccessUser(requesting, requested)){
    return showPeople(requested);
  }
}

function viewFollowersOtherUser(requesting, requested){   // requesting user viewing the followers of another user
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return showFollowers(requesting);
  }
  if (canAccessUser(requesting, requested)){
    return showFollowers(requested);
  }
}

function viewFollowingOtherUser(requesting, requested){   // requesting user viewing the following list of another user
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return showFollowing(requesting);
  }
  if (canAccessUser(requesting, requested)){
    return showFollowing(requested);
  }
}

// MOVIES

function getMovie(movieID){    // gets the movie object when supplied with movieID
  if (movies.hasOwnProperty(movieID)){
    return movies[movieID];
  }
  return null;
}

// add movie
function addMovie(requestingUser, title, runtime, releaseYear, genre, plot, poster, actors, director, writers, trailer) {
  // check if user contributing
  if(requestingUser["userType"]) {
    // search if same title exists
    for(movieID in movies) {
      let movie = movies[movieID];
      if(movie["title"].toLowercase() === title.toLowerCase) {
        return false;
      }
    }
    let lastID = movies[(movies.length).toString()]["id"]
    // add movie
    movies.push(
      {
        "id": (lastID+1).toString(),
        "title": title,
        "runtime": runtime,
        "releaseYear": releaseYear,
        "averageRating": 0,
        "noOfRatings": 0,
        "genre": genre,
        "plot": plot,
        "poster": poster,
        "actors": actors,
        "director": director,
        "writers": writers,
        "reviews": [],
        "trailer": trailer
      }
    );
    return true;  // if addition is successful
  }
  return false;
}

// search movie
function searchMovie(keyWord) {
  let results = [];
  for (movieID in movies){
    let movie = movies[movieID];
    if (movie.title.toLowerCase().indexOf(keyWord) >= 0){
      results.push(movie);
    }
  }
  return results;
}

// edit movie - if exists
function editMovie(requestingUser, movieID, runtime, releaseYear, genre, plot, poster, actors, director, writers, trailer) {
  // check if user contributing
  if(requestingUser["userType"] && movies.hasOwnProperty(movieID)) {
    // get movie via movieID
    movie = movies[movieID];
    movie["runtime"] = runtime,
    movie["releaseYear"] = releaseYear,
    movie["genre"] = genre,
    movie["plot"] = plot,
    movie["poster"] = poster,
    movie["actors"] = actors,
    movie["director"] = director,
    movie["writers"] = writers,
    movie["trailer"] = trailer
    
    return true;  // if edit is successful
  }
  return false;
}

// deletes movies from database - if exists
function removeMovie(requestingUser, movieID) {
  // check if user contributing
  if(requestingUser["userType"] && movies.hasOwnProperty(movieID)) {
    // remove the key movieID from movies list
    delete movies[movieID];
    return true; // if deletion is successful
  }
  return false;
}

// similar movies - based on similar genre, cast
function similarMovies() {
  // how to implement this... -think thonk-
}

// get movie rating - original number of ratings from imdbVotes, average rating from imdbRating
function movieRating(movieID) {
  let movie = movies[movieID];
  let ratingSum = 0;
  for(reviewID in movie["reviews"]) {
    let review = reviews["reviewID"];
    let rating = Number(review["rating"]);
    ratingSum += rating;
  }
  let newRating = ratingSum/Number(movie["noOfRatings"]); //Number(movie["averageRating"])
  movie["averageRating"] = newRating;
}


let userA = registerUser({username: "user4", password: "password"});
let userB = registerUser({username: "user5", password: "password"});
//console.log(users);
//console.log(searchUsers("user0", "user"));
//console.log(getUser("user0", "user1"));
followUser("user0", "user4");
console.log(users);
unfollowUser("user0", "user4");
console.log(users);

// recommended movies - user --> implement the function

// PERSON - json obj
// follow
// unfollow
// add person
// remove person
// edit person (opt)
// get person - specific person
// search person - list
// get frequent collaborator

    // MOVIES
    // get movie
    // search movie
    // add movie
    // edit movie - if exists
    // remove movie - if exists
    // similar movies - based on similar genre, cast --> pending
    // get movie rating - original number of ratings from imdbVotes, average rating from imdbRating

// REVIEWS
// add review - updates average rating, number of ratings, review id gets added, id added to user review list - limit review characters
// delete review (if own) - (opt)
// get review - (opt)
// get all reviews for user

// INDEX
// new and upcoming - list of recent 8 movies - edited only when movies added or removed
// your list - reviewed movies sorted by which you have rated highest - updated when user adds or removes a movie
// fan picks - sort according to rating - top 8 - edited only when movies added or removed, when review is added / deleted 
