let users = require("./users.json");
let movies = require("./movies.json");
let moviesCopy = Object.keys(movies).map(key => {
    return movies[key];
});
let reviews = require("./reviews.json");
let people = require("./people.json");


//console.log(users);

let nextUserID = -1;
for(uid in users){
  if(Number(users[uid].id) >= nextUserID){
    nextUserID = Number(users[uid].id) + 1  ;
  }
}

// -------------------------------------------------USER----------------------------------------------

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

function login(loginObject){
  if (!users.hasOwnProperty(loginObject.username)){
    return false;
  }
  if (users[loginObject.username].password !== loginObject.password){
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


// --------------------------------------OTHER USER--------------------------------------------------------

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

// --------------------------------------MOVIES--------------------------------------------------------

function getMovie(movieID){    // gets the movie object when supplied with movieID
  if (movies.hasOwnProperty(movieID)){
    return movies[movieID];
  }
  return null;
}

// add movie
// need to parse genre from string to list? not required is movieObject is passed
// movieObject may have the "id" key empty - will be filled in by this function
function addMovie(requesting, movieObject) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"]) {
    // search if same title exists
    for(movieID in movies) {
      let movie = movies[movieID];
      if(movie["title"].toLowercase() === movieObject.title.toLowerCase()) {
        return false;
      }
    }
    // check if IDs in actors, director, writers is valid, else weed them out
    movieObject.actors = movieObject.actors.filter(person => people.hasOwnProperty(person)); // weeds out invalid IDs
    if(movieObject.actors.length === 0) {
      movieObject.actors = "N/A";
    }
    if(!people.hasOwnProperty(movieObject.director)) { // if directorID does not exist in people
      movieObject.director = "N/A";
    }
    movieObject.writers = movieObject.writers.filter(person => people.hasOwnProperty(person)); // weeds out invalid IDs
    if(movieObject.writers.length === 0) {
      movieObject.writers = "N/A";
    }

    let lastID = movies[(Object.keys(movies).length-1).toString()]["id"];
    // adding object to movies object
    movieObject.id = (lastID + 1).toString();
    movies[movieObject.id] = movieObject;
    // adding object to moviesCopy array
    moviesCopy.push(movieObject);
    moviesCopy = sortMovieYear();
    moviesCopy = sortMovieRating();
    return true;  // if addition is successful
  }
  return false;
}

// search movie
function searchMovie(requestingUser, keyWord) {
  let results = [];
  if (!users.hasOwnProperty(requestingUser)){
    return results;
  }
  for (movieID in movies){
    let movie = movies[movieID];
    if (movie.title.toLowerCase().indexOf(keyWord) >= 0){
      results.push(movie);
    }
  }
  return results;
}

// edit movie - if exists
// need to parse genre from string(?) to list
function editMovie(requesting, movieObject) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"] && movies.hasOwnProperty(movieObject.id)) {
    // get movie via movieID
    movies[movieObject.id] = movieObject;
    moviesCopy = sortMovieYear();
    moviesCopy = sortMovieRating();
    return true;  // if edit is successful
  }
  return false;
}

// deletes movies from database - if exists
function removeMovie(requesting, movieID) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"] && movies.hasOwnProperty(movieID)) {
    // remove the key movieID from movies list
    delete movies[movieID];
    moviesCopy = moviesCopy.filter(movie => movie.id !== movieID);
    moviesCopy = sortMovieYear();
    moviesCopy = sortMovieRating();
    return true; // if deletion is successful
  }
  return false;
}

// returns the number of common elements between two arrays
function commonElements(array1, array2){
  let common = 0;
  for (let i = 0; i < array1.length; i++){
    for (let j = 0; j < array2.length; j++){
      if (array1[i] === array2[j]){
        common++;
      }
    }
  }
  return common;
}

// similar movies - based on similar genre, cast
function similarMovies(requesting, movieID) {
  // implementation pending for cast
  // currently works if more than 2 genres match
  if (!users.hasOwnProperty(requesting) || !movies.hasOwnProperty(movieID)){
    return [];
  }
  let similar = [];
  let movie = movies[movieID];
  for (movieid in movies){
    if (movieid === movieID){
      continue;
    }
    else{
      if (commonElements(movies[movieid].genre, movie.genre) > 2){
        similar.push(movies[movieid]);
        if (similar.length > 2){
          break;
        }
      }
    }
  }
  return similar;
}

