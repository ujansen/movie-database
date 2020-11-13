let basicRating = document.getElementById("basicRating");
let submitBasic = document.getElementById("basicReview")
submitBasic.addEventListener("click", submitBasicRequest);
submitBasic.disabled = true;

basicRating.addEventListener("keyup", enableBasicButton);

let fullRating = document.getElementById("fullRating");
let fullTitle = document.getElementById("movieReviewTitle");
let fullContent = document.getElementById("movieReview");
let submitFull = document.getElementById("submitReview");
submitFull.addEventListener("click", submitFullRequest);
submitFull.disabled = true;

fullRating.addEventListener("keyup", enableFullButton);
fullTitle.addEventListener("keyup", enableFullButton);
fullContent.addEventListener("keyup", enableFullButton);

let urlArray = window.location.href.split("/");
let movieID = urlArray[urlArray.length -1];

function enableBasicButton() {
  if (basicRating.value.toString()) {
      submitBasic.disabled = false;
  }
}

function enableFullButton() {
  if (fullRating.value.toString() && fullTitle.value.toString() && fullContent.value.toString()) {
      submitFull.disabled = false;
  }
}

function submitBasicRequest() {
  ///movies/:mid/basicReview/:rating
  let req = new XMLHttpRequest();
  req.open("POST", "/movies/" + movieID + "/basicReview/" + basicRating.value.toString());

  req.onreadystatechange = function () {
    if(req.readyState === 4 && req.status === 200) {
      window.location.href = req.responseText;
    }
  };
  req.send();
}

function submitFullRequest() {
  ///movies/:mid/fullReview
  let reviewObject = {
    "movieID": movieID.toString(),
    "title": fullTitle.value.toString(),
    "content": fullContent.value.toString(),
    "rating": fullRating.value.toString()
  }
  let req = new XMLHttpRequest();
  req.open("POST", "/movies/" + movieID + "/fullReview");

  req.onreadystatechange = function () {
    if(req.readyState === 4 && req.status === 200) {
      window.location.href = req.responseText;
    }
  };
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.send(JSON.stringify(reviewObject));
}
