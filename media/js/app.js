;(function ($, window, undefined) {

  /* Javascript masterminded by Kevin Xu <kevin@imkevinxu.com> */

  var winHeight = $(window).height();
  $('#editor').height(winHeight - 45);
  $('#preview').height((winHeight - 45)/2);



  /* -----------------------------------------
     ZURB FOUNDATION INITIALIZATION
  ----------------------------------------- */

  $(document).foundation();

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);