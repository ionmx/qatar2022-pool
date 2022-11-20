## Update Scores script.

If you can't run Cloud Functions to update scores, you can use this script.

You will need to download your Service Account Private Key from Firebase Project Settings:

<img width="1620" alt="private-firekey" src="https://user-images.githubusercontent.com/119507/202869731-0165646c-a47b-4176-931b-288e52dcdab8.png">

Then update the config.json 
```
{
  "database_url": "https://YOUR-FIREBASE-RTDB-URL",
  "service_acount_file": "./YOUR-SERVICE-ACCOUNT-PRIVATE-KEY.json"
}
```

### Run

You can put this script on a cron or run it manually with:

```
node update-scores.js 
```
