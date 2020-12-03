let users = require("./public/json/users.json");
let movies = require("./public/json/extracted-movie-data-id.json");
let moviesCopy = Object.keys(movies).map(key => {
    return movies[key];
});
let reviews = require("./public/json/reviews.json");
let people = require("./public/json/extracted-person-data.json");
const puppeteer = require('puppeteer');

let sortedByYear = moviesCopy.sort(function(a, b){
  return Number(b.releaseYear) - Number(a.releaseYear);
  });
let sortedByRating = moviesCopy.sort(function(a, b){
  return Number(b.averageRating) - Number(a.averageRating);
  });

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

function paginate(pageNum, data) {
  // check if page exists - if not then send null
  if(pageNum < 1 || data.length - pageNum*10 <= -10) {
    return false;
  }
  let prev = true;
  let next = true;
  if(pageNum == 1) prev = false;
  if(pageNum*10 > data.length) next = false;
  // slicing and stuff (all input data is in array format)
  let result = data.slice((pageNum-1)*10, next? pageNum*10 : data.length);
  return {prev: prev, next: next, result: result};
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
  newUser.profilePic = "";
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

function getUser(requested){    // gets the user object when supplied with username
  if (users.hasOwnProperty(requested)){
    return users[requested];
  }
  return null;
}

function getUserByID(requestedID) {
  for(username in users) {
    if(users[username].id === requestedID) {
      return users[username];
    }
  }
  return null;
}

function editUser(requesting, userObject) {
  if (!users.hasOwnProperty(requesting) && !(requesting === userObject.username)){
    return null;
  }
  // user can only edit their own username, password, and about
  let user = users[requesting];
  /* if(user.password !== userObject.oldPassword) {
    return null;
  } */
  // if user changes their username, their object key would need to change - since keys are usernames
  // do not allow change of username
  user.password = userObject.password;
  user.about = userObject.about;
  user["profilePic"] = userObject.profilePic;
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

// could use similarMovies
// tested, fixed
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

  //while (requestingUser.recommendedMovies.length < 6){ - solved
    for(let i=0; i<requestingUser.reviews.length; i++) {      //for (reviewID in requestingUser.reviews){
      // reviewID is getting index of array requestingUser.reviews(why?) - solved
      // https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
      let reviewID = requestingUser.reviews[i];
      // count = 0;
      // console.log("review id");
      // console.log(reviewID);
      let movie = movies[reviews[reviewID].movieID]; // 4-0, 1-2
      // console.log(movie);
      for (movieID in movies){
        count = 0;
        // console.log("movie ids");
        // console.log(movie.id);
        // console.log(movieID);
        // console.log("--")
        if(movie.id === movieID) {
          // console.log("continuing");
          continue;
        }
        // only getting string keys, not object
        // loops from 0 to 5 and again from 0 to 5 infinitely - solved
        //console.log(movieID); //string, "0"
        if (commonElements(movie.genre, movies[movieID].genre).length > 2 && !requestingUser.recommendedMovies.includes(movieID) && !reviewedMovieIDs.includes(movieID)){
            count++;
            requestingUser.recommendedMovies.push(movieID);
            if (count > 1){
              break;
            }
        }
      }
    }
    //break;
  //}
  return requestingUser.recommendedMovies.push(movieID);
}

function toggleContributing(requesting) {
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  let requestingUser = users[requesting];
  requestingUser.userType = !requestingUser.userType;
  return true;
}

async function searchIMDB(searchTerm){
  let movieDetails = {title: "", rating: "", director: [], writers: [], actors: [], synopsis: "", poster:"", url:""};
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com');

  await page.focus('#suggestion-search');
  await page.keyboard.type(searchTerm);
  await page.click('#suggestion-search-button');

  try{
    await page.waitForSelector('#main > div > div:nth-child(3) > table > tbody > tr.findResult.odd > td.primary_photo');
    await page.click('#main > div > div:nth-child(3) > table > tbody > tr.findResult.odd > td.primary_photo');

    await page.waitForSelector('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1');
    let [movieHeaderElement] = await page.$x('//*[@id="title-overview-widget"]/div[1]/div[2]/div/div[2]/div[2]/h1');
    let textContent = await movieHeaderElement.getProperty('textContent');
    let movieTitle = await textContent.jsonValue();
    movieDetails.title = movieTitle.trim();
  }
  catch (err){
    console.log("Something went wrong while trying to get the movie title. The exception, if you're interested is as follows:\n" + err);
  }

  try{
    await page.waitForSelector('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span');
    let [movieRateElement] = await page.$x('//*[@id="title-overview-widget"]/div[1]/div[2]/div/div[1]/div[1]/div[1]/strong/span');
    let textContent = await movieRateElement.getProperty('textContent');
    let movieRating = await textContent.jsonValue();
    movieDetails.rating = movieRating.trim();
  }
  catch (err){
    console.log("Something went wrong while trying to get the movie rating. The exception, if you're interested is as follows:\n" + err);
  }

  try{
    await page.waitForSelector('#title-overview-widget > div.plot_summary_wrapper > div.plot_summary > div:nth-child(2) > a');
    let [directorElement] = await page.$x('//*[@id="title-overview-widget"]/div[2]/div[1]/div[2]/a');
    let textContent = await directorElement.getProperty('textContent');
    let directorName = await textContent.jsonValue();
    if(!movieDetails.director.includes(directorName.trim())) {
      movieDetails.director.push(directorName.trim());
    }
  }
  catch (err){
    console.log("Something went wrong while trying to get the movie director. The exception, if you're interested is as follows:\n" + err);
  }

  try{
    await page.waitForSelector('#title-overview-widget > div.plot_summary_wrapper > div.plot_summary > div.summary_text');
    let [synopsisElement] = await page.$x('//*[@id="title-overview-widget"]/div[2]/div[1]/div[1]');
    let textContent = await synopsisElement.getProperty('textContent');
    let synopsis = await textContent.jsonValue();
    movieDetails.synopsis = synopsis.trim().trim(".").trim("EN");
  }
  catch (err){
    console.log("Something went wrong while trying to get the movie synopsis. The exception, if you're interested is as follows:\n" + err);
  }

  try{
    await page.waitForSelector('#title-overview-widget > div.plot_summary_wrapper > div.plot_summary > div:nth-child(3)');
    for (let i = 1; i < 3; i++){
      let [writerElement] = await page.$x('//*[@id="title-overview-widget"]/div[2]/div[1]/div[3]/a['+i+']');
      if (![writerElement]){
        continue;
      }
      let textContent = await writerElement.getProperty('textContent');
      let writer = await textContent.jsonValue();
      if (!movieDetails.writers.includes(writer)){
        movieDetails.writers.push(writer);
      }
    }
  }

  catch (err){
    console.log("Something went wrong while trying to get the movie writers. The exception, if you're interested is as follows:\n" + err);
  }

  try{
    await page.waitForSelector('#title-overview-widget > div.plot_summary_wrapper > div.plot_summary > div:nth-child(4)');
    for (let i = 1; i < 4; i++){
      let [actorElement] = await page.$x('//*[@id="title-overview-widget"]/div[2]/div[1]/div[4]/a['+i+']');
      if (![actorElement]){
        continue;
      }
      let textContent = await actorElement.getProperty('textContent');
      let actor = await textContent.jsonValue();
      if (!movieDetails.actors.includes(actor)){
          movieDetails.actors.push(actor);
      }
    }
  }

  catch (err){
    console.log("Something went wrong while trying to get the movie actors. The exception, if you're interested is as follows:\n" + err);
  }

  try{
    await page.waitForSelector('#title-overview-widget > div.vital > div.slate_wrapper > div.poster > a > img');
    let [posterLink] = await page.$x('//*[@id="title-overview-widget"]/div[1]/div[3]/div[1]/a/img');
    let linkContent = await posterLink.getProperty('src');
    let poster = await linkContent.jsonValue();
    movieDetails.poster = poster;
  }

  catch(err){
    console.log("Something went wrong while trying to get the movie poster. The exception, if you're interested is as follows:\n" + err);
  }

  movieDetails.url = page.url();

  browser.close();
  console.log(movieDetails);
  return movieDetails;
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
    if (keyWord && user.username.toLowerCase().indexOf(keyWord.toLowerCase()) >= 0){
      results.push(user);
    }
    else if(keyWord == undefined || keyWord == "") {
      results.push(user);
    }
  }
  return results;
}

