// Initial Scrape of CapitolFax on button click function. Sends data to the the database and then brings it back to the front end to print to the page.
$("#scrape").on("click", function() {
    console.log("start scrape");
   $.ajax({
       method: "GET",
       url: "/scrape"
   })
   .then(function(data) {
       console.log(data);
       alert("You have scraped "+data.length+ " news articles.");
       for (var i = 0; i < data.length; i++) {
           $(".stories").append("<p data-id='" +data[i]._id+ "'><strong>" +data[i].title+ "</strong><br />" +data[i].link+ "</p>");
       }
// NOTES LOGIC
// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $(".notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/news/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(results) {
        console.log(results._id);
        // The title of the article
        $(".notes").append("<h6>" + results.title + "</h6>");
        // An input to enter a new title
        $(".notes").append("<p>Title</p><input id='titleinput' name='title' >\n");
        // A textarea to add a new note body
        $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(".notes").append("<button data-id='" + results._id + "' id='savenote'>Save Note</button>");
        // A button to delete a note, with the id of the article
        $(".notes").append("<button data-id='" + results._id + "' id='deleteNote'>Delete</button>");
  
        // If there's a note in the article
        if (results.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(results.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(results.note.body);
        }
        console.log(results.title);
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {

    // $.ajax({{
    //     method: "UPDATE"
    // }})
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/news/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
$(document).on("click", "#deleteNote", function() {
    var selected = $(this).parent();

    $.ajax({
        type: "GET",
        url: "/delete/" + selected.attr("data-id"),

        success: function(response) {
            selected.remove();
            $("#titleinput").val("");
            $("#bodyinput").val("");
        }
    })
})
});
});
  