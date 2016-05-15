jQuery(function($) {
  $('#terminal').terminal(function(command, term) {
    console.log(command);
  }, { onInit: function(term) {

    function sadface() {
      length = Math.max(1, Math.round(Math.random()*10));
      setTimeout(function() { term.insert(';'); }, 0)
      for (i=0; i < length; i++) {
        setTimeout(function() { term.insert('_'); }, 100 + i*100)
      }
      setTimeout(function() { 
        term.insert(';') 
      }, 100 + length*100)
      setTimeout(function() {
        if (Math.random() > 0.7) {
          term.insert('\n');
        } else {
          term.insert(' ');
        }
      }, 200 + length*100)
      setTimeout(sadface, 300 + length*100);
    }

    $('#terminal').click();
    sadface();
  }, greetings: false });
});