// tested
function followUser(requesting, requested){   // requesting user follows requested user
  if (!users.hasOwnProperty(requested) || !users.hasOwnProperty(requesting)){
    return null;
  }

  if (requesting === requested){
    return null;
  }

  let requestingUser = users[requesting];
  let requestedUser = users[requested];

  if (requestingUser.followingUsers.includes(requested) || requestedUser.followers.includes(requesting)){
    return null;
  }
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
  if (!requestingUser.followingUsers.includes(requested) || !requestedUser.followers.includes(requesting)){
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
// need to parse genre from string to list? not required is movieObject is passed
// movieObject may have the "id" key empty - will be filled in by this function
function addMovie(requesting, movieObject) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  if(requestingUser["userType"]) {
    // search if same title exists
    for(movieID in movies) {
      let movie = movies[movieID];
      if(movie.title.toLowerCase() === movieObject.title.toLowerCase()) {
        return false;
      }
    }

    // check if names in actors, director, writers is valid and if valid, add corresponding ID, else weed them out
    if (movieObject.actors !== ""){
      let movieObjectActors = movieObject.actors.trim().split(",");
      let movieActorsList = [];
      for (actor of movieObjectActors){
        for (personID in people){
          if (actor.trim().toLowerCase() === people[personID].name.trim().toLowerCase() && !movieActorsList.includes(people[personID].id)){
            movieActorsList.push(people[personID].id);
            break;
          }
        }
      }
      if (movieActorsList.length === 0){
        movieObject.actors = ["N/A"];
      }
      else{
        movieObject.actors = movieActorsList;
      }
    }
    else{
      movieObject.actors = ["N/A"];
    }

    if (movieObject.director !== ""){
      let movieObjectDirector = movieObject.director.trim().split(",");
      let movieDirectorsList = [];
      for (director of movieObjectDirector){
        for (personID in people){
          if (director.trim().toLowerCase() === people[personID].name.trim().toLowerCase() && !movieDirectorsList.includes(people[personID].id)){
            movieDirectorsList.push(people[personID].id);
            break;
          }
        }
      }
      if (movieDirectorsList.length === 0){
        movieObject.director = ["N/A"];
      }
      else{
        movieObject.director = movieDirectorsList;
      }
    }
    else{
      movieObject.director = ["N/A"];
    }

    if (movieObject.writers !== ""){
      let movieObjectWriters = movieObject.writers.trim().split(",");
      let movieWritersList = [];
      for (writer of movieObjectWriters){
        for (personID in people){
          if (writer.trim().toLowerCase() === people[personID].name.trim().toLowerCase() && !movieWritersList.includes(people[personID].id)){
            movieWritersList.push(people[personID].id);
            break;
          }
        }
      }
      if (movieWritersList.length === 0){
        movieObject.writers = ["N/A"];
      }
      else{
        movieObject.writers = movieWritersList;
      }
    }
    else{
      movieObject.writers = ["N/A"];
    }
    if (movieObject.genre !== ""){
      let movieObjectGenres = movieObject.genre.trim().split(",");
      let movieGenreList = [];
      for (genre of movieObjectGenres){
        if (!movieGenreList.includes(genre.trim().toLowerCase())){
          movieGenreList.push(genre.trim().toLowerCase());
        }
      }
      movieObject.genre = movieGenreList;
    }

    //let lastID = movies[(Object.keys(movies).length-1).toString()]["id"];
    // adding object to movies object
    movieObject.averageRating = 0;
    movieObject.noOfRatings = 0;
    movieObject.id = (nextMovieID).toString();
    movieObject.reviews = [];
    if(!movieObject.poster.trim()) {
      movieObject.poster = "https://flukyfeed.com/wp-content/uploads/2020/07/wait-a-minute-696x523.jpg";
    }
    if(!movieObject.trailer.trim()) {
      movieObject.trailer = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    }
    movies[movieObject.id] = movieObject;
    // adding object to moviesCopy array
    moviesCopy.push(movieObject);

    // pushes movie to each of new actor's movie list
    for (actorID of movies[movieObject.id].actors){
      if (actorID !== "N/A" && !people[actorID].movies.includes(movieObject.id)){
        people[actorID].movies.push(movieObject.id);
      }
    }

    // pushes movie to each of new writer's movie list
    for (writerID of movies[movieObject.id].writers){
      if (writerID !== "N/A" && !people[writerID].movies.includes(movieObject.id)){
        people[writerID].movies.push(movieObject.id);
      }
    }

    // pushes movie to new director's movie list
    for (directorID of movies[movieObject.id].director){
      if(directorID !== "N/A" && !people[directorID].movies.includes(movieObject.id)){
        people[directorID].movies.push(movieObject.id);
      }
    }

    let movieCastMembers = new Set(movieObject.actors.concat(movieObject.director, movieObject.writers));
    movieCastMembers = [...movieCastMembers];

    // during movie addition
    for (let i = 0; i < movieCastMembers.length - 1; i++){
      for (let j = i + 1; j < movieCastMembers.length; j++){
        if (movieCastMembers[i] !== movieCastMembers[j]){
          if (people[movieCastMembers[i]] && people[movieCastMembers[j]] && people[movieCastMembers[i]].collaborators.hasOwnProperty(movieCastMembers[j])){
            people[movieCastMembers[i]].collaborators[movieCastMembers[j]] += 1;
            people[movieCastMembers[j]].collaborators[movieCastMembers[i]] += 1;
          }
          else if(people[movieCastMembers[i]] && people[movieCastMembers[j]] && !people[movieCastMembers[i]].collaborators.hasOwnProperty(movieCastMembers[j])){
            people[movieCastMembers[i]].collaborators[movieCastMembers[j]] = 1;
            people[movieCastMembers[j]].collaborators[movieCastMembers[i]] = 1;
          }
        }
      }
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
function searchMovie(searchObject) {
  let searchtitle = "";
  let searchgenre = "";
  let searchminRating = 0;
  let searchyear = "";
  if (searchObject.title){
    searchtitle = searchObject.title;
  }
  else{
    searchtitle = "";
  }
  if (searchObject.genre){
    searchgenre = searchObject.genre.trim().toLowerCase();
    searchgenre = searchgenre.charAt(0).toUpperCase() + searchgenre.slice(1);
    if (searchgenre === "Sci-fi"){
      searchgenre = searchgenre.slice(0, 4) + searchgenre.charAt(4).toUpperCase() + searchgenre.slice(5);
    }
    else if (searchgenre === "Film-noir"){
      searchgenre = searchgenre.slice(0, 5) + searchgenre.charAt(5).toUpperCase() + searchgenre.slice(6);
    }
  }
  else{
    searchgenre = "";
  }
  if (searchObject.minRating){
    searchminRating = Number(searchObject.minRating);
  }
  else{
    searchminRating = 0;
  }
  if (searchObject.year){
    searchyear = searchObject.year;
  }
  else{
    searchyear = "";
  }
  let results = [];
  if (searchtitle == "" && searchgenre == "" && searchminRating == 0 && searchyear == ""){
    results = Object.keys(movies).map(key => {
      return movies[key];
    }); ;
    return results;
  }
  for (movieID in movies){
    let movie = movies[movieID];
    if (searchyear == "" && searchgenre == ""){
      if (movie.title.toLowerCase().indexOf(searchtitle.toLowerCase()) >= 0  &&
          movie.averageRating >= searchminRating){
        results.push(movie);
      }
    }
    else if (searchyear == "" && searchgenre !== ""){
      if (movie.title.toLowerCase().indexOf(searchtitle.toLowerCase()) >= 0  && movie.genre.includes(searchgenre) &&
          movie.averageRating >= searchminRating){
        results.push(movie);
      }
    }
    else if (searchgenre == "" && searchyear !== ""){
      if (movie.title.toLowerCase().indexOf(searchtitle.toLowerCase()) >= 0  && movie.releaseYear.trim() == searchyear &&
          movie.averageRating >= searchminRating){
        results.push(movie);
      }
    }
    else{
      if (movie.title.toLowerCase().indexOf(searchtitle.toLowerCase()) >= 0  && movie.genre.includes(searchgenre) &&
          movie.averageRating >= searchminRating && movie.releaseYear.trim() == searchyear){
        results.push(movie);
    }
  }

  }
  return results;
}

// tested
// TAKEN CARE OF CHANGING CAST, BUT STILL TEST IT OUT
// edit movie - if exists
// need to parse genre from string(?) to list
function editMovie(requesting, movieObject) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  let requestingUser = users[requesting];
  // check if user contributing
  if(movies.hasOwnProperty(movieObject.id) && movieObject.title === movies[movieObject.id].title) {
    // get movie via movieID
    let oldActors = movies[movieObject.id].actors; // stores current actors
    let oldWriters = movies[movieObject.id].writers; // stores current writers
    let oldDirectors = movies[movieObject.id].director; // stores current director

    // before updating movie, get the old actors, directors, and writers
    let movieOldCastMembers = new Set(oldActors.concat(oldDirectors, oldWriters));
    movieOldCastMembers = [...movieOldCastMembers];

    // remove each person from every other person's frequent collaborators once
    for (let i = 0; i < movieOldCastMembers.length - 1; i++){
      for (let j = i + 1; j < movieOldCastMembers.length; j++){
        if (movieOldCastMembers[i] !== movieOldCastMembers[j]){
          if (people[movieOldCastMembers[i]] && people[movieOldCastMembers[j]] && people[movieOldCastMembers[i]].collaborators.hasOwnProperty(movieOldCastMembers[j])){
            people[movieOldCastMembers[i]].collaborators[movieOldCastMembers[j]] -= 1;
            if (people[movieOldCastMembers[i]].collaborators[movieOldCastMembers[j]] < 0){
              people[movieOldCastMembers[i]].collaborators[movieOldCastMembers[j]] = 0;
            }
            people[movieOldCastMembers[j]].collaborators[movieOldCastMembers[i]] -= 1;
            if (people[movieOldCastMembers[j]].collaborators[movieOldCastMembers[i]] < 0){
              people[movieOldCastMembers[j]].collaborators[movieOldCastMembers[i]] = 0;
            }
          }
          else if(people[movieOldCastMembers[i]] && people[movieOldCastMembers[j]] && !people[movieOldCastMembers[i]].collaborators.hasOwnProperty(movieOldCastMembers[j])){
            people[movieOldCastMembers[i]].collaborators[movieOldCastMembers[j]] = 0;
            people[movieOldCastMembers[j]].collaborators[movieOldCastMembers[i]] = 0;
          }
        }
      }
    }

    movieObject.reviews = movies[movieObject.id].reviews;
    movieObject.averageRating = movies[movieObject.id].averageRating;
    movieObject.noOfRatings = movies[movieObject.id].noOfRatings;
    if (movieObject.actors !== ""){
      let movieObjectActors = movieObject.actors.trim().split(",");
      let movieActorsList = [];
      for (actor of movieObjectActors){
        for (personID in people){
          if (actor.trim().toLowerCase() === people[personID].name.trim().toLowerCase() && !movieActorsList.includes(people[personID].id)){
            movieActorsList.push(people[personID].id);
            break;
          }
        }
      }
      if (movieActorsList.length === 0){
        movieObject.actors = ["N/A"];
      }
      else{
        movieObject.actors = movieActorsList;
      }
    }
    else{
      movieObject.actors = ["N/A"];
    }

    if (movieObject.director !== ""){
      let movieObjectDirector = movieObject.director.trim().split(",");
      let movieDirectorsList = [];
      for (director of movieObjectDirector){
        for (personID in people){
          if (director.trim().toLowerCase() === people[personID].name.trim().toLowerCase() && !movieDirectorsList.includes(people[personID].id)){
            movieDirectorsList.push(people[personID].id);
            break;
          }
        }
      }
      if (movieDirectorsList.length === 0){
        movieObject.director = ["N/A"];
      }
      else{
        movieObject.director = movieDirectorsList;
      }
    }
    else{
      movieObject.director = ["N/A"];
    }

    if (movieObject.writers !== ""){
      let movieObjectWriters = movieObject.writers.trim().split(",");
      let movieWritersList = [];
      for (writer of movieObjectWriters){
        for (personID in people){
          if (writer.trim().toLowerCase() === people[personID].name.trim().toLowerCase() && !movieWritersList.includes(people[personID].id)){
            movieWritersList.push(people[personID].id);
            break;
          }
        }
      }
      if (movieWritersList.length === 0){
        movieObject.writers = ["N/A"];
      }
      else{
        movieObject.writers = movieWritersList;
      }
    }
    else{
      movieObject.writers = ["N/A"];
    }
    if (movieObject.genre !== ""){
      let movieObjectGenres = movieObject.genre.trim().split(",");
      let movieGenreList = [];
      for (genre of movieObjectGenres){
        if (!movieGenreList.includes(genre.trim().toLowerCase())){
          movieGenreList.push(genre.trim().toLowerCase());
        }
      }
      movieObject.genre = movieGenreList;
    }
    movies[movieObject.id] = movieObject; // stores new object

    // finds actors and writers that were part of the movie before but are not present now
    let uniqueActors = oldActors.filter(function(actorID) { return movies[movieObject.id].actors.indexOf(actorID) == -1; });
    let uniqueWriters = oldWriters.filter(function(writerID){ return movies[movieObject.id].writers.indexOf(writerID) == -1; });
    let uniqueDirectors = oldDirectors.filter(function(directorID){ return movies[movieObject.id].director.indexOf(directorID) == -1});

    // removes movie from old actors' movie list
    for (uniqueActorID of uniqueActors){
      if (people[uniqueActorID] && uniqueActorID !== "N/A"){
        people[uniqueActorID].movies = people[uniqueActorID].movies.filter(movie => movie !== movieObject.id);
      }
    }

    // removes movie from old writers' movie list
    for (uniqueWriterID of uniqueWriters){
      if (people[uniqueWriterID] && uniqueWriterID !== "N/A"){
        people[uniqueWriterID].movies = people[uniqueWriterID].movies.filter(movie => movie !== movieObject.id);
      }
    }

    // removes movie from old director's movie list
    for (uniqueDirectorID of uniqueDirectors){
      if (people[uniqueDirectorID] && uniqueDirectorID !== "N/A"){
        people[uniqueDirectorID].movies = people[uniqueDirectorID].movies.filter(movie => movie !== movieObject.id);
      }
    }

      // pushes movie to new director's movie list
      for (directorID of movies[movieObject.id].director){
        if (people[directorID] && !people[directorID].movies.includes(movieObject.id)){
          people[directorID].movies.push(movieObject.id);
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

    // get new list of actors, director, and writers
    let movieCastMembers = new Set(movies[movieObject.id].actors.concat(movies[movieObject.id].director, movies[movieObject.id].writers));
    movieCastMembers = [...movieCastMembers];

    // increase frequent collaborators by 1
    for (let i = 0; i < movieCastMembers.length - 1; i++){
      for (let j = i + 1; j < movieCastMembers.length; j++){
        if (movieCastMembers[i] !== movieCastMembers[j]){
          if (people[movieCastMembers[i]] && people[movieCastMembers[j]] && people[movieCastMembers[i]].collaborators.hasOwnProperty(movieCastMembers[j])){
            people[movieCastMembers[i]].collaborators[movieCastMembers[j]] += 1;
            people[movieCastMembers[j]].collaborators[movieCastMembers[i]] += 1;
          }
          else if(people[movieCastMembers[i]] && people[movieCastMembers[j]] && !people[movieCastMembers[i]].collaborators.hasOwnProperty(movieCastMembers[j])){
            people[movieCastMembers[i]].collaborators[movieCastMembers[j]] = 1;
            people[movieCastMembers[j]].collaborators[movieCastMembers[i]] = 1;
          }
        }
      }
    }

    moviesCopy = sortMovieYear();
    moviesCopy = sortMovieRating();

    return true;  // if edit is successful
  }
  return false;
}

//
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

    let movieCastMembers = new Set(movies[movieID].actors.concat(movies[movieID].director, movies[movieID].writers));
    movieCastMembers = [...movieCastMembers];

    //during movie deletion
    for (let i = 0; i < movieCastMembers.length - 1; i++){
      for (let j = i + 1; j < movieCastMembers.length; j++){
        if (movieCastMembers[i] !== movieCastMembers[j]){
          if (people[movieCastMembers[i]] && people[movieCastMembers[j]] && people[movieCastMembers[i]].collaborators.hasOwnProperty(movieCastMembers[j])){
            people[movieCastMembers[i]].collaborators[movieCastMembers[j]] -= 1;
            if (people[movieCastMembers[i]].collaborators[movieCastMembers[j]] < 0){
              people[movieCastMembers[i]].collaborators[movieCastMembers[j]] = 0;
            }
            people[movieCastMembers[j]].collaborators[movieCastMembers[i]] -= 1;
            if (people[movieCastMembers[j]].collaborators[movieCastMembers[i]] < 0){
              people[movieCastMembers[j]].collaborators[movieCastMembers[i]] = 0;
            }
          }
          else if(people[movieCastMembers[i]] && people[movieCastMembers[j]] && !people[movieCastMembers[i]].collaborators.hasOwnProperty(movieCastMembers[j])){
            people[movieCastMembers[i]].collaborators[movieCastMembers[j]] = 0;
            people[movieCastMembers[j]].collaborators[movieCastMembers[i]] = 0;
          }
        }
      }
    }


    // tested - works
    // need similar changes to addMovie, editMovie - what if there are changes in cast?
    let actorsList = movies[movieID].actors;
    for(let i=0; i<actorsList.length; i++) {
      let actor = people[actorsList[i]];
      if(actor && actor !== "N/A") {
        actor.movies = actor.movies.filter(movie => movie !== movieID.toString()); // removes movie from actors
      }
    }
    let directorList = movies[movieID].director;
    for (let i = 0; i < directorList.length; i++){
      director = people[directorList[i]];
      if(director && director !== "N/A") {
        director.movies = director.movies.filter(movie => movie !== movieID.toString()); // removes movie from director
      }
    }

    let writersList = movies[movieID].writers;
    for(let i=0; i<writersList.length; i++) {
      writer = people[writersList[i]];
      if(writer && writer !== "N/A") {
        writer.movies = writer.movies.filter(movie => movie !== movieID.toString()); // removes movie from writer
      }
    }

    let reviewList = movies[movieID].reviews;
    if (reviewList && reviewList.length > 0){
      for (reviewID of reviewList){ // removes reviews associated with movie and removes reviews from users
        if(reviews[reviewID]) {
          users[reviews[reviewID].userID].reviews = users[reviews[reviewID].userID].reviews.filter(review => review !== reviewID);
        }
        delete reviews[reviewID]; // remove the key reviewID from reviews list
      }
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
function similarMovies(movieID) {
  // implementation pending for cast
  // currently works if more than 2 genres match
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
    // console.log("movieid");
    // console.log(movieid);
  }
  return similar;
}

// tested
// get movie rating - original number of ratings from imdbVotes, average rating from imdbRating
function updateMovieRating(movieID, rating) {
  if (!movies.hasOwnProperty(movieID)){
    return false;
  }
  rating = Number(rating);
  let movie = movies[movieID];
  let currentRatingSum = Number(movie.averageRating) * Number(movie.noOfRatings);
  currentRatingSum += rating;
  movie.noOfRatings += 1;
  movie.averageRating = (currentRatingSum/movie.noOfRatings).toFixed(1); // keeps 1 digit after decimal point
  return true;
}

// tested
// sort movies according to releaseYear (descending order)
function sortMovieYear(){
  let sortedMovies = moviesCopy.sort(function(a, b){
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
function upcoming(){
  return sortMovieYear().slice(0, 8);
}

// get the top 8 movies with highest averageRating
function fanPicks(){
  return sortMovieRating().slice(0, 8);
}

// get the movies you have reviewed
function yourList(requesting){
  if (!users.hasOwnProperty(requesting)){
    return [];
  }
  let moviesList = [];
  let reviewList = users[requesting].reviews;
  if (reviewList.length > 0){
    for (reviewID of reviewList){
      if(reviews[reviewID] && !moviesList.includes(movies[reviews[reviewID].movieID])) {
        moviesList.push(movies[reviews[reviewID].movieID]);
      }
    }
  }
  return moviesList;
}
// -------------------------------------------------REVIEWS-------------------------------------------------

// tested
// get a particular review
function getReview(reviewID){
  if(!reviews.hasOwnProperty(reviewID)){
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
  reviewObject.userID = requestingUser;
  reviews[reviewObject.id] = reviewObject;

  console.log(movies[reviewObject.movieID]);
  movies[reviewObject.movieID].reviews.push(reviewObject.id);
  updateMovieRating(reviewObject.movieID, reviewObject.rating); // movie rating is updated
  users[requestingUser].reviews.push(reviewObject.id);
  nextReviewID++;
  return true; // review added successfully
}

// tested
// add a basic review by only specifying a score out of 10
function addBasicReview(movieID, rating){
  if (!movies.hasOwnProperty(movieID)){
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
  console.log(requestedPerson);
  if(!requestingUser.followingPeople.includes(requested) && !requestedPerson.followers.includes(requestingID)) {
    requestingUser.followingPeople.push(requested);
    requestedPerson.followers.push(requesting);
    return true;
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
  return true;
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
    // search if same person exists
    for(personID in people) {
      let person = people[personID];
      if(person.name.toLowerCase() === personObject.name.toLowerCase()) {
        return false;
      }
    }
    personObject["id"] = (nextPersonID).toString();
    if (personObject.movies !== ""){
      let personObjectMovies = personObject.movies.trim().split(",");
      let personMovies = [];
      for (movie of personObjectMovies){
        let movieName = "";
        for (let i = 0; i < movie.trim().split(" ").length - 1; i++){
          movieName += movie.trim().split(" ")[i] + " ";
        }
        let movieRole = "";
        let movieRoleString = movie.trim().split(" ")[movie.trim().split(" ").length - 1];
        movieRole = movieRoleString.substring(movieRoleString.indexOf('(') +1, movieRoleString.indexOf(')'));

        movieRole = movieRole.trim().toLowerCase();
        if(movieRole !== "actor" && movieRole !== "director" && movieRole !== "writer") {
          continue;
        }
        for (movieID in movies){
          if (movieName.trim().toLowerCase() === movies[movieID].title.toLowerCase()){
            personMovies.push(movies[movieID].id);
            if (movieRole === "actor"){
              if (movies[movieID].actors.includes("N/A")){
                movies[movieID].actors = [];
              }
              if (!movies[movieID].actors.includes(personObject.id)){
                movies[movieID].actors.push(personObject.id);
              }
            }
            else if (movieRole === "director"){
              if (movies[movieID].director.includes("N/A")){
                movies[movieID].director = [];
              }
              if (!movies[movieID].director.includes(personObject.id)){
                movies[movieID].director.push(personObject.id);
              }
            }
            else if (movieRole === "writer"){
              if (movies[movieID].writers.includes("N/A")){
                movies[movieID].writers = [];
              }
              if (!movies[movieID].writers.includes(personObject.id)){
                movies[movieID].writers.push(personObject.id);
              }
            }
            break;
          }
        }
      }
      if (personMovies.length === 0){
        personObject.movies = ["N/A"];
      }
      else{
        let finalMovieList = [...new Set(personMovies)];
        personObject.movies = finalMovieList;
      }
    }
    else{
      personObject.movies = ["N/A"];
    }

    // adding object to movies object
    personObject.followers = [];
    personObject.collaborators = {};
    people[personObject.id] = personObject;

    // add person
    let personObjectMovies = people[personObject.id].movies;
    console.log("person movies:");
    console.log(people[personObject.id].movies);
    let movieCastMembers = [];
    let repeatedMember = [];
    for (let i = 0; i < personObjectMovies.length; i++){
      repeatedMember = [];
      if(movies[personObjectMovies[i]]) {
        movieCastMembers = movies[personObjectMovies[i]].actors.concat(movies[personObjectMovies[i]].director, movies[personObjectMovies[i]].writers);
        for (let j = 0; j < movieCastMembers.length; j++){
          if (people[movieCastMembers[j]] && !repeatedMember.includes(people[movieCastMembers[j]].id) && !(movieCastMembers[j] == personObject.id)){
            people[movieCastMembers[j]].collaborators[personObject.id] = 1;
            people[personObject.id].collaborators[people[movieCastMembers[j]].id] = 1;
            repeatedMember.push(people[movieCastMembers[j]].id);
          }
        }
      }
    }

    nextPersonID++;
    return personObject.id;  // if addition is successful
  }
  return false;
}

function editPerson(requesting, personObject) {
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  // check if user contributing
    // search if person with same name exists
    let person = people[personObject.id];
    let oldMovies = person.movies;

    // edit person
    let personObjectOldMovies = oldMovies; // before making any edits to the person
    let movieOldCastMembers = [];
    let repeatedMember = [];
    for (let i = 0; i < personObjectOldMovies.length; i++){
      repeatedMember = [];
      movieOldCastMembers = movies[personObjectOldMovies[i]].actors.concat(movies[personObjectOldMovies[i]].director, movies[personObjectOldMovies[i]].writers);
      for (let j = 0; j < movieOldCastMembers.length; j++){
        if (people[movieOldCastMembers[j]] && !repeatedMember.includes(people[movieOldCastMembers[j]].id)  && people[movieOldCastMembers[j]].collaborators.hasOwnProperty(personObject.id) && !(movieOldCastMembers[j] == personObject.id)){
          people[movieOldCastMembers[j]].collaborators[personObject.id] -= 1;
          if (people[movieOldCastMembers[j]].collaborators[personObject.id] < 0){
            people[movieOldCastMembers[j]].collaborators[personObject.id] = 0;
          }
          people[personObject.id].collaborators[people[movieOldCastMembers[j]].id] -= 1;
          if (people[personObject.id].collaborators[people[movieOldCastMembers[j]].id] < 0){
            people[personObject.id].collaborators[people[movieOldCastMembers[j]].id] = 0;
          }
          repeatedMember.push(people[movieOldCastMembers[j]].id);
        }
      }
    }

    if (personObject.movies !== ""){
      let personObjectMovies = personObject.movies.trim().split(",");
      let personMovies = [];
      for (movie of personObjectMovies){
        let movieName = "";
        for (let i = 0; i < movie.trim().split(" ").length - 1; i++){
          movieName += movie.trim().split(" ")[i] + " ";
        }
        let movieRole = "";
        let movieRoleString = movie.trim().split(" ")[movie.trim().split(" ").length - 1];
        movieRole = movieRoleString.substring(movieRoleString.indexOf('(') +1, movieRoleString.indexOf(')'));

        movieRole = movieRole.trim().toLowerCase();
        if(movieRole !== "actor" && movieRole !== "director" && movieRole !== "writer") {
          continue;
        }
        for (movieID in movies){
          if (movieName.trim().toLowerCase() === movies[movieID].title.toLowerCase()){
            if (!personMovies.includes(movies[movieID].id)){
              movies[movieID].actors = movies[movieID].actors.filter(personID => personID !== personObject.id);
              movies[movieID].director = movies[movieID].director.filter(personID => personID !== personObject.id);
              movies[movieID].writers = movies[movieID].writers.filter(personID => personID !== personObject.id);
            }
            personMovies.push(movies[movieID].id);
            if (movieRole === "actor"){

              if (movies[movieID].actors.includes("N/A") || movies[movieID].actors.length == 0){
                movies[movieID].actors = [];
              }
              if (!movies[movieID].actors.includes(personObject.id)){
                movies[movieID].actors.push(personObject.id);
              }
            }
            else if (movieRole === "director"){

              if (movies[movieID].director.includes("N/A") || movies[movieID].director.length == 0){
                movies[movieID].director = [];
              }
              if (!movies[movieID].director.includes(personObject.id)){
                movies[movieID].director.push(personObject.id);
              }
            }
            else if (movieRole === "writer"){

              if (movies[movieID].writers.includes("N/A") || movies[movieID].writers.length == 0){
                movies[movieID].writers = [];
              }
              if (!movies[movieID].writers.includes(personObject.id)){
                movies[movieID].writers.push(personObject.id);
              }
            }
            break;
          }
        }
      }
      if (personMovies.length === 0){
        personObject.movies = ["N/A"];
      }
      else{
        let finalMovieList = [...new Set(personMovies)];
        personObject.movies = finalMovieList;
      }
    }
    else{
      personObject.movies = ["N/A"];
    }
    personObject.followers = people[personObject.id].followers;
    personObject.collaborators = people[personObject.id].collaborators;
    people[personObject.id] = personObject;
    let uniqueMovies = oldMovies.filter(function(movieID) { return people[personObject.id].movies.indexOf(movieID) == -1; });
    for (movieID of uniqueMovies){
      movies[movieID].actors = movies[movieID].actors.filter(personID => personID !== personObject.id);
      movies[movieID].director = movies[movieID].director.filter(personID => personID !== personObject.id);
      movies[movieID].writers = movies[movieID].writers.filter(personID => personID !== personObject.id);
    }

    let personObjectMovies = personObject.movies; // new movies, after adding person back in
    let movieCastMembers = [];
    repeatedMember = [];
    for (let i = 0; i < personObjectMovies.length; i++){
      repeatedMember = [];
      movieCastMembers = movies[personObjectMovies[i]].actors.concat(movies[personObjectMovies[i]].director, movies[personObjectMovies[i]].writers);
      for (let j = 0; j < movieCastMembers.length; j++){
        if (people[movieCastMembers[j]] && !repeatedMember.includes(people[movieCastMembers[j]].id) && people[movieCastMembers[j]].collaborators.hasOwnProperty(personObject.id) && !(movieCastMembers[j] == personObject.id)){
          people[movieCastMembers[j]].collaborators[personObject.id] += 1;
          people[personObject.id].collaborators[people[movieCastMembers[j]].id] += 1;
        }
        else if (people[movieCastMembers[j]] && !repeatedMember.includes(people[movieCastMembers[j]].id) && !people[movieCastMembers[j]].collaborators.hasOwnProperty(personObject.id) && !(movieCastMembers[j] == personObject.id)){
          people[movieCastMembers[j]].collaborators[personObject.id] = 1;
          people[personObject.id].collaborators[people[movieCastMembers[j]].id] = 1;
        }
        repeatedMember.push(people[movieCastMembers[i]].id);
      }
    }
    // followers, collaborators, and movies are determined by the system
    return true;  // if edit is successful
}

// tested
// remove person - if exists
function removePerson(requesting, requested) {
  // check if requesting (userID) exists
  if (!users.hasOwnProperty(requesting)){
    return false
  }
  // check if user contributing
  if(people.hasOwnProperty(requested)) {
    let requestedPerson = people[requested];
    // remove from corresponding collaborators, followers, movies

    // removing from collaborator's collaborator list
    let personObjectMovies = requestedPerson.movies;
    let movieCastMembers = [];
    let repeatedMember = [];
    for (let i = 0; i < personObjectMovies.length; i++){
      repeatedMember = [];
      movieCastMembers = movies[personObjectMovies[i]].actors.concat(movies[personObjectMovies[i]].director, movies[personObjectMovies[i]].writers);
      console.log("movie cast members: ");
      console.log(movieCastMembers);
      for (let j = 0; j < movieCastMembers.length; j++){
        if (people[movieCastMembers[j]] && !repeatedMember.includes(people[movieCastMembers[j]].id)  &&
             people[movieCastMembers[j]].collaborators.hasOwnProperty(requestedPerson.id) && !(movieCastMembers[j] == requestedPerson.id)){
          console.log("deleting: ");
          console.log(people[movieCastMembers[j]].collaborators[requestedPerson.id]);
          delete people[movieCastMembers[j]].collaborators[requestedPerson.id];
          repeatedMember.push(people[movieCastMembers[j]].id);
        }
      }
    }

    // removing from followers' followingPeople list
    let followerIDList = requestedPerson.followers;
    console.log(followerIDList);
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
          movie.actors = ["N/A"];
        }

        // director
        movie.director = movie.director.filter(personID => personID !== requestedPerson.id);
        if(movie.director.length === 0) { // if movie director id string is the same as requested person's id (valueOf)
          movie.director = ["N/A"];
        }

        // writers
        movie.writers = movie.writers.filter(personID => personID !== requestedPerson.id);  // person id saved as string in movies.json
        if(movie.writers.length === 0) {
          movie.writers = ["N/A"];
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
function getPerson(personID) { // gets the person object when supplied with personID
  if (people.hasOwnProperty(personID)){
    return people[personID];
  }
  return null;
}

// search for a person - returns a list
function searchPerson(keyWord) {
  let results = [];
  console.log(keyWord);
  for (personID in people){
    let person = people[personID];
    if (keyWord && person.name.toLowerCase().indexOf(keyWord.toLowerCase()) >= 0){
      results.push(person);
    }
    else if(keyWord == undefined || keyWord == "") {
      results.push(person);
    }
  }
  return results;
}

// get frequent collaborator - returns list of person objects
function getFrequentCollaborator(personID) {
  let collaborators = [];
  if (people.hasOwnProperty(personID)){
    let collabIDObj = people[personID].collaborators;
    let collabIDList = Object.keys(people[personID].collaborators).sort(function(a,b){return people[personID].collaborators[b]-people[personID].collaborators[a]});
    //console.log(collabIDList);
    for(collaborator of collabIDList){//(let i=0; i<collabIDList.length; i++) {
      //let collabID = collabIDList[i];
      if(collabIDObj[collaborator] != 0) {
        collaborators.push(people[collaborator]);
      }
      /* if(people[collabID]) {
        collaborators.push(people[collabID]);
      } */
    }
  }
  if (collaborators.length >= 5)
    return collaborators.slice(0, 5);
  else
    return collaborators;
}

//let userA = registerUser({username: "user4", password: "password"});
//let userB = registerUser({username: "user5", password: "password"});
//console.log(similarMovies("user2", "5"))
//console.log(fanPicks("user0"));
//console.log(users);
//console.log(searchUsers("user0", "user"));
//console.log(getUser("user0", "user1"));
//followUser("user0", "user4");
//console.log(users);
//unfollowUser("user0", "user4");
//console.log(users);

module.exports = {
  users,
  movies,
  moviesCopy,
  reviews,
  people,
  paginate,
  registerUser,
  login,
  viewReviewsOtherUser,
  viewPeopleOtherUser,
  viewFollowersOtherUser,
  viewFollowingOtherUser,
  getUser,
  getUserByID,
  editUser,
  viewRecommendedMovies,
  toggleContributing,
  searchIMDB,
  searchUsers,
  followUser,
  unfollowUser,
  getMovie,
  addMovie,
  searchMovie,
  editMovie,
  removeMovie,
  similarMovies,
  upcoming,
  fanPicks,
  yourList,
  followPerson,
  unfollowPerson,
  getPerson,
  searchPerson,
  addPerson,
  removePerson,
  editPerson,
  getFrequentCollaborator,
  getReview,
  getReviewMovie,
  addBasicReview,
  addFullReview
}
/*// ------------------------------------------ testing ---------------------------------------------------
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
// remove movie should remove all the reviews associated with it - seems to be done
// removing reviews should remove it in all the places where it is stored (users)
// similarly addMovie and editMovie should update all of its cast members
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
*/
