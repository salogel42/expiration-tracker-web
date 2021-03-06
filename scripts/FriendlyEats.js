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
  this.user = null
  this.dialogs = {};

  // var firebaseConfig = {
  //   apiKey: "AIzaSyDN60oisFdM1dcYYfdC1maYBUkHzkuApzQ",
  //   authDomain: "expiration-tracker-276323.firebaseapp.com",
  //   databaseURL: "https://expiration-tracker-276323.firebaseio.com",
  //   projectId: "expiration-tracker-276323",
  //   storageBucket: "expiration-tracker-276323.appspot.com",
  //   messagingSenderId: "879620136094",
  //   appId: "1:879620136094:web:4303146e809debdd1f6f8f",
  //   measurementId: "G-12QFC6Z3C3"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  var that = this;
}

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
      // The signed-in user info.
      fe.user = user;
      fe.initRouter();
      fe.initReviewDialog();
      fe.initFilterDialog();

    } else {
      fe.user = null;
      if (fe.unsubscribe) { fe.unsubscribe() }
      if (fe.unsub2) { fe.unsub2() }
      // Set up the full "not signed in" page
      fe.loginSetup()
    }
    fe.setupAuthButton();
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
        // set the sign out button back up
        that.setupAuthButton();
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
        if (!that.user) {
          that.router.navigate('/');
        } else {
          var path = that.getCleanPath(document.location.pathname);
          var id = path.split('/')[2];
          that.viewItem(id);
        }
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
