;(function ($, window, undefined) {

  /* -----------------------------------------
     ACE EDITOR SETTINGS
  ----------------------------------------- */

  if ($("#editor").length) {
    $(window).resize(function() {
      var winHeight = $(this).height() - 45;
      var chromeFrameHeight = $('#chrome-frame').height();
      $('#editor').height(winHeight);
      $('#preview').height(winHeight/2 - chromeFrameHeight + 1);
      $('#preview-wrapper, #content').height(winHeight/2);
      this.setTimeout(function() {
        $('.section-container').height(winHeight/2);
        $('.section-container div.content').height(winHeight/2 - 81);
      }, 100);
    });

    var editor = ace.edit("editor");
    var session = editor.getSession();
    var iframe = $('#preview')[0];

    editor.setTheme("ace/theme/tomorrow_night_eighties");
    session.setMode("ace/mode/html");
    session.setUseWrapMode(true);
    editor.setFontSize(20);

    var updatePreview = function() {
        iframe.contentWindow.document.open('text/html', 'replace');
        iframe.contentWindow.document.write(session.getValue());
        iframe.contentWindow.document.close();
        var iframeContents = $('#preview').contents();
        iframeContents.find('head').html('<link rel="stylesheet" href="/media/css/foundation.min.css">');
        iframeContents.find('body').css('padding', '10px 20px 0px');
        iframeContents.find('a').each(function() {
          $(this).attr("target", "_blank");
          if ($(this).attr('href') && $(this).attr('href').indexOf("http://") < 0) {
            $(this).attr('href', "http://" + $(this).attr('href'));
          }
        });
    }

    updatePreview();
    session.on("change", updatePreview);
  }

  /* -----------------------------------------
     QUIZ EDITOR SETTINGS
  ----------------------------------------- */

  if ($("#quizEditor").length) {
    var quizEditor = ace.edit("quizEditor");
    var quizSession = quizEditor.getSession();
    var quizIframe = $('#quizPreview')[0];

    quizEditor.setTheme("ace/theme/tomorrow_night_eighties");
    quizSession.setMode("ace/mode/html");
    quizSession.setUseWrapMode(true);
    quizEditor.setFontSize(16);

    var updateQuizPreview = function() {
        quizIframe.contentWindow.document.open('text/html', 'replace');
        quizIframe.contentWindow.document.write(quizSession.getValue());
        quizIframe.contentWindow.document.close();
        var quizIframeContents = $('#quizPreview').contents();
        quizIframeContents.find('head').html('<link rel="stylesheet" href="/media/css/foundation.min.css">');
        quizIframeContents.find('body').css('padding', '15px 20px 0px');
        quizIframeContents.find('a').each(function() {
          $(this).attr("target", "_blank");
          if ($(this).attr('href') && $(this).attr('href').indexOf("http://") < 0) {
            $(this).attr('href', "http://" + $(this).attr('href'));
          }
        });
    }

    updateQuizPreview();
    quizSession.on("change", updateQuizPreview);
  }

  /* -----------------------------------------
     QUIZ LOGIC
  ----------------------------------------- */

  $('#quizSubmit').on('click', function(e) {
    e.preventDefault();

    $('#quizEditor').fadeToggle(function() {
      $('#quizPreviewWrapper').fadeToggle();
    });

    if (passQuiz()) {
      $(this).fadeToggle(function() {
        $('#quizCongratsWrapper').fadeToggle();
      });

    } else {
      $(this).fadeToggle(function() {
        $('#quizTryAgainWrapper').fadeToggle();
      });
    }

  });

  $('#quizTryAgain').on('click', function(e) {
    e.preventDefault();

    $('#quizPreviewWrapper').fadeToggle(function() {
      $('#quizEditor').fadeToggle();
    });

    $('#quizTryAgainWrapper').fadeToggle(function() {
      $('#quizSubmit').fadeToggle();
    });
  });


  /* -----------------------------------------
     ZURB FOUNDATION INITIALIZATION
  ----------------------------------------- */

  $(document).foundation();

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (window.Modernizr.touch) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);