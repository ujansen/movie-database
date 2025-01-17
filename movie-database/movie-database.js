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

let nextMovieID = -1;
for(mid in movies) {
  if(Number(mid) >= nextMovieID){
    nextMovieID = Number(mid) + 1  ;
  }
}

let nextPersonID = -1;
for(pid in people) {
  if(Number(pid) >= nextUserID){
    nextPersonID = Number(pid) + 1  ;
  }
}

let nextReviewID = -1;
for (rid in reviews){
  if (Number(rid) >= nextReviewID){
    nextReviewID = Number(rid) + 1;
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

// tested
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

// tested
function login(loginObject){
  if (!users.hasOwnProperty(loginObject.username)){
    return false;
  }
  if (users[loginObject.username].password !== loginObject.password){
    return false;
  }
  return true;
}

// tested
function showReviews(requestedUser){    // displays requested user's reviews
  let reviewList = [];
  for (reviewID of users[requestedUser].reviews){
    reviewList.push(reviews[reviewID]);
  }
  return reviewList;
}

function showPeople(requestedUser){   // displays the people the user follows
  let peopleList = [];
  for (peopleID of users[requestedUser].followingPeople){
    peopleList.push(people[peopleID]);
  }
  return peopleList;
}

function showFollowers(requestedUser){    // lists all of user's followers
  let followerList = [];
  for (userID of users[requestedUser].followers){
    followerList.push(users[userID]);
  }
  return followerList;
}

function showFollowing(requestedUser){    // displays the list of users the user follows
  let followingList = [];
  for (userID of users[requestedUser].followingUsers){
    followingList.push(users[userID]);
  }
  return followingList;
}

function getUser(requesting, requested){    // gets the user object when supplied with username
  if (users.hasOwnProperty(requested)){
    return users[requested];
  }
  return null;
}

function editUser(requesting, userObject) {
  if (!users.hasOwnProperty(requested) && !(requesting === userObject.username)){
    return null;
  }
  // user can only edit their own username, password, and about
  let user = users[requesting];
  // if user changes their username, their object key would need to change - since keys are usernames 
  // do not allow change of username
  user.password = userObject.password;
  user.about = userObject.about;
  return true;
}

// tested
function viewRecommendedMovies(requesting){     // lists recommended movies for requesting user
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  if (users[requesting].reviews.length === 0){
    return [];
  }
  let movieObjectList = [];
  getRecommendedMovies(requesting);
  for (let i = 0; i < users[requesting].recommendedMovies.length; i++){
    movieObjectList.push(movies[users[requesting].recommendedMovies[i]]);
  }
  return movieObjectList;
}

// tested
function getRecommendedMovies(requesting){
  if (!users.hasOwnProperty(requesting)){
    return false;
  }

  let requestingUser = users[requesting];
  let count = 0;
  let reviewedMovieIDs = [];
  for(let i=0; i<requestingUser.reviews.length; i++) {
    let reviewID = requestingUser.reviews[i];
    let movieID = reviews[reviewID].movieID;
    reviewedMovieIDs.push(movieID);
  }

  for(let i=0; i<requestingUser.reviews.length; i++) {
    let reviewID = requestingUser.reviews[i];
    let movie = movies[reviews[reviewID].movieID]; 
    for (movieID in movies){
      if(movie.id === movieID) {
        continue;
      }
      if (commonElements(movie.genre, movies[movieID].genre).length > 2 && !requestingUser.recommendedMovies.includes(movieID) && !reviewedMovieIDs.includes(movieID)){
          count++;
          requestingUser.recommendedMovies.push(movieID);
          if (count > 1){
            break;
          }
      }
    }
  }
  return true;
}

function toggleContributing(requesting) {
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  let requestingUser = users[requesting];
  requestingUser.userType = !requestingUser.userType;
  return true;
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
    if (user.username.toLowerCase().indexOf(keyWord.toLowerCase) >= 0){
      results.push(user);
    }
  }
  return results;
}

// tested
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
  return true;
}

