(function() {
  // def
  var $els,
      hideNotification,
      options;

  // Hook up to page load event
  window.addEventListener( 'load', init );

  // define default options
  options = {
    'host': 'http://localhost:9000'
  };

  /**
   * Initial options
   */
  function init() {
    restore();
    updateUI();

    $('#options-form').submit( onFormSubmit );
  }

  /**
   * Cached select
   * @param {String} selector the selector string
   * @param {Object} jquery object
   */
  function c$( selector ) {
    var $el;

    $els = $els || {};
    $el  = $els[selector];

    if(!$el) {
      $el = $els[selector] = $(selector);
      console.log('selecting');
    } else {
      console.log('cached selecting');
    }

    return $el;
  }

  /**
   * Handle options form submit
   * @parm {Object} e event object
   */
  function onFormSubmit( e ) {
    options.host = c$('#options-host').val();
    save();
    e.preventDefault();
  }

  /**
   * Load options from local storage
   */
  function restore() {
    var persisted = localStorage.options,
        restoredOptions,
        prop;

    if( !persisted ) {
      return;
    }

    try {
      restoredOptions = JSON.parse(persisted);
      for( prop in restoredOptions ) {
        if( restoredOptions.hasOwnProperty(prop) ) {
          options[prop] = restoredOptions[prop];
        }
      }
    } catch(e) {
      // could not load options from local storage, that's fine.
      // save the default options to local storage
      save();
    }
  }

  /**
   * Update UI with current options
   */
  function updateUI() {
    c$('#options-host').val( options.host );
  }

  /**
   * Save options to local storage
   * @param {Boolean} silent save changes without notifyign user
   */
  function save( silent ) {
    var notify$El = c$('.notification');

    localStorage.options = JSON.stringify( options );

    if( !silent ) {
      notify$El.html(notify$El.attr('data-save-msg'));
      notify$El.addClass('active');

      if( hideNotification ) {
        clearTimeout( hideNotification );
      }

      hideNotification = setTimeout( function() {
        notify$El.removeClass('active');
      }, 5000);
    }
  }
}());
