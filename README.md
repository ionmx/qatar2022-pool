# QATAR 2022 FIFA World Cup Pool

Web application to manage QATAR 2022 FIFA World Cup Pool.

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


## Install

* First you need to setup a [Firebase Realtime Database](https://firebase.google.com/).
* Import `initial-data/qatar2022.json` to your database.
* Create a `env.local` file with your Firebase config:
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


## Contribute

Your help is very welcome, feel free to send a pull request.