// tested
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
  return true;
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

// tested
function getMovie(movieID){    // gets the movie object when supplied with movieID
  if (movies.hasOwnProperty(movieID)){
    return movies[movieID];
  }
  return null;
}

// tested
// add movie
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
      if(movie.title.toLowerCase() === movieObject.title.toLowerCase()) {
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

    // adding object to movies object
    movieObject.id = (nextMovieID).toString();
    movies[movieObject.id] = movieObject;
    // adding object to moviesCopy array
    moviesCopy.push(movieObject);

    // pushes movie to each of new actor's movie list
    for (actorID of movies[movieObject.id].actors){
      if (!people[actorID].movies.includes(movieObject.id)){
        people[actorID].movies.push(movieObject.id);
      }
    }

    // pushes movie to each of new writer's movie list
    for (writerID of movies[movieObject.id].writers){
      if (!people[writerID].movies.includes(movieObject.id)){
        people[writerID].movies.push(movieObject.id);
      }
    }

    // pushes movie to new director's movie list
    if(!people[movies[movieObject.id].director].movies.includes(movieObject.id)){
      people[movies[movieObject.id].director].movies.push(movieObject.id);
    }
    moviesCopy = sortMovieYear();
    moviesCopy = sortMovieRating();
    nextMovieID++;
    return true;  // if addition is successful
  }
  return false;
}

// tested
// search movie
function searchMovie(requestingUser, keyWord) {
  let results = [];
  if (!users.hasOwnProperty(requestingUser)){
    return results;
  }
  for (movieID in movies){
    let movie = movies[movieID];
    if (movie.title.toLowerCase().indexOf(keyWord.toLowerCase()) >= 0){
      results.push(movie);
    }
  }
  return results;
}

// tested
// edit movie - if exists
function editMovie(requesting, movieObject) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"] && movies.hasOwnProperty(movieObject.id) && movieObject.title === movies[movieObject.id].title) {
    // get movie via movieID
    let oldActors = movies[movieObject.id].actors; // stores current actors
    let oldWriters = movies[movieObject.id].writers; // stores current writers
    let oldDirector = movies[movieObject.id].director; // stores current director
    movies[movieObject.id] = movieObject; // stores new object

    // finds actors and writers that were part of the movie before but are not present now
    let uniqueActors = oldActors.filter(function(actorID) { return movies[movieObject.id].actors.indexOf(actorID) == -1; });
    let uniqueWriters = oldWriters.filter(function(writerID){ return movies[movieObject.id].writers.indexOf(writerID) == -1; });

    // removes movie from old actors' movie list
    for (uniqueActorID of uniqueActors){
      people[uniqueActorID].movies = people[uniqueActorID].movies.filter(movie => movie !== movieObject.id);
    }

    // removes movie from old writers' movie list
    for (uniqueWriterID of uniqueWriters){
      people[uniqueWriterID].movies = people[uniqueWriterID].movies.filter(movie => movie !== movieObject.id);
    }

    // removes movie from old director's movie list
    if (oldDirector !== movies[movieObject.id].director && people[oldDirector]){
      people[oldDirector].movies = people[oldDirector].movies.filter(movie => movie !== movieObject.id);

      // pushes movie to new director's movie list
      if (!people[movies[movieObject.id].director].movies.includes(movieObject.id)){
        people[movies[movieObject.id].director].movies.push(movieObject.id);
      }
    }

    // pushes movie to each of new actor's movie list
    for (actorID of movies[movieObject.id].actors){
      if (people[actorID] && !people[actorID].movies.includes(movieObject.id)){
        people[actorID].movies.push(movieObject.id);
      }
    }

    // pushes movie to each of new writer's movie list
    for (writerID of movies[movieObject.id].writers){
      if (people[writerID] && !people[writerID].movies.includes(movieObject.id)){
        people[writerID].movies.push(movieObject.id);
      }
    }

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
    moviesCopy = moviesCopy.filter(movie => movie.id !== movieID);
    moviesCopy = sortMovieYear();
    moviesCopy = sortMovieRating();
    if(Number(movieID) === nextMovieID-1) {
      nextMovieID--;
    }


    // tested - works
    let actorsList = movies[movieID].actors;
    for(let i=0; i<actorsList.length; i++) {
      let actor = people[actorsList[i]];
      if(actor) {
        actor.movies = actor.movies.filter(movie => movie !== movieID.toString()); // removes movie from actors
      }
    }
    let director = people[movies[movieID].director];
    if(director !== "N/A") {
      director.movies = director.movies.filter(movie => movie !== movieID.toString()); // removes movie from director
    }
    let writersList = movies[movieID].writers;
    for(let i=0; i<writersList.length; i++) {
      writer = people[writersList[i]];
      if(writer) {
        writer.movies = writer.movies.filter(movie => movie !== movieID.toString()); // removes movie from writer
      }
    }

    let reviewList = movies[movieID].reviews;
    for (reviewID of reviewList){ // removes reviews associated with movie and removes reviews from users
      users[reviews[reviewID].userID].reviews = users[reviews[reviewID].userID].reviews.filter(review => review !== reviewID);
      delete reviews[reviewID]; // remove the key reviewID from reviews list
    }

    // remove the key movieID from movies list
    delete movies[movieID];

    return true; // if deletion is successful
  }
  return false;
}

