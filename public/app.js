var selected;
//Grab the articles as a JSON
$.getJSON('/articles', data => {
  //For each article
  for (let i = 0; i < data.length; i++) {
    //Display the appropriate information on the page
    $('#articles').append(`
      <a data-id='${data[i]._id}' href='${data[i].link}'><h1>${data[i].title} </h1> <br /><p>${data[i].summary}</p>`);
  };
});

const clearAllDivs = () => {
  $('#articles').empty(),
  $('#addANote').empty(),
  $('#existingNotes').empty()
}

const createNoteInput = (input) => {
  //The title of the article
  $('#addANote').append(`<h2>${input.title}</h2>`);
  //An input to enter a new note title
  $('#addANote').append('<input id="titleInput" name="title">');
  //A textarea to add a new note body
  $('#addANote').append('<textarea id="bodyInput" name="body"></textarea>');
  //A button to submit a new note, with the id of the article saved to it 
  $('#addANote').append(`<button data-id='${input._id}' id='saveNote'>Save Note</button>`);
}

const createNoteDiv = input => {
  console.log(input)
  $(`#existingNotes`).append(
    `<div class='articleNoteDiv' data-id='${input._id}'> 
      <div class='articleNoteHeader'> 
        <h2 class='articleNoteTitle'> ${input.title}</h2> 
        <button class='deleteNoteBtn' data-id='${input._id}'> <i class='fas fa-times'></i> </button>
      </div>
      <div>
        <p>${input.body}</p>
      </div>
    </div>`
  );
}

$(document).on('click', '#refresh', () => 
  $.ajax({
    method: 'GET',
    url: `/scrape`
  })
  .then(location.reload(true))
);

$(document).on('click', '#clear', clearAllDivs);

$(document).on('click', '.deleteNoteBtn', function() {
  let selectedNote = $(this).attr('data-id')
  console.log(selectedNote)
  $.ajax({
    method: 'PUT',
    url: `/notes/delete/${selectedNote}`
  }).then()
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
      console.log(data)
      //If there is a note in the article
      if (data[0].note == undefined || data[0].note == null) {      
        createNoteInput(data[0])  
      } else {
        let notes = data[0].note
        console.log(notes)   
        createNoteDiv(notes)
        createNoteInput(data[0])  
      }
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
      article_id: selected,
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
