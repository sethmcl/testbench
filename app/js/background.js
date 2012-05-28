// listen for requests from content scripts
chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
  if( request.method === 'getOptions' ) {
    sendResponse( loadOptions() );
  } else {
    sendResponse( {} );
  }
});

/**
 * Load options from localStorage
 * @return {Object} extension options
 */
function loadOptions() {
  var options = {};

  try {
    options = JSON.parse(localStorage.options);
  } catch(e) {
    // unable to load options. too bad, so sad.
  }

  return options;
}
