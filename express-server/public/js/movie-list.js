/* let upcoming;
let your_list;
let fan_picks;
let moviesOnHomePage = []
function fillUpcoming(){
  let i = 0
  while (i < 8) {
      let rand_url = generateRandom();
      if (!moviesOnHomePage.includes(rand_url)){
        moviesOnHomePage.push(rand_url);
        //console.log(rand_url);
        let div = document.createElement('div');
        div.setAttribute('class', 'col-xs-4 cp-1 bg-secondary');
        div.innerHTML = `<div class="card card-block">
                            <a href= ${rand_url} target="_blank">
                                <img src=${rand_url} class = "slider-img">
                            </a>
                        </div>`;
        document.getElementById("upcoming").appendChild(div);
        i++;
      }
    }
}

function fillYourList(){
  let i = 0
  while (i < 8) {
      let rand_url = generateRandom();
      if (!moviesOnHomePage.includes(rand_url)){
        moviesOnHomePage.push(rand_url);
        //console.log(rand_url);
        let div = document.createElement('div');
        div.setAttribute('class', 'col-xs-4 cp-1 bg-secondary');
        div.innerHTML = `<div class="card card-block">
                            <a href= ${rand_url} target="_blank">
                                <img src=${rand_url} class = "slider-img">
                            </a>
                        </div>`;
        document.getElementById("your_list").appendChild(div);
        i++;
      }
    }
}

function fillFanPicks(){
  let i = 0
  while (i < 8) {
      let rand_url = generateRandom();
      if (!moviesOnHomePage.includes(rand_url)){
        moviesOnHomePage.push(rand_url);
        //console.log(rand_url);
        let div = document.createElement('div');
        div.setAttribute('class', 'col-xs-4 cp-1 bg-secondary');
        div.innerHTML = `<div class="card card-block">
                            <a href= ${rand_url} target="_blank">
                                <img src=${rand_url} class = "slider-img">
                            </a>
                        </div>`;
        document.getElementById("fan_picks").appendChild(div);
        i++;
      }
    }
}


function init() {
    fillUpcoming();
    fillYourList();
    fillFanPicks();
}



function generateRandom() {
    let x = Math.floor((Math.random() * Object.keys(movies).length));
    //console.log(Object.keys(movies));
    let url = movies[x]["Poster"];
    //console.log(url);
    return url;
}

// gets hoisted
let movies = [{
    "Title": "Toy Story",
    "Year": "1995",
    "Rated": "G",
    "Released": "22 Nov 1995",
    "Runtime": "81 min",
    "Genre": "Animation, Adventure, Comedy, Family, Fantasy",
    "Director": "John Lasseter",
    "Writer": "John Lasseter (original story by), Pete Docter (original story by), Andrew Stanton (original story by), Joe Ranft (original story by), Joss Whedon (screenplay by), Andrew Stanton (screenplay by), Joel Cohen (screenplay by), Alec Sokolow (screenplay by)",
    "Actors": "Tom Hanks, Tim Allen, Don Rickles, Jim Varney",
    "Plot": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    "Language": "English",
    "Country": "USA",
    "Awards": "Nominated for 3 Oscars. Another 27 wins & 20 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "8.3/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "100%"
    }, {
        "Source": "Metacritic",
        "Value": "95/100"
    }],
    "Metascore": "95",
    "imdbRating": "8.3",
    "imdbVotes": "864,385",
    "imdbID": "tt0114709",
    "Type": "movie",
    "DVD": "20 Mar 2001",
    "BoxOffice": "N/A",
    "Production": "Buena Vista",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Jumanji",
    "Year": "1995",
    "Rated": "PG",
    "Released": "15 Dec 1995",
    "Runtime": "104 min",
    "Genre": "Adventure, Comedy, Family, Fantasy",
    "Director": "Joe Johnston",
    "Writer": "Jonathan Hensleigh (screenplay by), Greg Taylor (screenplay by), Jim Strain (screenplay by), Greg Taylor (screen story by), Jim Strain (screen story by), Chris Van Allsburg (screen story by), Chris Van Allsburg (based on the book by)",
    "Actors": "Robin Williams, Jonathan Hyde, Kirsten Dunst, Bradley Pierce",
    "Plot": "When two kids find and play a magical board game, they release a man trapped in it for decades - and a host of dangers that can only be stopped by finishing the game.",
    "Language": "English, French",
    "Country": "USA",
    "Awards": "4 wins & 11 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BZTk2ZmUwYmEtNTcwZS00YmMyLWFkYjMtNTRmZDA3YWExMjc2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "7.0/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "54%"
    }, {
        "Source": "Metacritic",
        "Value": "39/100"
    }],
    "Metascore": "39",
    "imdbRating": "7.0",
    "imdbVotes": "297,463",
    "imdbID": "tt0113497",
    "Type": "movie",
    "DVD": "25 Jan 2000",
    "BoxOffice": "N/A",
    "Production": "Sony Pictures Home Entertainment",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Grumpier Old Men",
    "Year": "1995",
    "Rated": "PG-13",
    "Released": "22 Dec 1995",
    "Runtime": "101 min",
    "Genre": "Comedy, Romance",
    "Director": "Howard Deutch",
    "Writer": "Mark Steven Johnson (characters), Mark Steven Johnson",
    "Actors": "Walter Matthau, Jack Lemmon, Sophia Loren, Ann-Margret",
    "Plot": "John and Max resolve to save their beloved bait shop from turning into an Italian restaurant, just as its new female owner catches Max's attention.",
    "Language": "English, Italian, German",
    "Country": "USA",
    "Awards": "2 wins & 2 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMjQxM2YyNjMtZjUxYy00OGYyLTg0MmQtNGE2YzNjYmUyZTY1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "6.7/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "17%"
    }, {
        "Source": "Metacritic",
        "Value": "46/100"
    }],
    "Metascore": "46",
    "imdbRating": "6.7",
    "imdbVotes": "23,736",
    "imdbID": "tt0113228",
    "Type": "movie",
    "DVD": "18 Nov 1997",
    "BoxOffice": "N/A",
    "Production": "Warner Home Video",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Waiting to Exhale",
    "Year": "1995",
    "Rated": "R",
    "Released": "22 Dec 1995",
    "Runtime": "124 min",
    "Genre": "Comedy, Drama, Romance",
    "Director": "Forest Whitaker",
    "Writer": "Terry McMillan (novel), Terry McMillan (screenplay), Ronald Bass (screenplay)",
    "Actors": "Whitney Houston, Angela Bassett, Loretta Devine, Lela Rochon",
    "Plot": "Based on Terry McMillan's novel, this film follows four very different African-American women and their relationships with the male gender.",
    "Language": "English",
    "Country": "USA",
    "Awards": "9 wins & 10 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BYzcyMDY2YWQtYWJhYy00OGQ2LTk4NzktYWJkNDYwZWJmY2RjXkEyXkFqcGdeQXVyMTA0MjU0Ng@@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "5.9/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "56%"
    }],
    "Metascore": "N/A",
    "imdbRating": "5.9",
    "imdbVotes": "9,272",
    "imdbID": "tt0114885",
    "Type": "movie",
    "DVD": "06 Mar 2001",
    "BoxOffice": "N/A",
    "Production": "Twentieth Century Fox Home Entertainment",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Father of the Bride Part II",
    "Year": "1995",
    "Rated": "PG",
    "Released": "08 Dec 1995",
    "Runtime": "106 min",
    "Genre": "Comedy, Family, Romance",
    "Director": "Charles Shyer",
    "Writer": "Albert Hackett (screenplay \"Father's Little Dividend\"), Frances Goodrich (screenplay \"Father's Little Dividend\"), Nancy Meyers (screenplay), Charles Shyer (screenplay)",
    "Actors": "Steve Martin, Diane Keaton, Martin Short, Kimberly Williams-Paisley",
    "Plot": "George Banks must deal not only with the pregnancy of his daughter, but also with the unexpected pregnancy of his wife.",
    "Language": "English",
    "Country": "USA",
    "Awards": "Nominated for 1 Golden Globe. Another 1 win & 1 nomination.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BOTEyNzg5NjYtNDU4OS00MWYxLWJhMTItYWU4NTkyNDBmM2Y0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "6.0/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "48%"
    }, {
        "Source": "Metacritic",
        "Value": "49/100"
    }],
    "Metascore": "49",
    "imdbRating": "6.0",
    "imdbVotes": "33,337",
    "imdbID": "tt0113041",
    "Type": "movie",
    "DVD": "09 May 2000",
    "BoxOffice": "N/A",
    "Production": "Disney",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Heat",
    "Year": "1995",
    "Rated": "R",
    "Released": "15 Dec 1995",
    "Runtime": "170 min",
    "Genre": "Crime, Drama, Thriller",
    "Director": "Michael Mann",
    "Writer": "Michael Mann",
    "Actors": "Al Pacino, Robert De Niro, Val Kilmer, Jon Voight",
    "Plot": "A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.",
    "Language": "English, Spanish",
    "Country": "USA",
    "Awards": "14 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMDJjNWE5MTEtMDk2Mi00ZjczLWIwYjAtNzM2ZTdhNzcwOGZjXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "8.2/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "87%"
    }, {
        "Source": "Metacritic",
        "Value": "76/100"
    }],
    "Metascore": "76",
    "imdbRating": "8.2",
    "imdbVotes": "560,172",
    "imdbID": "tt0113277",
    "Type": "movie",
    "DVD": "27 Jul 1999",
    "BoxOffice": "N/A",
    "Production": "Warner Bros.",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Sabrina",
    "Year": "1995",
    "Rated": "PG",
    "Released": "15 Dec 1995",
    "Runtime": "127 min",
    "Genre": "Comedy, Drama, Romance",
    "Director": "Sydney Pollack",
    "Writer": "Samuel A. Taylor (play), Billy Wilder (earlier screenplay), Samuel A. Taylor (earlier screenplay), Ernest Lehman (earlier screenplay), Barbara Benedek (screenplay), David Rayfiel (screenplay)",
    "Actors": "Harrison Ford, Julia Ormond, Greg Kinnear, Nancy Marchand",
    "Plot": "An ugly duckling having undergone a remarkable change, still harbors feelings for her crush: a carefree playboy, but not before his business-focused brother has something to say about it.",
    "Language": "English, French",
    "Country": "Germany, USA",
    "Awards": "Nominated for 2 Oscars. Another 2 wins & 4 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BYjQ5ZjQ0YzQtOGY3My00MWVhLTgzNWItOTYwMTE5N2ZiMDUyXkEyXkFqcGdeQXVyNjUwMzI2NzU@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "6.3/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "65%"
    }, {
        "Source": "Metacritic",
        "Value": "56/100"
    }],
    "Metascore": "56",
    "imdbRating": "6.3",
    "imdbVotes": "35,527",
    "imdbID": "tt0114319",
    "Type": "movie",
    "DVD": "15 Jan 2002",
    "BoxOffice": "N/A",
    "Production": "Paramount",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Tom and Huck",
    "Year": "1995",
    "Rated": "PG",
    "Released": "22 Dec 1995",
    "Runtime": "97 min",
    "Genre": "Adventure, Comedy, Drama, Family, Romance, Western",
    "Director": "Peter Hewitt",
    "Writer": "Mark Twain (novel), Stephen Sommers (screenplay), David Loughery (screenplay)",
    "Actors": "Jonathan Taylor Thomas, Brad Renfro, Eric Schweig, Charles Rocket",
    "Plot": "Two best friends witness a murder and embark on a series of adventures in order to prove the innocence of the man wrongly accused of the crime.",
    "Language": "English",
    "Country": "USA",
    "Awards": "1 win & 5 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BN2ZkZTMxOTAtMzg1Mi00M2U0LWE2NWItZDg4YmQyZjVkMDdhXkEyXkFqcGdeQXVyNTM5NzI0NDY@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "5.5/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "25%"
    }],
    "Metascore": "N/A",
    "imdbRating": "5.5",
    "imdbVotes": "9,621",
    "imdbID": "tt0112302",
    "Type": "movie",
    "DVD": "06 May 2003",
    "BoxOffice": "N/A",
    "Production": "Buena Vista",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "Sudden Death",
    "Year": "1995",
    "Rated": "R",
    "Released": "22 Dec 1995",
    "Runtime": "111 min",
    "Genre": "Action, Crime, Thriller",
    "Director": "Peter Hyams",
    "Writer": "Karen Elise Baldwin (story), Gene Quintano (screenplay)",
    "Actors": "Jean-Claude Van Damme, Powers Boothe, Raymond J. Barry, Whittni Wright",
    "Plot": "A former fireman takes on a group of terrorists holding the Vice President and others hostage during the seventh game of the NHL Stanley Cup finals.",
    "Language": "English",
    "Country": "USA",
    "Awards": "N/A",
    "Poster": "https://m.media-amazon.com/images/M/MV5BN2NjYWE5NjMtODlmZC00MjJhLWFkZTktYTJlZTI4YjVkMGNmXkEyXkFqcGdeQXVyNDc2NjEyMw@@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "5.8/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "51%"
    }],
    "Metascore": "N/A",
    "imdbRating": "5.8",
    "imdbVotes": "31,424",
    "imdbID": "tt0114576",
    "Type": "movie",
    "DVD": "01 Nov 1998",
    "BoxOffice": "N/A",
    "Production": "MCA Universal Home Video",
    "Website": "N/A",
    "Response": "True"
}, {
    "Title": "GoldenEye",
    "Year": "1995",
    "Rated": "PG-13",
    "Released": "17 Nov 1995",
    "Runtime": "130 min",
    "Genre": "Action, Adventure, Thriller",
    "Director": "Martin Campbell",
    "Writer": "Ian Fleming (characters), Michael France (story), Jeffrey Caine (screenplay), Bruce Feirstein (screenplay)",
    "Actors": "Pierce Brosnan, Sean Bean, Izabella Scorupco, Famke Janssen",
    "Plot": "Years after a friend and fellow 00 agent is killed on a joint mission, a secret space based weapons program known as \"GoldenEye\" is stolen. James Bond sets out to stop a Russian crime syndicate from using the weapon.",
    "Language": "English, Russian, Spanish",
    "Country": "UK, USA",
    "Awards": "Nominated for 2 BAFTA Film Awards. Another 2 wins & 6 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMzk2OTg4MTk1NF5BMl5BanBnXkFtZTcwNjExNTgzNA@@._V1_SX300.jpg",
    "Ratings": [{
        "Source": "Internet Movie Database",
        "Value": "7.2/10"
    }, {
        "Source": "Rotten Tomatoes",
        "Value": "78%"
    }, {
        "Source": "Metacritic",
        "Value": "65/100"
    }],
    "Metascore": "65",
    "imdbRating": "7.2",
    "imdbVotes": "233,822",
    "imdbID": "tt0113189",
    "Type": "movie",
    "DVD": "19 Oct 1999",
    "BoxOffice": "N/A",
    "Production": "MGM/UA",
    "Website": "N/A",
    "Response": "True"
},
{
    "Title": "The American President",
    "Year": "1995",
    "Rated": "PG-13",
    "Released": "17 Nov 1995",
    "Runtime": "114 min",
    "Genre": "Comedy, Drama, Romance",
    "Director": "Rob Reiner",
    "Writer": "Aaron Sorkin",
    "Actors": "Michael Douglas, Annette Bening, Martin Sheen, Michael J. Fox",
    "Plot": "A widowed U.S. President running for reelection and an environmental lobbyist fall in love. It's all above-board, but \"politics is perception,\" and sparks fly anyway.",
    "Language": "English, French, Spanish",
    "Country": "USA",
    "Awards": "Nominated for 1 Oscar. Another 1 win & 9 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNjhkMmU0M2YtZDUwYi00OWE0LWI5NTktODBjNDc1M2ZlMjI4XkEyXkFqcGdeQXVyNDAxNjkxNjQ@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "6.8/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "91%"
      },
      {
        "Source": "Metacritic",
        "Value": "67/100"
      }
    ],
    "Metascore": "67",
    "imdbRating": "6.8",
    "imdbVotes": "50,775",
    "imdbID": "tt0112346",
    "Type": "movie",
    "DVD": "31 Aug 1999",
    "BoxOffice": "N/A",
    "Production": "Columbia Pictures",
    "Website": "N/A",
    "Response": "True"
  },
  {
    "Title": "Dracula: Dead and Loving It",
    "Year": "1995",
    "Rated": "PG-13",
    "Released": "22 Dec 1995",
    "Runtime": "88 min",
    "Genre": "Comedy, Fantasy, Horror",
    "Director": "Mel Brooks",
    "Writer": "Mel Brooks (screenplay), Rudy De Luca (screenplay), Steve Haberman (screenplay), Rudy De Luca (story), Steve Haberman (story), Bram Stoker (characters)",
    "Actors": "Leslie Nielsen, Peter MacNicol, Steven Weber, Amy Yasbeck",
    "Plot": "Mel Brooks ' parody of the classic vampire story and its famous film adaptations.",
    "Language": "English, German",
    "Country": "France, USA",
    "Awards": "N/A",
    "Poster": "https://m.media-amazon.com/images/M/MV5BZWQ0ZDFmYzMtZGMyMi00NmYxLWE0MGYtYzM2ZGNhMTE1NTczL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMjM5ODMxODc@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "5.9/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "11%"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "5.9",
    "imdbVotes": "38,129",
    "imdbID": "tt0112896",
    "Type": "movie",
    "DVD": "29 Jun 2004",
    "BoxOffice": "N/A",
    "Production": "WARNER BROTHERS PICTURES",
    "Website": "N/A",
    "Response": "True"
  },
  {
    "Title": "Balto",
    "Year": "1995",
    "Rated": "G",
    "Released": "22 Dec 1995",
    "Runtime": "78 min",
    "Genre": "Animation, Adventure, Drama, Family, History",
    "Director": "Simon Wells",
    "Writer": "Cliff Ruby (screenplay), Elana Lesser (screenplay), David Steven Cohen (screenplay), Roger S.H. Schulman (screenplay)",
    "Actors": "Kevin Bacon, Bob Hoskins, Bridget Fonda, Jim Cummings",
    "Plot": "An outcast Husky risks his life with other sled dogs to prevent a deadly epidemic from ravaging Nome, Alaska.",
    "Language": "English",
    "Country": "USA",
    "Awards": "1 nomination.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMjBhNmFlZjMtMzhlYy00NDBlLWFiMjctMmE0ZjgwOGM2MTNmXkEyXkFqcGdeQXVyNjExODE1MDc@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "7.1/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "54%"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "7.1",
    "imdbVotes": "38,665",
    "imdbID": "tt0112453",
    "Type": "movie",
    "DVD": "19 Feb 2002",
    "BoxOffice": "N/A",
    "Production": "MCA Universal Home Video",
    "Website": "N/A",
    "Response": "True"
  },
  {
      "Title": "Nixon",
      "Year": "1995",
      "Rated": "R",
      "Released": "05 Jan 1996",
      "Runtime": "192 min",
      "Genre": "Biography, Drama, History",
      "Director": "Oliver Stone",
      "Writer": "Stephen J. Rivele, Christopher Wilkinson, Oliver Stone",
      "Actors": "Anthony Hopkins, Joan Allen, Powers Boothe, Ed Harris",
      "Plot": "A biographical story of former U.S. President Richard Nixon, from his days as a young boy, to his eventual Presidency, which ended in shame.",
      "Language": "English, Mandarin, Russian",
      "Country": "USA",
      "Awards": "Nominated for 4 Oscars. Another 11 wins & 14 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzBlOWY0ZmEtZjdkYS00ZGU0LWEwN2YtYzBkNDM5ZDBjMmI1XkEyXkFqcGdeQXVyMTAwMzUyOTc@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "7.1/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "74%"
        },
        {
          "Source": "Metacritic",
          "Value": "66/100"
        }
      ],
      "Metascore": "66",
      "imdbRating": "7.1",
      "imdbVotes": "28,272",
      "imdbID": "tt0113987",
      "Type": "movie",
      "DVD": "15 Jun 1999",
      "BoxOffice": "N/A",
      "Production": "Buena Vista Pictures",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Cutthroat Island",
      "Year": "1995",
      "Rated": "PG-13",
      "Released": "22 Dec 1995",
      "Runtime": "124 min",
      "Genre": "Action, Adventure, Comedy",
      "Director": "Renny Harlin",
      "Writer": "Michael Frost Beckner (story), James Gorman (story), Bruce A. Evans (story), Raynold Gideon (story), Robert King (screenplay), Marc Norman (screenplay)",
      "Actors": "Geena Davis, Matthew Modine, Frank Langella, Maury Chaykin",
      "Plot": "A female pirate and her companion race against their rivals to find a hidden island that contains a fabulous treasure.",
      "Language": "English",
      "Country": "France, Italy, Germany, USA",
      "Awards": "1 nomination.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMDg2YTI0YmQtYzgwMi00Zjk4LWJkZjgtYjg0ZDE2ODUzY2RlL2ltYWdlXkEyXkFqcGdeQXVyNjQzNDI3NzY@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "5.7/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "38%"
        },
        {
          "Source": "Metacritic",
          "Value": "37/100"
        }
      ],
      "Metascore": "37",
      "imdbRating": "5.7",
      "imdbVotes": "25,438",
      "imdbID": "tt0112760",
      "Type": "movie",
      "DVD": "25 Jul 2000",
      "BoxOffice": "N/A",
      "Production": "Live Home Video",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Casino",
      "Year": "1995",
      "Rated": "R",
      "Released": "22 Nov 1995",
      "Runtime": "178 min",
      "Genre": "Crime, Drama",
      "Director": "Martin Scorsese",
      "Writer": "Nicholas Pileggi (book), Nicholas Pileggi (screenplay), Martin Scorsese (screenplay)",
      "Actors": "Robert De Niro, Sharon Stone, Joe Pesci, James Woods",
      "Plot": "A tale of greed, deception, money, power, and murder occur between two best friends: a mafia enforcer and a casino executive, compete against each other over a gambling empire, and over a fast living and fast loving socialite.",
      "Language": "English",
      "Country": "France, USA",
      "Awards": "Nominated for 1 Oscar. Another 4 wins & 10 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BOThkYjU3OWQtN2Y3OC00ZDk1LWI1MDQtZTkxZjZiZGU5N2Q0XkEyXkFqcGdeQXVyMTA3MzQ4MTc0._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.2/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "80%"
        },
        {
          "Source": "Metacritic",
          "Value": "73/100"
        }
      ],
      "Metascore": "73",
      "imdbRating": "8.2",
      "imdbVotes": "450,651",
      "imdbID": "tt0112641",
      "Type": "movie",
      "DVD": "24 Feb 1998",
      "BoxOffice": "N/A",
      "Production": "Universal Pictures",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Sense and Sensibility",
      "Year": "1995",
      "Rated": "PG",
      "Released": "26 Jan 1996",
      "Runtime": "136 min",
      "Genre": "Drama, Romance",
      "Director": "Ang Lee",
      "Writer": "Jane Austen (novel), Emma Thompson (screenplay)",
      "Actors": "James Fleet, Tom Wilkinson, Harriet Walter, Kate Winslet",
      "Plot": "Rich Mr. Dashwood dies, leaving his second wife and her three daughters poor by the rules of inheritance. The two eldest daughters are the title opposites.",
      "Language": "English, French",
      "Country": "USA, UK",
      "Awards": "Won 1 Oscar. Another 32 wins & 49 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzk1MjU3MDQyMl5BMl5BanBnXkFtZTcwNjc1OTM2MQ@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "7.6/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "98%"
        },
        {
          "Source": "Metacritic",
          "Value": "84/100"
        }
      ],
      "Metascore": "84",
      "imdbRating": "7.6",
      "imdbVotes": "99,207",
      "imdbID": "tt0114388",
      "Type": "movie",
      "DVD": "01 Jan 1998",
      "BoxOffice": "N/A",
      "Production": "Columbia Pictures",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Four Rooms",
      "Year": "1995",
      "Rated": "R",
      "Released": "25 Dec 1995",
      "Runtime": "98 min",
      "Genre": "Comedy",
      "Director": "Allison Anders, Alexandre Rockwell, Robert Rodriguez, Quentin Tarantino, Chuck Jones",
      "Writer": "Allison Anders, Alexandre Rockwell, Robert Rodriguez, Quentin Tarantino",
      "Actors": "Sammi Davis, Amanda De Cadenet, Valeria Golino, Madonna",
      "Plot": "Four interlocking tales that take place in a fading hotel on New Year's Eve.",
      "Language": "English",
      "Country": "USA",
      "Awards": "1 win & 1 nomination.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNDc3Y2YwMjUtYzlkMi00MTljLTg1ZGMtYzUwODljZTI1OTZjXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.8/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "13%"
        }
      ],
      "Metascore": "N/A",
      "imdbRating": "6.8",
      "imdbVotes": "96,547",
      "imdbID": "tt0113101",
      "Type": "movie",
      "DVD": "20 Apr 1999",
      "BoxOffice": "N/A",
      "Production": "Miramax Films",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Ace Ventura: When Nature Calls",
      "Year": "1995",
      "Rated": "PG-13",
      "Released": "10 Nov 1995",
      "Runtime": "90 min",
      "Genre": "Adventure, Comedy, Crime",
      "Director": "Steve Oedekerk",
      "Writer": "Jack Bernstein (characters), Steve Oedekerk",
      "Actors": "Jim Carrey, Ian McNeice, Simon Callow, Maynard Eziashi",
      "Plot": "Ace Ventura, Pet Detective, returns from a spiritual quest to investigate the disappearance of a rare white bat, the sacred animal of a tribe in Africa.",
      "Language": "English",
      "Country": "USA",
      "Awards": "7 wins & 6 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNGFiYTgxZDctNGI4OS00MWU1LWIwOGUtZmMyNGQxYjVkZjQ3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.4/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "31%"
        },
        {
          "Source": "Metacritic",
          "Value": "45/100"
        }
      ],
      "Metascore": "45",
      "imdbRating": "6.4",
      "imdbVotes": "198,511",
      "imdbID": "tt0112281",
      "Type": "movie",
      "DVD": "30 Oct 1997",
      "BoxOffice": "N/A",
      "Production": "Warner Home Video",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Money Train",
      "Year": "1995",
      "Rated": "R",
      "Released": "22 Nov 1995",
      "Runtime": "110 min",
      "Genre": "Action, Comedy, Crime, Drama, Thriller",
      "Director": "Joseph Ruben",
      "Writer": "Doug Richardson (story), Doug Richardson (screenplay), David Loughery (screenplay)",
      "Actors": "Wesley Snipes, Woody Harrelson, Jennifer Lopez, Robert Blake",
      "Plot": "A vengeful New York City transit cop decides to steal a trainload of subway fares. His foster brother, a fellow cop, tries to protect him.",
      "Language": "English",
      "Country": "USA",
      "Awards": "1 nomination.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYWZlMzIwYzYtOWZiMi00ZGEzLWFhYmQtNmEzYzJlNDg1NjhjXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "5.7/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "22%"
        }
      ],
      "Metascore": "N/A",
      "imdbRating": "5.7",
      "imdbVotes": "38,215",
      "imdbID": "tt0113845",
      "Type": "movie",
      "DVD": "22 May 2001",
      "BoxOffice": "N/A",
      "Production": "Sony Pictures Home Entertainment",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Get Shorty",
      "Year": "1995",
      "Rated": "R",
      "Released": "20 Oct 1995",
      "Runtime": "105 min",
      "Genre": "Comedy, Crime, Thriller",
      "Director": "Barry Sonnenfeld",
      "Writer": "Elmore Leonard (novel), Scott Frank (screenplay)",
      "Actors": "John Travolta, Gene Hackman, Rene Russo, Danny DeVito",
      "Plot": "A mobster travels to Hollywood to collect a debt, and discovers that the movie business is much the same as his current job.",
      "Language": "English",
      "Country": "USA",
      "Awards": "Won 1 Golden Globe. Another 5 wins & 16 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMjAwODYzNDY4Ml5BMl5BanBnXkFtZTcwODkwNTgzNA@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.9/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "87%"
        },
        {
          "Source": "Metacritic",
          "Value": "82/100"
        }
      ],
      "Metascore": "82",
      "imdbRating": "6.9",
      "imdbVotes": "74,125",
      "imdbID": "tt0113161",
      "Type": "movie",
      "DVD": "27 Aug 1997",
      "BoxOffice": "N/A",
      "Production": "MGM",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Copycat",
      "Year": "1995",
      "Rated": "R",
      "Released": "27 Oct 1995",
      "Runtime": "123 min",
      "Genre": "Drama, Mystery, Thriller",
      "Director": "Jon Amiel",
      "Writer": "Ann Biderman, David Madsen",
      "Actors": "Sigourney Weaver, Holly Hunter, Dermot Mulroney, William McNamara",
      "Plot": "An agoraphobic psychologist and a female detective must work together to take down a serial killer who copies serial killers from the past.",
      "Language": "English",
      "Country": "USA",
      "Awards": "2 wins & 1 nomination.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYWUwNDk2ZDYtNmFkMi00NjE5LWE1M2ItYTRkNTFjZDU3ZDU4L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTYxNjkxOQ@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.6/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "78%"
        },
        {
          "Source": "Metacritic",
          "Value": "54/100"
        }
      ],
      "Metascore": "54",
      "imdbRating": "6.6",
      "imdbVotes": "52,730",
      "imdbID": "tt0112722",
      "Type": "movie",
      "DVD": "28 Apr 1998",
      "BoxOffice": "N/A",
      "Production": "Warner Home Video",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Assassins",
      "Year": "1995",
      "Rated": "R",
      "Released": "06 Oct 1995",
      "Runtime": "132 min",
      "Genre": "Action, Crime, Thriller",
      "Director": "Richard Donner",
      "Writer": "Lilly Wachowski (story), Lana Wachowski (story), Lilly Wachowski (screenplay), Lana Wachowski (screenplay), Brian Helgeland (screenplay)",
      "Actors": "Sylvester Stallone, Antonio Banderas, Julianne Moore, Anatoli Davydov",
      "Plot": "Professional hit-man Robert Rath wants to fulfill a few more contracts before retiring but unscrupulous ambitious newcomer hit-man Miguel Bain keeps killing Rath's targets.",
      "Language": "English, Dutch, Spanish",
      "Country": "France, USA",
      "Awards": "1 win & 1 nomination.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BZGI1NDA4ZDItNTRjMi00YTU3LTkwZDEtYjdlNTI1ZjQxZDM1XkEyXkFqcGdeQXVyNDc2NjEyMw@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.3/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "14%"
        }
      ],
      "Metascore": "N/A",
      "imdbRating": "6.3",
      "imdbVotes": "76,268",
      "imdbID": "tt0112401",
      "Type": "movie",
      "DVD": "30 Sep 1997",
      "BoxOffice": "N/A",
      "Production": "Warner Home Video",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Powder",
      "Year": "1995",
      "Rated": "PG-13",
      "Released": "27 Oct 1995",
      "Runtime": "111 min",
      "Genre": "Drama, Fantasy, Mystery, Sci-Fi, Thriller",
      "Director": "Victor Salva",
      "Writer": "Victor Salva",
      "Actors": "Mary Steenburgen, Sean Patrick Flanery, Lance Henriksen, Jeff Goldblum",
      "Plot": "An off the charts genius who is home schooled and shunned after his last relative dies shows the unconscious residents of his town about connection awareness and the generosity of the spirit.",
      "Language": "English",
      "Country": "USA",
      "Awards": "1 win & 1 nomination.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BOGUzYzNiZTItYmZlNi00ODI1LThjNTMtNjI1MTNlZDQ0OGY2XkEyXkFqcGdeQXVyNjExODE1MDc@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.6/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "50%"
        }
      ],
      "Metascore": "N/A",
      "imdbRating": "6.6",
      "imdbVotes": "28,081",
      "imdbID": "tt0114168",
      "Type": "movie",
      "DVD": "10 Aug 1999",
      "BoxOffice": "N/A",
      "Production": "Hollywood Pictures",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Leaving Las Vegas",
      "Year": "1995",
      "Rated": "R",
      "Released": "09 Feb 1996",
      "Runtime": "111 min",
      "Genre": "Drama, Romance",
      "Director": "Mike Figgis",
      "Writer": "John O'Brien (based upon the novel by), Mike Figgis (screenplay by)",
      "Actors": "Nicolas Cage, Elisabeth Shue, Julian Sands, Richard Lewis",
      "Plot": "Ben Sanderson, a Hollywood screenwriter who lost everything because of his alcoholism, arrives in Las Vegas to drink himself to death. There, he meets and forms an uneasy friendship and non-interference pact with prostitute Sera.",
      "Language": "English, Russian",
      "Country": "France, UK, USA",
      "Awards": "Won 1 Oscar. Another 31 wins & 28 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNDg3MDM5NTI0MF5BMl5BanBnXkFtZTcwNDY0NDk0NA@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "7.5/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "91%"
        },
        {
          "Source": "Metacritic",
          "Value": "82/100"
        }
      ],
      "Metascore": "82",
      "imdbRating": "7.5",
      "imdbVotes": "112,534",
      "imdbID": "tt0113627",
      "Type": "movie",
      "DVD": "24 Feb 1998",
      "BoxOffice": "N/A",
      "Production": "United Artists",
      "Website": "N/A",
      "Response": "True"
    },
    {
      "Title": "Othello",
      "Year": "1995",
      "Rated": "R",
      "Released": "19 Jan 1996",
      "Runtime": "123 min",
      "Genre": "Drama, Romance",
      "Director": "Oliver Parker",
      "Writer": "Oliver Parker (adaptation), William Shakespeare (play)",
      "Actors": "Laurence Fishburne, Irène Jacob, Kenneth Branagh, Nathaniel Parker",
      "Plot": "The Moorish General Othello is manipulated into thinking that his new wife Desdemona has been carrying on an affair with his Lieutenant Michael Cassio, when in reality, it is all part of the scheme of a bitter Ensign named Iago.",
      "Language": "English",
      "Country": "USA, UK",
      "Awards": "3 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzVlMjhjYzctNjQ4My00OGMwLThmZTktODE4MWI3NzNkOWYyXkEyXkFqcGdeQXVyNjMwMjk0MTQ@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "6.9/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "67%"
        }
      ],
      "Metascore": "N/A",
      "imdbRating": "6.9",
      "imdbVotes": "8,897",
      "imdbID": "tt0114057",
      "Type": "movie",
      "DVD": "18 Jan 2000",
      "BoxOffice": "N/A",
      "Production": "Columbia Pictures",
      "Website": "N/A",
      "Response": "True"
    }]

//console.log("Random = %s", generateRandom());
init()
 */