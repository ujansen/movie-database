try {
  let logout = document.getElementById("logout");
  logout.onclick = logoutRedirect;

  function logoutRedirect() {
    let req = new XMLHttpRequest();
    req.open("GET", "/logout");
    req.onreadystatechange = function() {
      if(req.readyState === 4 && req.status === 200) {
        console.log(req.responseText);
        window.location.href = req.responseText;
      }
    }
    req.send();
  }
}
catch (err) {
  // do nothing
}
