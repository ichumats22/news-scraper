const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const mongojs = require('mongojs');
require('dotenv').config();
const PORT = 3000;

//Scraping tools
const axios = require('axios');
const cheerio = require('cheerio');

//Models
const db = require('./models');

//Initialize Express
const app = express();

//Middleware
//Morgan logger logs requests
app.use(logger('dev'));
//Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
//Mkae public a static folder
app.use(express.static('./public'));

//Connect to the Mongo DB
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
//mongoose.connect(MONGODB_URI, {useNewUrlParser: true });
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

const results = []

const filterAudioFiles = item => {
  let link = item.link
  if (link.includes('mp3') || link.includes('/video')) {
    return false
  } else {
    return true
  }
};
//Routes
// A GET route for scraping the echoJS website
app.get("/scrape", (req, res) => {
  // First, we grab the body of the html with axios
  axios.get('https://www.npr.org/').then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    let $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      let article = {};

      article.title = $(element).find("h3").text().trim();
      article.link = $(this).find('a').attr("href");

      results.push(article)
      
      let filteredResult = results.filter(filterAudioFiles);

      // Create a new Article using the `result` object built from scraping
      db.Article.create(filteredResult)
        // View the added result in the console
        .then(dbArticle => console.log(dbArticle))
        // If an error occurred, log it
        .catch(err => console.log(err))
    });
    // Send a message to the client
    res.send('Scrape Complete');
  });
});

// Route for getting all Articles from the db
app.get("/articles", (req, res) =>
  db.Article.find({})
  .then(dbArticle => res.json(dbArticle))
  .catch(err => res.json(err))
);

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", (req, res) =>
  // Find one article using the req.params.id,
  db.Article.find({_id: mongojs.ObjectId(req.params.id)})
  // Run the populate method with "note",
  .populate("note")
  // Respond with the article and its notes
  .then(dbArticle => res.json(dbArticle))
  .catch(err => res.json(err))
);

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", (req, res) => 
  // save the new note that gets posted to the Notes collection
  db.Note.create(req.body)
  .then(dbNote => {
    console.log(dbNote)
    console.log(req.params.id)
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    return db.Article.updateOne({_id: mongojs.ObjectId(req.params.id)}, {$push: {note: dbNote._id}}, {new: true});
  })
  .catch(err => res.json(err))
);

// Start the server
app.listen(PORT, () => console.log("App running on port " + PORT + "!"));