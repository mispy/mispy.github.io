/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $('pre > code.csharp, pre > code.language-csharp, pre > code.ruby, pre > code.bash, pre > code.python, pre > code.lang-js, pre > code.language-ruby, pre > code.lang-python, pre > code.lang-ruby, pre > code.css, pre > code.lang-css, pre > code.lang-javascript, pre > code.lang-bash').addClass('prettyprint');
        prettyPrint();

        $(".post-content").fitVids();
    });

}(jQuery));

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
