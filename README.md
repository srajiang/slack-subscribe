# sample subscribe in slack

To setup:
0. Start ngrok on Port 3000 
1. Setup a Slack app with domain verification enabled

2. Add .env file to root with following:
```
SLACK_SIGNING_SECRET=
SLACK_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_BOT_TOKEN=
DOMAIN_VERIFICATION=
```

3. `npm start`