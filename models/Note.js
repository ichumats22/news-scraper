var mongoose = require('mongoose');

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Create new NoteSchema object using the Schema constructor
var NoteSchema = new Schema({
  article_id: Schema.Types.ObjectId, 
  //'title' is of type String
  title: String, 
  //'body' is of type String
  body: String
});

//Create model from the above Schema using mongoose's model method
var Note = mongoose.model('Note', NoteSchema);

//Export the Note model
module.exports = Note;