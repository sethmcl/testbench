// This script should only run in the browser when the current page is
// a LinkedIn member profile
// Question, comments? Talk to Seth <smclaughlin@linkedin.com>

var host, // Host of Say My Name server
    surl  = '/person/{id}/widget.js', // Path to Widget script URL
    profileId, // LinkedIn member ID for the current profile page
    userId, // LinkedIn member ID of the currently logged in user
    extOptions; // extension options

// Load extension options from localStorage
loadOptions(run);

/**
 * Execute! Figure out the member IDs, inject script in page, and then
 * have a party
 */
function run() {
  // assign host and build widget script URL
  host = extOptions.host || 'http://localhost:9000';
  surl = host + surl;

  // Get the LinkedIn member ID of the current profile page displayed
  // in the browser. Returns -1 if operation fails.
  profileId = getProfileId();

  // Abort if we were unable to get the profile ID
  if( profileId === -1 ) {
    throw new Error('Current page is not a LinkedIn profile. Aborting');
  }

  // Get the member ID of the user currently logged in to LinkedIn.
  // If user is not logged in, this will be set to -1
  userId = getUserId();

  // Add a placeholder element to the DOM. This is where the
  // Widget will be placed.
  addWidgetToDOM( profileId, userId );

  // Build script tag to include widget and add to DOM
  addScriptToDom( surl, profileId );
}

// Done! The script that was injected into the DOM in the previous step
// will be downloaded and executed. That's where the logic to actually build
// up the Say My Name(tm) UI happens :)

/**
 * Load extension options from local storage
 * @param {Function} cb callback function
 * @return {Object} options object
 */
function loadOptions( cb ) {
  chrome.extension.sendRequest({method: 'getOptions'}, function(response) {
    extOptions = response || {};
    cb();
  });
}

/**
 * Get the member ID of the current LinkedIn profile page
 * displayed in the browser
 * @return {Number} a LinkedIn member ID
 */
function getProfileId() {
  var id = -1,
      masthead = document.querySelector('div.masthead.vcard.contact'),
      sendLink;

  if( masthead ) {
    id = parseInt(masthead.id.replace('member-', ''), 10);
  }

  if( id === 1 ) {
    sendLink = document.querySelector('#send-inmail a');
    id = parseInt( sendLink.href.match(/id=\d*/)[0].replace('id=',''), 10 );
  }

  return id;
}

/**
 * Get the member ID of the user currently logged in to LinkedIn
 * @return {Number} a LinkedIn member ID
 */
function getUserId() {
  var id = -1,
      leoAuth;

  if( (leoAuth = readCookie('leo_auth_token')) ) {
    id = leoAuth.split(':')[1].trim();
  }

  return id;
}

/**
 * Insert the Widget placeholder into the DOM. This element
 * includes some data attributes which pass information to the 
 * dynamic script returned from the server
 * @param {Number} profileId member ID of the active profile
 * @param {Number} userId member ID of the active user
 */
function addWidgetToDOM( profileId, userId ) {
  var placeholder = document.createElement('span'),
      container   = document.querySelector('.profile-header h1');
      //img       = document.createElement('img');

  placeholder.id = 'say-my-name-widget';
  placeholder.setAttribute('data-profile-id', profileId);
  placeholder.setAttribute('data-user-id', userId);
  placeholder.innerHTML = '<div class="placeholder"></div>';

  // Was trying to use placeholder spinner animation,
  // but this doesn't seem to be working.
  // See: http://code.google.com/p/chromium/issues/detail?id=72378
  //img.src = chrome.extension.getURL('images/spinner.png');
  //img.className = 'placeholder';
  //placeholder.appendChild(img);
  container.appendChild( placeholder );
}

/**
 * Build dynamic widget script tag, and insert into DOM
 * @param {String} url the unformatted URL to the script resource
 * @param {Number} id the LinkedIn member ID mapping to the active profile page
 */
function addScriptToDom( url, id ) {
  var formattedUrl  = url.replace('{id}', id),
      script        = document.createElement('script');

  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', formattedUrl );

  document.head.appendChild( script );
}

/**
 * Helper function to get a cookie value
 * @param {String} name the cookie name to read
 * @return {String} the cookie's value
 */
function readCookie( name ) {
  var nameEq  = cookie + '=',
      cookies = document.cookie.split(';'),
      idx     = cookies.length,
      cookie,
      cookieParts;

  while( idx-- ) {
    cookie = cookies[idx];
    cookieParts = cookie.trim().split('=');
    if( cookieParts[0] === name ) {
      return cookieParts[1];
    }
  }

  return null;
}
