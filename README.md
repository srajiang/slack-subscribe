# sample subscribe in slack

To setup:
1. Start ngrok on Port 3000 
2. Setup a Slack app with domain verification enabled

3. Add .env file to root with following:
```
SLACK_SIGNING_SECRET=
SLACK_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_BOT_TOKEN=
DOMAIN_VERIFICATION=
```

4. `npm start`