let users = require("./users.json");
//console.log(users);

let nextUserID = -1;
for(uid in users){
  if(Number(users[uid].id) >= nextUserID){
    nextUserID = Number(users[uid].id) + 1  ;
  }
}

function isValidUser(userObj){
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

function canAccessUser(requesting, requested){
  if (users.hasOwnProperty(requested)){
    let requestingUser = users[requesting];
    if (requestingUser.username === requested || requestingUser.followingUsers.includes(requested)){
      return true;
    }
  }
  return false;
}

function removeUser(requestingUser, requestedUser){
  requestingUser.followingUsers = requestingUser.followingUsers.filter(user => user !== requestedUser.username);
  requestedUser.followers = requestedUser.followers.filter(user => user !== requestingUser.username);
}

function showReviews(requestedUser){
  let reviewList = [];
  for (reviewID in users[requestedUser].reviews){
    reviewList.push(reviews[reviewID]);
  }
  return reviewList;
}

function showPeople(requestedUser){
  let peopleList = [];
  for (peopleID in users[requestedUser].followingPeople){
    peopleList.push(people[peopleID]);
  }
  return peopleList;
}

function showFollowers(requestedUser){
  let followerList = [];
  for (userID in users[requestedUser].followers){
    followerList.push(users[userID]);
  }
  return followerList;
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

function showFollowing(requestedUser){
  let followingList = [];
  for (userID in users[requestedUser].followingUsers){
    followingList.push(users[userID]);
  }
  return followingList;
}

function getUser(requesting, requested){
  if (!users.hasOwnProperty(requested)){
    return users[requested];
  }
  return null;
}

function searchUsers(requesting, keyWord){
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

function followUser(requesting, requested){
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

function unfollowUser(requesting, requested){
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

function viewRecommendedMovies(requesting){
  if (!users.hasOwnProperty(requesting)){
    return null;
  }
  return users[requesting].recommendedMovies;
}

function viewReviewsOtherUser(requesting, requested){
  if (!users.hasOwnProperty(requested)){
    return null;
  }

  if (requesting === requested){
    return showReviews(requesting);
  }
    return showReviews(requested);
}

function viewPeopleOtherUser(requesting, requested){
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

function viewFollowersOtherUser(requesting, requested){
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

//}

function viewFollowingOtherUser(requesting, requested){
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

//}


let userA = registerUser({username: "user4", password: "password"});
let userB = registerUser({username: "user5", password: "password"});
//console.log(users);
//console.log(searchUsers("user0", "user"));
//console.log(getUser("user0", "user1"));
followUser("user0", "user4");
console.log(users);
unfollowUser("user0", "user4");
console.log(users);
