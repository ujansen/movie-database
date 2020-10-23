
const http = require('http');
const pug = require("pug");
const fs = require("fs");

const renderMovie = pug.compileFile("./views/pages/movie.pug");

let movie = {
	"Title":"The Lord of the Rings: The Fellowship of the Ring",
	"Year":"2001",
	"Rated":"PG-13",
	"Released":"19 Dec 2001",
	"Runtime":"178 min",
	"Genre":"Action, Adventure, Drama, Fantasy",
	"Director":"Peter Jackson",
	"Writer":"J.R.R. Tolkien (novel), Fran Walsh (screenplay), Philippa Boyens (screenplay), Peter Jackson (screenplay)",
	"Actors":"Alan Howard, Noel Appleby, Sean Astin, Sala Baker",
	"Plot":"A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
	"Language":"English, Sindarin",
	"Country":"New Zealand, USA",
	"Awards":"Won 4 Oscars. Another 114 wins & 124 nominations.",
	"Poster":"https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
	"Ratings":[{"Source":"Internet Movie Database","Value":"8.8/10"},{"Source":"Rotten Tomatoes","Value":"91%"},{"Source":"Metacritic","Value":"92/100"}],
	"Metascore":"92",
	"imdbRating":"8.8",
	"imdbVotes":"1,619,534",
	"imdbID":"tt0120737",
	"Type":"movie",
	"DVD":"06 Aug 2002",
	"BoxOffice":"$314,000,000",
	"Production":"New Line Cinema",
	"Website":"N/A",
	"Response":"True"}
;

let similarMovies = [{
	"Title": "The Lord of the Rings: The Two Towers",
    "Year": "2002",
    "Rated": "PG-13",
    "Released": "18 Dec 2002",
    "Runtime": "179 min",
    "Genre": "Action, Adventure, Drama, Fantasy",
    "Director": "Peter Jackson",
    "Writer": "J.R.R. Tolkien (novel), Fran Walsh (screenplay), Philippa Boyens (screenplay), Stephen Sinclair (screenplay), Peter Jackson (screenplay)",
    "Actors": "Bruce Allpress, Sean Astin, John Bach, Sala Baker",
    "Plot": "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
    "Language": "English, Sindarin, Old English",
    "Country": "New Zealand, USA",
    "Awards": "Won 2 Oscars. Another 123 wins & 137 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNGE5MzIyNTAtNWFlMC00NDA2LWJiMjItMjc4Yjg1OWM5NzhhXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "8.7/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "95%"
      },
      {
        "Source": "Metacritic",
        "Value": "87/100"
      }
    ],
    "Metascore": "87",
    "imdbRating": "8.7",
    "imdbVotes": "1,444,328",
    "imdbID": "tt0167261",
    "Type": "movie",
    "DVD": "26 Aug 2003",
    "BoxOffice": "$339,700,000",
    "Production": "New Line Cinema",
    "Website": "N/A",
    "Response": "True"
},
{"Title": "The Lord of the Rings: The Return of the King",
    "Year": "2003",
    "Rated": "PG-13",
    "Released": "17 Dec 2003",
    "Runtime": "201 min",
    "Genre": "Action, Adventure, Drama, Fantasy",
    "Director": "Peter Jackson",
    "Writer": "J.R.R. Tolkien (novel), Fran Walsh (screenplay), Philippa Boyens (screenplay), Peter Jackson (screenplay)",
    "Actors": "Noel Appleby, Ali Astin, Sean Astin, David Aston",
    "Plot": "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    "Language": "English, Quenya, Old English, Sindarin",
    "Country": "New Zealand, USA",
    "Awards": "Won 11 Oscars. Another 198 wins & 123 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "8.9/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "93%"
      },
      {
        "Source": "Metacritic",
        "Value": "94/100"
      }
    ],
    "Metascore": "94",
    "imdbRating": "8.9",
    "imdbVotes": "1,603,897",
    "imdbID": "tt0167260",
    "Type": "movie",
    "DVD": "25 May 2004",
    "BoxOffice": "$364,000,000",
    "Production": "New Line Cinema",
    "Website": "N/A",
    "Response": "True"},
	{
		"Title": "The Hobbit: An Unexpected Journey",
    "Year": "2012",
    "Rated": "PG-13",
    "Released": "14 Dec 2012",
    "Runtime": "169 min",
    "Genre": "Adventure, Family, Fantasy",
    "Director": "Peter Jackson",
    "Writer": "Fran Walsh (screenplay), Philippa Boyens (screenplay), Peter Jackson (screenplay), Guillermo del Toro (screenplay), J.R.R. Tolkien (novel)",
    "Actors": "Ian McKellen, Martin Freeman, Richard Armitage, Ken Stott",
    "Plot": "A reluctant Hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and the gold within it from the dragon Smaug.",
    "Language": "English",
    "Country": "New Zealand, USA",
    "Awards": "Nominated for 3 Oscars. Another 10 wins & 72 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTcwNTE4MTUxMl5BMl5BanBnXkFtZTcwMDIyODM4OA@@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "7.8/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "64%"
      },
      {
        "Source": "Metacritic",
        "Value": "58/100"
      }
    ],
    "Metascore": "58",
    "imdbRating": "7.8",
    "imdbVotes": "744,737",
    "imdbID": "tt0903624",
    "Type": "movie",
    "DVD": "19 Mar 2013",
    "BoxOffice": "$303,001,229",
    "Production": "Warner Bros.",
    "Website": "N/A",
    "Response": "True"
	}];

function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

function send500(response){
	response.statusCode = 500;
	response.write("Server error.");
	response.end();
}

const server = http.createServer(function (request, response) {
	if(request.method === "GET"){
		if(request.url === "/" || request.url === "/movie.html"){
			let content = renderMovie({movie: movie, similarMovies: similarMovies});
			response.statusCode = 200;
			response.setHeader("Content-Type", "text/html");
			response.end(content);
		}else if(request.url === "/about"){
			let content = renderAbout({});
			response.statusCode = 200;
			response.setHeader("Content-Type", "text/html");
			response.end(content);
		}else if(request.url === "/css/style.css"){
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
				response.setHeader("Content-Type", "application/json");
				response.end(data);
			});
		}
	}else{
		send404(response);
	}
});

//Server listens on port 3000
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
