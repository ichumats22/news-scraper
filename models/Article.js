var mongoose = require('mongoose');

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Creatw a new ArticleSchema object using the Schema constructor
var ArticleSchema = new Schema({
  //'title' is required and of type String
  title: {
    type: String,
    required: true,
    unique: true
  },
  //'link' is required and of type String
  link: {
    type: String, 
    required: true,
    unique: true
  },
  //'note is an object that stores a Note id
  note: {
    type: Schema.Types.ObjectId,
    //The ref property links the ObjectId to the Note model, which allows us to populate the Article with an associated Note
    ref: 'Note'
  }
});

//Creates model from the above schema using mongoose's model method
var Article = mongoose.model('Article', ArticleSchema);

//Export the Article model
module.exports = Article;