// get movie rating - original number of ratings from imdbVotes, average rating from imdbRating
function updateMovieRating(movieID, rating) {
  if (!movies.hasOwnProperty(movieID)){
    return false;
  }
  let movie = movies[movieID];
  let currentRatingSum = Number(movie.averageRating) * Number(movie.noOfRatings);
  currentRatingSum += rating;
  movie.noOfRatings += 1;
  movie.averageRating = currentRatingSum/movie.noOfRatings;
  return true;
}

// sort movies according to releaseYear (descending order)
function sortMovieYear(){
  let sortedMovies = [];
  sortedMovies =   moviesCopy.sort(function(a, b){
                     return Number(b.releaseYear) - Number(a.releaseYear);
                     });
  return sortedMovies;
}

// sort movies according to averageRating (descending order)
function sortMovieRating(){
  let sortedMovies = [];
  sortedMovies = moviesCopy.sort(function(a, b){
                  return Number(b.averageRating) - Number(a.averageRating);
                  });
  return sortedMovies;
}

// get the 8 most recently released movies
function upcoming(requesting){
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  return sortMovieYear().slice(0, 8);
}

// get the top 8 movies with highest averageRating
function fanPicks(requesting){
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  return sortMovieRating().slice(0, 8);
}

// get the movies you have reviewed
function yourList(requesting){
  if (!users.hasOwnProperty(requesting)){
    return [];
  }
  let moviesList = [];
  let reviews = users[requesting].reviews;

  for (reviewID in reviews){
    moviesList.push(movies[reviews[reviewID].movieID]);
  }
  return moviesList;
}
// -------------------------------------------------REVIEWS-------------------------------------------------

// get a particular review
function getReview(requestingUser, reviewID){
  if(!users.hasOwnProperty(requestingUser) || !reviews.hasOwnProperty(reviewID)){
    return false;
  }
  return reviews[reviewID];
}

// add a full review by specifying title, content, and rating out of 10
function addFullReview(requestingUser, reviewObject){
  if (!users.hasOwnProperty(requestingUser) || !movies.hasOwnProperty(reviewObject.movieID)){
    return false; // could not add review
  }
  //let lastID = reviews[(reviews.length).toString()].id;
  let lastID = reviews[(Object.keys(reviews).length-1).toString].id;
  //reviews.push(reviewObject);
  reviewObject.id = (lastID + 1).toString();
  reviews[reviewObject.id] = reviewObject;

  movies[reviewObject.movieID].reviews.push(lastID+1);
  updateMovieRating(reviewObject.movieID, reviewObject.rating); // movie rating is updated
  users[requestingUser].reviews.push(lastID+1);
  return true; // review added successfully
}

// add a basic review by only specifying a score out of 10
function addBasicReview(requestingUser, movieID, rating){
  if (!users.hasOwnProperty(requestingUser) || !movies.hasOwnProperty(movieID)){
    return false; // could not add review
  }
  updateMovieRating(movieID, rating); // movie rating is updated
  return true; // review added successfully
}

// get reviews for a particular movie
function getReviewMovie(requestingUser, movieID){
  if (!users.hasOwnProperty(requestingUser) || !movies.hasOwnProperty(movieID)){
    return [];
  }
  let movie = movies[movieID];
  let reviewList = [];
  for (reviewID in movie.reviews){
    reviewList.push(reviews[reviewID]); // add every review object for that movie to the list
  }
  return reviewList; // return list of reviews for that movie
}

// -------------------------------------------------PERSON-------------------------------------------------

// follows person
function followPerson(requesting, requested){   // requesting user follows requested person
  if (!people.hasOwnProperty(requested)){
    return null;
  }

  let requestingUser = users[requesting];
  let requestingID = requestingUser.id;
  let requestedPerson = people[requested];
  
  if(!requestingUser.followingPeople.includes(requested) && !requestedPerson.followers.includes(requestingID)) {
    requestingUser.followingPeople.push(requested);
    requestedPerson.followers.push(requesting);
  }
  else return null;
}