// returns the number of common elements between two arrays
function commonElements(array1, array2){
  let common =[];
  for (let i = 0; i < array1.length; i++){
    for (let j = 0; j < array2.length; j++){
      if (array1[i] === array2[j]){
        common.push(i);
      }
    }
  }
  // console.log(common);
  return common;
}

// tested
// similar movies - based on similar genre, cast
function similarMovies(requesting, movieID) {
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
      if (commonElements(movies[movieid].genre, movie.genre).length > 2){
        similar.push(movies[movieid]);
        if (similar.length > 2){
          break;
        }
      }
    }
  }
  return similar;
}

// tested
// get movie rating - original number of ratings from imdbVotes, average rating from imdbRating
function updateMovieRating(movieID, rating) {
  if (!movies.hasOwnProperty(movieID)){
    return false;
  }
  let movie = movies[movieID];
  let currentRatingSum = Number(movie.averageRating) * Number(movie.noOfRatings);
  currentRatingSum += rating;
  movie.noOfRatings += 1;
  movie.averageRating = (currentRatingSum/movie.noOfRatings.toFixed(1)); // keeps 1 digit after decimal point
  return true;
}

// tested
// sort movies according to releaseYear (descending order)
function sortMovieYear(){
  let sortedMovies = [];
  sortedMovies =   moviesCopy.sort(function(a, b){
                     return Number(b.releaseYear) - Number(a.releaseYear);
                     });
  return sortedMovies;
}

// tested
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

  for (reviewID of reviews){
    moviesList.push(movies[reviews[reviewID].movieID]);
  }
  return moviesList;
}
// -------------------------------------------------REVIEWS-------------------------------------------------

// tested
// get a particular review
function getReview(requestingUser, reviewID){
  if(!users.hasOwnProperty(requestingUser) || !reviews.hasOwnProperty(reviewID)){
    return false;
  }
  return reviews[reviewID];
}

// tested
// add a full review by specifying title, content, and rating out of 10
function addFullReview(requestingUser, reviewObject){
  if (!users.hasOwnProperty(requestingUser) || !movies.hasOwnProperty(reviewObject.movieID)){
    return false; // could not add review
  }

  reviewObject.id = (nextReviewID).toString();
  reviews[reviewObject.id] = reviewObject;

  movies[reviewObject.movieID].reviews.push(nextReviewID);
  updateMovieRating(reviewObject.movieID, reviewObject.rating); // movie rating is updated
  users[requestingUser].reviews.push(nextReviewID);
  nextReviewID++;
  return true; // review added successfully
}

