// Initialize Firebase
var config = {
    apiKey: "AIzaSyAfpPBqgYNKFtjRantsNNkm6WfHIZ-jMrI",
    authDomain: "post-smtp-184907.firebaseapp.com",
    databaseURL: "https://post-smtp-184907.firebaseio.com",
    projectId: "post-smtp-184907",
    storageBucket: "post-smtp-184907.appspot.com",
    messagingSenderId: "347122253015"
};
firebase.initializeApp(config);


function initApp() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // send to background.js user object and fetch user.uid
            chrome.runtime.sendMessage(user, function (response) {

            });

            document.getElementById('button').textContent = 'Sign out';
            document.getElementById('sign-in-status').textContent = 'Signed in';
            document.getElementById('post-smtp-uid').value = user.uid;
        } else {

            document.getElementById('button').textContent = 'Sign-in with Google';
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('post-smtp-uid').value = 'null';
        }
        document.getElementById('button').disabled = false;
    });
    // [END authstatelistener]

    document.getElementById('button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({interactive: !!interactive}, function (token) {
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Authorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({token: token}, function () {
                        startAuth(interactive);
                    });
                }
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
    document.getElementById('button').disabled = true;
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        startAuth(true);
    }
}

let ctc = document.getElementById("post-smtp-ctc");
ctc.addEventListener('click', function() {
    /* Get the text field */
    var copyText = document.getElementById("post-smtp-uid");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
});

window.onload = function () {
    initApp();
};
