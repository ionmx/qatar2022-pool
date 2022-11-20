# QATAR 2022 FIFA World Cup Pool

[![Deploy to Firebase Hosting on merge](https://github.com/ionmx/qatar2022-pool/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/ionmx/qatar2022-pool/actions/workflows/firebase-hosting-merge.yml)

Web application to manage QATAR 2022 FIFA World Cup Pool.

Come out and play here: https://qatar2022pool.web.app

Features:
* Realtime results for matches and leaderboard.
* Select your predictions.
* View others predictions.
* Social login (Twitter, Facebook, Google, GitHub).

Stack:
* [Create React App](https://github.com/facebook/create-react-app).
* [TypeScript](https://www.typescriptlang.org/).
* [Firebase Realtime Database](https://firebase.google.com/).
* [TailwindCSS](https://tailwindcss.com/)

## Screenshots

### Predictions

<img width="1381" alt="Screenshot 2022-11-17 at 23 59 28" src="https://user-images.githubusercontent.com/119507/202636285-07bd21a8-cf58-4da8-bf91-44f217663618.png">

### Leaderboard

<img width="1382" alt="Screenshot 2022-11-17 at 23 58 55" src="https://user-images.githubusercontent.com/119507/202636236-a6a86b0e-cf76-41de-ae81-8cf51c16b268.png">

## Install

* First you need to setup a [Firebase Realtime Database](https://firebase.google.com/).
* Import `initial-data/qatar2022.json` to your database.
* Import rules `initial-data/rules.json` to your database.
* Create a `.env.local` file with your Firebase config:
```
REACT_APP_FIREBASE_API_KEY             = "Your API key"
REACT_APP_FIREBASE_AUTH_DOMAIN         = "            "
REACT_APP_FIREBASE_DATABASE_URL        = "            "
REACT_APP_FIREBASE_PROJECT_ID          = "            "
REACT_APP_FIREBASE_STORAGE_BUCKET      = "            "
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "            "
REACT_APP_FIREBASE_APP_ID              = "            "
REACT_APP_FIREBASE_MEASUREMENT_ID      = "            "
```

## Running

In the project directory, you can run:

`yarn start`

Starts the development server.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

## Deploy

In the project directory, you can run:

`yarn build`

Builds the app for production to the `build` folder, then you copy these files to your server.

You can take a look about [deployment](https://create-react-app.dev/docs/deployment/) for more information.

Since this project uses Firebase, you can choose [Firebase Hosting](https://firebase.google.com/docs/hosting/quickstart). 

## Updating scores


### Cloud Functions 

This project uses Cloud Functions to fetch scores for the matches and trigger user score updates.\
Repository and install instruccions for [qatar2022-pool-functions](https://github.com/ionmx/qatar2022-pool-functions).

### Manually

You can run update scores script

```node update-scores.js```

[Detailed instructions](https://github.com/ionmx/qatar2022-pool/blob/main/utils/update-scores/config.json)

## Contribute

Your help is very welcome, feel free to send a pull request.