// tested
// add a basic review by only specifying a score out of 10
function addBasicReview(requestingUser, movieID, rating){
  if (!users.hasOwnProperty(requestingUser) || !movies.hasOwnProperty(movieID)){
    return false; // could not add review
  }
  updateMovieRating(movieID, rating); // movie rating is updated
  return true; // review added successfully
}

// tested
// get reviews for a particular movie
function getReviewMovie(requestingUser, movieID){
  if (!users.hasOwnProperty(requestingUser) || !movies.hasOwnProperty(movieID)){
    return [];
  }
  let movie = movies[movieID];
  let reviewList = [];
  for (reviewID of movie.reviews){
    reviewList.push(reviews[reviewID]); // add every review object for that movie to the list
  }
  return reviewList; // return list of reviews for that movie
}

// -------------------------------------------------PERSON-------------------------------------------------

// tested
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

// tested
// unfollow person
function unfollowPerson(requesting, requested){   // requesting user unfollows requested person
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
    // search if person with same name exists
    for(personID in people) {
      let person = people[personID];
      if(person["name"].toLowerCase() === personObject.name.toLowerCase()) {
        return false;
      }
    }
    // adding object to movies object
    personObject.id = (nextPersonID).toString();
    people[personObject.id] = personObject;
    nextPersonID++;
    return true;  // if addition is successful
  }
  return false;
}

