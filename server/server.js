const http = require('http');
const fs = require("fs");

//Create a server, giving it the handler function
//Request represents the incoming request object
//Response represents the outgoing response object
//Remember, you can break this apart to make it look cleaner
const server = http.createServer(function (request, response) {

	console.log("URL: " + request.url);
	if(request.method === "GET"){
		if(request.url === "/index.html" || request.url === "/"){
			fs.readFile("index.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if(request.url === "/login.html"){
			//respond with JSON of list object
			fs.readFile("./login.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if(request.url === "/register.html"){
			//respond with JSON of list object
			fs.readFile("./register.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if(request.url === "/movie.html"){
			//respond with JSON of list object
			fs.readFile("./movie.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if(request.url === "/user.html"){
			//respond with JSON of list object
			fs.readFile("./user.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if(request.url === "/other-user.html"){
			//respond with JSON of list object
			fs.readFile("./other-user.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if (request.url === "/person.html"){
			fs.readFile("./person.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if (request.url === "/tos.html"){
			fs.readFile("./tos.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.end(data);
			});
		}else if(request.url === "/css/style.css"){
			//respond with JSON of list object
			fs.readFile("./css/style.css", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/css");
				response.end(data);
			});
		}else if(request.url === "/js/navBar.js"){
			fs.readFile("./js/navBar.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.end(data);
			});
		}else if(request.url === "/js/scriptLogin.js"){
			fs.readFile("./js/scriptLogin.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.end(data);
			});
		}else if(request.url === "/js/scriptRegister.js"){
			fs.readFile("./js/scriptRegister.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file.");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.end(data);
			});
		}else if(request.url === "/js/movie-list.js"){
			fs.readFile("./js/movie-list.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.end("Error reading file");
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.end(data);
			});
		}else{
			response.statusCode = 404;
			response.end("Unknown resource.");
		}
	}
	else{
		response.statusCode = 404;
		response.end("Unknown resource.");
	}
});

//Server listens on port 3000
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
