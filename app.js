
const express = require("express");
const fs = require ("fs");
const app = express();
const moviesFile = "movieDescriptions.txt"

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

let myList = ["Inception", "Spiderman", "The Dark Knight", "Tennet"]
app.get("/", (req, res) => {  
  res.render ('pages/index', {
    movieList: myList
  });
});

app.get("/myForm", (req, res) => res.render ('pages/myForm'));

app.post("/myForm", (req, res) => {
  let formData = req.body;
  let movieList = formData.movieList.split(',').map((item) => item.trim());
  myList = movieList;
  res.render ('pages/index', {
    movieList: movieList
  });
});

app.get("/myListQueryString", (req, res) => {
  let movie1 = req.query.movie1.replace('The', '');
  let movie2 = req.query.movie2.replace('The', '');

  let movieSearch = myList.filter((item) =>{
    if(item.toLowerCase().includes(movie1.toLowerCase()) ||
      item.toLowerCase().includes(movie2.toLowerCase())
    ) return item;
  })
  res.render ('pages/index', {
    movieList: movieSearch
  });
});

const searchMovieDB = (movie) =>{
  let data = fs.readFileSync(moviesFile, "utf8")
  let moviedb = JSON.parse(data);
  let found = moviedb.movies.filter(element => {
    if (element.name.toLowerCase().includes(movie)) return element
  });
  return found[0];
}
app.get("/search/:movieName", (req, res) => {
  let movieName = req.params.movieName;
  let movie = searchMovieDB(movieName);
  res.render ('pages/searchResult', {
    movie: movie,
  });
});

app.listen(3000)