function editPerson(requesting, personObject) {
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(requestingUser["userType"]) {
    // search if person with same name exists
    for(personID in people) {
      let person = people[personID];
      if(person["name"].toLowerCase() === personObject.name.toLowerCase()) {
        return false;
      }
    }
    person = people[personObject.id];
    //personObject.id = (nextPersonID).toString();
    person.name = personObject.name;
    person.about = personObject.about;
    // followers, collaborators, and movies are determined by the system
    return true;  // if edit is successful
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
    for(let i = 0; i < collabIDList.length; i++) {
      let collaborator = people[collabIDList[i]];
      collaborator.collaborators = collaborator.collaborators.filter(personID => personID !== requestedPerson.id);
    }

    // removing from followers' followingPeople list
    let followerIDList = requestedPerson.followers;
    for(let i = 0; i < followerIDList.length; i++) {
      users[followerIDList[i]].followingPeople = users[followerIDList[i]].followingPeople.filter(personID => personID !== requestedPerson.id);
    }

    // removing from movies' cast list
    let movieIDList = requestedPerson.movies;
    for(let i = 0; i < movieIDList.length; i++) {
      let movie = movies[movieIDList[i].toString()];
      if(movie) {

        // actors
        movie.actors = movie.actors.filter(personID => personID !== requestedPerson.id);  // person id saved as string in movies.json
        if(movie.actors.length === 0) {
          movie.actors = "N/A";
        }

        // director
        if(movie.director === requestedPerson.id) { // if movie director id string is the same as requested person's id (valueOf)
          movie.director = "N/A";
        }

        // writers
        movie.writers = movie.writers.filter(personID => personID !== requestedPerson.id);  // person id saved as string in movies.json
        if(movie.writers.length === 0) {
          movie.writers = "N/A";
        }
      }

    }

    // remove the key requested from people list
    delete people[requested];
    if(Number(requested) === nextPersonID-1) {
      nextPersonID--;
    }
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
    if (person.name.toLowerCase().indexOf(keyWord.toLowerCase) >= 0){
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
      if(people[collabID]) {
        collaborators.push(people[collabID]);
      }
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

// ------------------------------------------ testing ---------------------------------------------------
console.log(registerUser({username: "user1", password: "password"}));
console.log();

console.log('login({username: "user1", password: "password"})');
console.log(login({username: "user1", password: "password"}));
console.log();

console.log('getUser("user2", "user1")');
console.log(getUser("user2", "user1"));
console.log();

console.log('getMovie("0")');
console.log(getMovie("0"));
console.log();

// comments cleanup required
console.log('viewRecommendedMovies("user2")');
console.log(viewRecommendedMovies("user2"));
console.log();

// console.log('similarMovies("user2", "0")');
// console.log(similarMovies("user2", "0"));
// console.log();

console.log('showReviews("user2")');
console.log(showReviews("user2"));
console.log();

// switch to contributing
console.log('toggleContributing("user2")');
console.log(toggleContributing("user2"));
console.log();

//console.log('removeMovie("user2", "0")');
//console.log(removeMovie("user2", "0"));
//console.log();

// remove movie should remove all the reviews associated with it - done
// removing reviews should remove it in all the places where it is stored (users) - done
// similarly addMovie and editMovie should update all of its cast members - done
console.log('getUser("user2", "user2")');
console.log(getUser("user2", "user2"));
console.log();

console.log('getMovie("0")');
console.log(getMovie("0"));
console.log();

console.log('getReview("user2", "4")');
console.log(getReview("user2", "4"));
console.log();

console.log("addmovie");
console.log(addMovie("user2", {
        "title": "GoldenEye",
        "runtime": "130 min",
        "releaseYear": "1995",
        "averageRating": 7.2,
        "noOfRatings": 233822,
        "genre": ["action", "adventure", "thriller"],
        "plot": "Years after a friend and fellow 00 agent is killed on a joint mission, a secret space based weapons program known as \"GoldenEye\" is stolen. James Bond sets out to stop a Russian crime syndicate from using the weapon.",
        "poster": "https://m.media-amazon.com/images/M/MV5BMzk2OTg4MTk1NF5BMl5BanBnXkFtZTcwNjExNTgzNA@@._V1_SX300.jp",
        "actors": ["1", "2"],
        "director": "4",
        "writers": ["6", "8"],
        "reviews": ["0", "2"],
        "trailer": ""
}));
console.log();

console.log('removePerson("user2", "4")');
console.log(removePerson("user2", "4"));
console.log();

console.log('getMovie("6")');
console.log(getMovie("6"));
console.log();

console.log("editmovie");
console.log(editMovie("user2", {
        "id": "6",
        "title": "GoldenEye",
        "runtime": "130 min",
        "releaseYear": "1998",
        "averageRating": 8.3,
        "noOfRatings": 864385,
        "genre": ["action", "adventure", "thriller", "fantasy"],
        "plot": "Years after a friend and fellow 00 agent is killed on a joint mission, a secret space based weapons program known as \"GoldenEye\" is stolen. James Bond sets out to stop a Russian crime syndicate from using the weapon.",
        "poster": "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
        "actors": ["4", "0"],
        "director": "3",
        "writers": ["6", "8"],
        "reviews": ["0", "2"],
        "trailer": ""
}));
console.log();

console.log('searchMovie("user2", "to")');
console.log(searchMovie("user2", "to"));
console.log();

console.log('followUser("user2", "user1")');
console.log(followUser("user2", "user1"));
console.log();

console.log('unfollowUser("user2", "user3")');
console.log(unfollowUser("user2", "user3"));
console.log();

console.log('unfollowPerson("user2", "5")');
console.log(unfollowPerson("user2", "5"));
console.log();

console.log('followPerson("user2", "4")');
console.log(followPerson("user2", "4"));
console.log();

console.log('getUser("user2", "user2")');
console.log(getUser("user2", "user2"));
console.log();

console.log('getPerson("1")');
console.log(getPerson("1"));
console.log();

console.log('removePerson("user2", "1")');
console.log(removePerson("user2", "1"));
console.log();

console.log('getMovie("2")');
console.log(getMovie("2"));
console.log();

console.log('getFrequentCollaborator("0")');
console.log(getFrequentCollaborator("0"));
console.log();

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
