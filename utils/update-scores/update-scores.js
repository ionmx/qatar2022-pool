const admin = require('firebase-admin');
const fetch = require('node-fetch');

// --------------------------------------------------------
// Set FIFA Results URL
// --------------------------------------------------------
const date = new Date();
const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const competition = '17'; // Worlcup 2022
const dataUrl = `https://api.fifa.com/api/v3/calendar/matches?count=500&from=${currentDate}T00:00:00Z&to=${currentDate}T23:59:59Z&idCompetition=${competition}`;

// --------------------------------------------------------
// Init firebase
// --------------------------------------------------------
const config = require('./config.json');
console.log(config)
const serviceAccount = require(config.service_acount_file);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.database_url
});

const db = admin.database();

// --------------------------------------------------------
//  Utility functions to calculate points
// --------------------------------------------------------
const getWinner = (home, visitor) => {
  let winner = "";
  if (home > visitor) {
    winner = "home";
  } else {
    if (home < visitor) {
      winner = "visitor";
    } else {
      winner = "tied";
    }
  }
  return winner;
};

const getScore = (home, visitor, homePrediction, visitorPrediction) => {
  let points = 0;
  if (home >= 0 && homePrediction != null && visitorPrediction != null) {
    if ((home == homePrediction) && (visitor == visitorPrediction)) {
      points = 15;
    } else {
      if (getWinner(home, visitor) == getWinner(homePrediction, visitorPrediction)) {
        points = 10 - Math.abs(homePrediction - home) - Math.abs(visitorPrediction - visitor);
        if (points < 0) {
          points = 0;
        }
      }
    }
  }
  return points;
};

// --------------------------------------------------------
// Get results and update match & user scores on DB
// --------------------------------------------------------
console.log('Updating scores...');
let c = 0;
let matchChanged = false;
let homeScore = -1;
let awayScore = -1;
let homePrevScore = -1;
let awayPrevScore = -1;
let points = 0;
let beforePoints = 0;
let afterPoints = 0;

db.ref('matches').once('value', function(matches) {
  console.log('Got matches from firebase...');
  console.log('Update match scores...');
  fetch(dataUrl)
    .then((response) => response.json())
    .then((data) => {
      data.Results.forEach((item) => {
        c++;
        console.log('-------------------------------------')
        console.log(`${c}. ${item.Home.Abbreviation} ${item.Home.Score} vs. ${item.Away.Score} ${item.Away.Abbreviation}`);
        matches.forEach((match) => {
          matchChanged = false;
          if (match.val().fifaId === item.IdMatch) {
            homeScore = match.val().homeScore;
            awayScore = match.val().awayScore;
            homePrevScore = match.val().homeScore;
            awayPrevScore = match.val().awayScore;
            if (match.val().homeScore !== item.Home.Score) {
              db.ref(`matches/${match.val().game}/homeScore`).set(item.Home.Score);
              matchChanged = true;
              console.log('Update Home Score: ' + item.Home.Score);
              homeScore = item.Home.Score;
            }
            if (match.val().awayScore !== item.Away.Score) {
              db.ref(`matches/${match.val().game}/awayScore`).set(item.Away.Score);
              matchChanged = true;
              console.log('Update Away Score: ' + item.Away.Score);
              awayScore = item.Away.Score;
            }

            if (matchChanged) {
              console.log('Update prediction points...');
              db.ref().child('users').once('value').then((snapshot) => {
                // Update user prediction points
                snapshot.forEach((childSnapshot) => {
                  console.log(`Updating ${childSnapshot.val().userName}`)
                  db.ref().child(`predictions/${childSnapshot.key}/${match.val().game}`).once('value').then((predSnapshot) => {
                    const pred = predSnapshot.val();
                    if (pred) {
                      beforePoints = getScore(homePrevScore, awayPrevScore, pred.homePrediction, pred.awayPrediction)
                      points = getScore(homeScore, awayScore, pred.homePrediction, pred.awayPrediction);
                      afterPoints = points;
                      if (beforePoints !== afterPoints) {
                        db.ref(`predictions/${childSnapshot.key}/${match.val().game}/points`).set(points).then ( () => {
                          // Update user score
                          db.ref().child(`users/${childSnapshot.key}/score`).once('value').then((scoreSnapshot) => {
                            if (scoreSnapshot.exists()) {
                              const points = scoreSnapshot.val() - beforePoints + afterPoints;
                              db.ref(`users/${childSnapshot.key}/score`).set(points);
                            } else {
                              db.ref(`users/${childSnapshot.key}/score`).set(afterPoints);
                            }
                          });
                        });
                      }
                    }
                  });
                });
              });
            } 
          }
        });
      });
      
      // Hacky way to end the script after 10 seconds
      // I guess is enough time...
      setTimeout(()=> {
        process.exit(1);
      }, 10000)
    });
});
