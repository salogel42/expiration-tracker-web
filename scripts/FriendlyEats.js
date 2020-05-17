/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * Initializes the FriendlyEats app.
 */
function FriendlyEats() { // eslint-disable-line no-redeclare
  this.filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
  };

  this.unsubscribe = null;
  this.user = {}
  this.dialogs = {};

  var that = this;

  console.log("in the FriendlyEats function")

}

FriendlyEats.prototype.toggleSignIn = function() {
  console.log('In toggleSignIn')
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // [END addscopes]
    // [START signin]

    firebase.auth().signInWithPopup(provider)
      .then(function() {
        console.log('In the then')
        // that.initTemplates();
        // that.initRouter();
        // that.initReviewDialog();
        // that.initFilterDialog();
      }).catch(function(err) {
        console.log(err);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        }
        // [END_EXCLUDE]
      });
      // [END signin]
  } else {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
  // [START_EXCLUDE]
  document.querySelector('.header').querySelector('#quickstart-sign-in').disabled = true;
  // [END_EXCLUDE]
}
// [END buttoncallback]

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp(fe) {
  fe.initTemplates();


  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("in auth listener")
      // The signed-in user info.
      fe.user = user;
      fe.initRouter();
      fe.initReviewDialog();
      fe.initFilterDialog();

      // User is signed in.
      document.querySelector('.header').querySelector('#quickstart-sign-in').textContent = 'Sign out';
      // fe.initTemplates();

      document.querySelector('.header').querySelector('#quickstart-sign-in').addEventListener('click', fe.toggleSignIn, false);
    } else {
      console.log("in the else")

      console.log("in the else in toggleSignIn, " + this.unsubscribe)
      if (fe.unsubscribe) {
        console.log("calling unsub")
        fe.unsubscribe()
      }
      if (fe.unsub2) {
        fe.unsub2()
      }
      var div = document.querySelector('main');
      while(div.firstChild) {
          div.removeChild(div.firstChild);
      }

      var div = document.querySelector('#section-header');
      while(div.firstChild) {
          div.removeChild(div.firstChild);
      }

      fe.loginSetup()
      document.querySelector('.header').querySelector('#quickstart-sign-in').textContent = 'Sign in with Google';
      document.querySelector('.header').querySelector('#quickstart-sign-in').addEventListener('click', fe.toggleSignIn, false);
    }
    document.querySelector('.header').querySelector('#quickstart-sign-in').disabled = false;
  });

  console.log("in initApp")
}


/**
 * Initializes the router for the FriendlyEats app.
 */
FriendlyEats.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function() {
        that.updateQuery(that.filters);
      }
    })
    .on({
      '/setup': function() {
        that.viewSetup();
      }
    })
    .on({
      '/restaurants/*': function() {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewRestaurant(id);
      }
    })
    .on({
      '/items/*': function() {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewItem(id);
      }
    })
    .resolve();

  if (this.user) {
    this.unsub2 = firebase
      .firestore()
      .collection('restaurants')
      .limit(1)
      .onSnapshot(function(snapshot) {
        if (snapshot.empty) {
          that.router.navigate('/setup');
        }
      });
  }
};

FriendlyEats.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith('/index.html')) {
    return dirtyPath.split('/').slice(1).join('/');
  } else {
    return dirtyPath;
  }
};

FriendlyEats.prototype.getFirebaseConfig = function() {
  return firebase.app().options;
};

FriendlyEats.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

FriendlyEats.prototype.data = {
  words: [
    'Bar',
    'Fire',
    'Grill',
    'Drive Thru',
    'Place',
    'Best',
    'Spot',
    'Prime',
    'Eatin\''
  ],
  cities: [
    'Albuquerque',
    'Arlington',
    'Atlanta',
    'Austin',
    'Baltimore',
    'Boston',
    'Charlotte',
    'Chicago',
    'Cleveland',
    'Colorado Springs',
    'Columbus',
    'Dallas',
    'Denver',
    'Detroit',
    'El Paso',
    'Fort Worth',
    'Fresno',
    'Houston',
    'Indianapolis',
    'Jacksonville',
    'Kansas City',
    'Las Vegas',
    'Long Island',
    'Los Angeles',
    'Louisville',
    'Memphis',
    'Mesa',
    'Miami',
    'Milwaukee',
    'Nashville',
    'New York',
    'Oakland',
    'Oklahoma',
    'Omaha',
    'Philadelphia',
    'Phoenix',
    'Portland',
    'Raleigh',
    'Sacramento',
    'San Antonio',
    'San Diego',
    'San Francisco',
    'San Jose',
    'Tucson',
    'Tulsa',
    'Virginia Beach',
    'Washington'
  ],
  categories: [
    'Brunch',
    'Burgers',
    'Coffee',
    'Deli',
    'Dim Sum',
    'Indian',
    'Italian',
    'Mediterranean',
    'Mexican',
    'Pizza',
    'Ramen',
    'Sushi'
  ],
  ratings: [
    {
      rating: 1,
      text: 'Would never eat here again!'
    },
    {
      rating: 2,
      text: 'Not my cup of tea.'
    },
    {
      rating: 3,
      text: 'Exactly okay :/'
    },
    {
      rating: 4,
      text: 'Actually pretty good, would recommend!'
    },
    {
      rating: 5,
      text: 'This is my favorite place. Literally.'
    }
  ]
};

window.onload = function() {
  window.app = new FriendlyEats();
  initApp(window.app);
};
