;(function ($, window, undefined) {

  /* -----------------------------------------
     HOMEPAGE FUNCTIONS
  ----------------------------------------- */

  var suggestEmail = function(element, suggestion) {
    var msg = 'Did you mean <a class="suggestedEmail">' + suggestion.full + '</a>?';
    $('.mailCheck').html(msg);
  }

  $('#email_cta input[type=email]').on('blur', function() {
    $(this).mailcheck({ suggested: suggestEmail });
  });

  $('#email_cta input[type=submit]').hover(function() {
    $('#email_cta input[type=email]').mailcheck({ suggested: suggestEmail });
  });

  $('body').on('click', '.suggestedEmail', function() {
    $('#email_cta input[type=email]').val($(this).html());
    $('.mailCheck').html('* Not affiliated or endorsed by <a href="http://zurb.com/?ref=tryfoundation" target="_blank">ZURB</a>... yet...');
  });

  $('#email_cta').submit(function(e) {
    var $input = $(this).find('.email');
    if ($.trim($input.val()) == '') {
      e.preventDefault();
      $input.focus();
      $input.addClass('animated shake');
      window.setTimeout( function() {
        $input.removeClass('animated shake').focus()
      }, 1000);
    }
  });

  /* -----------------------------------------
     MODAL FUNCTIONS
  ----------------------------------------- */

  if ($('#confirm-modal').length) {
    $(document).foundation('reveal', {
        closeOnBackgroundClick: false,
    });
    $('#confirm-modal').foundation('reveal', 'open');
  }

  if ($('#create-modal').length) {
    $('#create-modal').foundation('reveal', 'open');
  }

  $('#confirm-modal form, #create-modal form').on('submit', function(e) {
    e.preventDefault();
    var $modal = $(this).parent();
    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: $(this).serialize(),
      success: function (data) {
        if (data['status'] == "success") {
          $('#social-modal').foundation('reveal', 'open');
          $('.reveal-modal-bg').on('click', function() {
            $('#social-modal').foundation('reveal', 'close');
          });
        } else {
          $modal.html('<h2>Sorry, looks like an error occurred. Please refresh the page</h2>');
        }
      }
    });
  });

  /* -----------------------------------------
     LEARN PAGE FUNCTIONS
  ----------------------------------------- */

  $('a.lesson.disabled').on('click', function(e) {
    e.preventDefault();
  });

  /* -----------------------------------------
     DEMO EDITOR SETTINGS
  ----------------------------------------- */

  if ($("#demoEditor").length) {
    var demoEditor = ace.edit("demoEditor");
    var demoSession = demoEditor.getSession();
    var demoIframe = $('#demoPreview')[0];

    demoEditor.setTheme("ace/theme/tomorrow_night_eighties");
    demoSession.setMode("ace/mode/html");
    demoSession.setUseWrapMode(true);
    demoEditor.setShowPrintMargin(false);
    demoEditor.setFontSize(15);

    var updateDemoPreview = function() {
        demoIframe.contentWindow.document.open('text/html', 'replace');
        demoIframe.contentWindow.document.write(demoSession.getValue());
        demoIframe.contentWindow.document.close();
        var demoIframeContents = $('#demoPreview').contents();
        demoIframeContents.find('head').html('<link rel="stylesheet" href="/media/css/foundation.min.css"><link rel="stylesheet" href="/media/css/iframe.css">');
        demoIframeContents.find('body').css('padding', '15px 20px 0px');
        demoIframeContents.find('a').each(function() {
          $(this).attr("target", "_blank");
          if ($(this).attr('href') && $(this).attr('href').indexOf("http://") < 0) {
            $(this).attr('href', "http://" + $(this).attr('href'));
          }
        });
        try { checkDemo(demoIframeContents); }
        catch (err) {}
    }

    updateDemoPreview();
    demoSession.on("change", updateDemoPreview);
  }

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
    editor.setShowPrintMargin(false);
    editor.setFontSize(14);

    var updatePreview = function() {
        iframe.contentWindow.document.open('text/html', 'replace');
        iframe.contentWindow.document.write(session.getValue());
        iframe.contentWindow.document.close();
        var iframeContents = $('#preview').contents();
        iframeContents.find('head').html('<link rel="stylesheet" href="/media/css/foundation.min.css"><link rel="stylesheet" href="/media/css/iframe.css">');
        iframeContents.find('body').css('padding', '10px 20px 0px');
        iframeContents.find('a').each(function() {
          var $this = $(this);
          $this.attr("target", "_blank");
          if ($this.attr('href')) {
            if ($this.attr('href').indexOf("#") == 0) {
              $this.attr("target", "");
            } else if ($this.attr('href').indexOf("http://") < 0) {
              $this.attr('href', "http://" + $this.attr('href'));
            }
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
    quizEditor.setShowPrintMargin(false);
    quizEditor.setFontSize(16);

    var updateQuizPreview = function() {
        quizIframe.contentWindow.document.open('text/html', 'replace');
        quizIframe.contentWindow.document.write(quizSession.getValue());
        quizIframe.contentWindow.document.close();
        var quizIframeContents = $('#quizPreview').contents();
        quizIframeContents.find('head').html('<link rel="stylesheet" href="/media/css/foundation.min.css"><link rel="stylesheet" href="/media/css/iframe.css">');
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

  $('.objective-check').click(function(e) {
    e.preventDefault();

    var objectiveResult = checkObjective($('#preview').contents());
    if (objectiveResult) {
      sendCompletion(true);
      $('#objectiveModal .objective-success').fadeIn();
      $('#objectiveModal .objective-failure').fadeOut();
    } else {
      sendCompletion(false);
      $('#objectiveModal .objective-failure').fadeIn();
      $('#objectiveModal .objective-success').fadeOut();
    }

  });

  $('.objective-retry').click(function(e) {
    e.preventDefault();

    $('#objectiveModal').foundation('reveal', 'close');
    $('#objectiveModal .objective-failure').fadeOut();
  })

/*
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
*/

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

  /* -----------------------------------------
     AUTO-SETS CSRF TOKEN FOR AJAX CALLS
  ----------------------------------------- */

  // Acquiring CSRF token and setting it to X-CSRFToken header for AJAX POST Request
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  var csrftoken = getCookie('csrftoken');
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  $.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type)) {
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });

})(jQuery, this);