// unfollow person
function unfollowUser(requesting, requested){   // requesting user unfollows requested person
  if (!people.hasOwnProperty(requested)){
    return null;
  }

  let requestingUser = users[requesting];
  let requestingID = requestingUser.id;
  let requestedPerson = people[requested];

  if(!requestingUser.followingPeople.includes(requested) && !requestedPerson.followers.includes(requestingID)) {
    return null;
  }

  // user stores followingPerson list as an array of id strings
  requestingUser.followingPeople = requestingUser.followingPeople.filter(person => person !== requestedPerson.id); // removes follower (requested person) from requesting user's followingPeople
  requestedPerson.followers = requestedPerson.followers.filter(user => user !== requestingUser.username); // removes requesting user from requested person's followers list
}

// add a new person
function addPerson(requesting, personObject) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"]) {
    // search if same user exists
    for(personID in people) {
      let person = people[personID];
      if(person["name"].toLowercase() === personObject.name.toLowerCase()) {
        return false;
      }
    }
    let lastID = people[(Object.keys(people).length-1).toString()]["id"]
    // adding object to movies object
    personObject.id = (lastID + 1).toString();
    people[personObject.id] = personObject;
    return true;  // if addition is successful
  }
  return false;
}

// remove person - if exists
function removePerson(requesting, requested) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"] && people.hasOwnProperty(requested)) {
    let requestedPerson = people[requested];
    // remove from corresponding collaborators, followers, movies

    // removing from collaborator's collaborator list
    let collabIDList = requestedPerson.collaborators;
    for(let i=0; i<collabIDList.length; i++) {
      let collaborator = people[collabIDList[i]];
      collaborator.contributors = collaborator.collaborators.filter(personID => personID !== requestedPerson.id);      
    }

    // removing from followers' followingPeople list
    let followerIDList = requestedPerson.followers;
    for(let i=0; i<followerIDList.length; i++) {
      requestingUser.followingPeople = requestingUser.followingPeople.filter(personID => personID !== requestedPerson.id);
    }

    // removing from movies' cast list
    let movieIDList = requestedPerson.movies;
    for(let i=0; i<movieIDList.length; i++) {
      let movie = movies[i];
      // actors
      movie.actors = movie.actors.filter(personID => personID !== requestedPerson.id);  // person id saved as string in movies.json
      if(movie.actors.length === 0) {
        movie.actors = "N/A";
      }

      // director
      if(movie.director === requestedPerson.id) { // if movie director id string is the same as requested person's id (valueOf)
        movies.director = "N/A"; 
      } 
      
      // writers
      movies.writers = movies.writers.filter(personID => personID !== requestedPerson.id);  // person id saved as string in movies.json
      if(movies.writers.length === 0) {
        movies.writers = "N/A";
      }
    }

    // remove the key requested from people list
    delete people[requested];
    return true; // if deletion is successful
  }
  return false;
}

// get person - specific person
function getPerson(personID) { // gets the movie object when supplied with personID
  if (people.hasOwnProperty(personID)){
    return people[personID];
  }
  return null;
}

// search for a person - returns a list
function searchPerson(requestingUser, keyWord) {
  let results = [];
  if (!users.hasOwnProperty(requestingUser)){
    return results;
  }
  for (personID in people){
    let person = people[personID];
    if (person.name.toLowerCase().indexOf(keyWord) >= 0){
      results.push(person);
    }
  }
  return results;
}

// get frequent collaborator - returns list of person objects
function getFrequentCollaborator(personID) {
  let collaborators = [];
  if (people.hasOwnProperty(personID)){
    let collabIDList = people[personID].collaborators;
    for(let i=0; i<collabIDList.length; i++) {
      let collabID = collabIDList[i];
      collaborators.push(people[collabID]);
    }
  }
  return collaborators;
}

let userA = registerUser({username: "user4", password: "password"});
let userB = registerUser({username: "user5", password: "password"});
//console.log(similarMovies("user2", "5"))
//console.log(fanPicks("user0"));
//console.log(users);
//console.log(searchUsers("user0", "user"));
//console.log(getUser("user0", "user1"));
//followUser("user0", "user4");
//console.log(users);
//unfollowUser("user0", "user4");
//console.log(users);

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
