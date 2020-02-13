var selected;
//Grab the articles as a JSON
$.getJSON('/articles', data => {
  //For each article
  for (var i = 0; i < data.length; i++) {
    //Display the appropriate information on the page
    $('#articles').append(`<p data-id='${data[i]._id}'>${data[i].title}<br />${data[i].link}</p>`);
  };
});

//Whenever someone clicks a p tag
$(document).on('click', 'p', function() {
  //Empty the notes from the notes section
  $('#addANote').empty();
  $('#existingNotes').empty();
  //Save the id from the p tag
  selected = $(this).attr('data-id');
  console.log(selected)

  //Now make an ajax call for the article
  $.ajax({
    method: 'GET',
    url: `/articles/${selected}`
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data[0]);
      console.log(data[0].note)
      let note = data[0].note
      //If there is a note in the article
      if (note !== undefined) {
       $(`#existingNotes`).append(`<div class='articleNoteDiv' data-id='${note._id}'><h2>${note.title}</h2><p>${note.body}</p></div>`);
      }
      //The title of the article
      $('#addANote').append(`<h2>${data[0].title}</h2>`);
      //An input to enter a new note title
      $('#addANote').append('<input id="titleInput" name="title">');
      //A textarea to add a new note body
      $('#addANote').append('<textarea id="bodyInput" name="body"></textarea>');
      //A button to submit a new note, with the id of the article saved to it 
      $('#addANote').append(`<button data-id='${data[0]._id}' id='saveNote'>Save Note</button>`);
    });
});

// When you click the savenote button
$(document).on("click", "#saveNote", function() {
  console.log('Save note button clicked')

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + selected,
    data: {
      // Value taken from title input
      title: $("#titleInput").val(),
      // Value taken from note textarea
      body: $("#bodyInput").val()
    }
  })
    // With that done
    .then(data => 
      // Log the response
      console.log(data),
      // Empty the notes section
      $("#addANote").empty()
    );

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleInput").val("");
  $("#bodyInput").val("");
});
