jQuery(function($) {
  $('#terminal').terminal(function(command, term) {
    console.log(command);
  }, { onInit: function(term) {

    function heart() {
      length = 1//Math.max(1, Math.round(Math.random()*10));
      setTimeout(function() { term.insert('♥'); }, 0)
      setTimeout(function() {
        if (Math.random() > 0.9) {
          term.insert('\n');
        } else {
          term.insert(' ');
        }
      }, 100)
      setTimeout(heart, 200);
    }

    $('#terminal').click();
    heart();
  }, greetings: false });
});
