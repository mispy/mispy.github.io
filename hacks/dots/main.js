jQuery(function($) {
  $('#terminal').terminal(function(command, term) {
    console.log(command);
  }, { onInit: function(term) {

    function dot() {
      setTimeout(function() { term.insert('.'); }, 0)
      setTimeout(function() { term.insert('.'); }, 100)
      setTimeout(function() { term.insert('.'); }, 200)
      setTimeout(function() { term.insert("\n"); }, 500)
      setTimeout(dot, 600);
    }

    $('#terminal').click();
    dot();
  }, greetings: false });
});
