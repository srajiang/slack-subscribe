# Sample App: Subscribe in slack

This sample application is built with Bolt JS framework and does a simple demonstration of using the Subscribe in Slack functionality.

#### Setup:
_prepare your development slack workspace_
1. (pre-GA) Ensure that workspace is flagged to test this feature (reach out to me).

_prepare your application_
1. For ease-of-development we recommend using ngrok: https://ngrok.com/  
2. Start an ngrok tunnel listening on port 3000, `ngrok http 3000` 
3. Update manifest.yml replacing `<your-domain-here>` with your domain (provided by ngrok)
4. Create a new Slack app from manifest
5. Add the following to your environment 
```
export = SLACK_SIGNING_SECRET=<add here>
export = SLACK_CLIENT_SECRET=<add here>
export = SLACK_CLIENT_ID=<add here>
export = SLACK_BOT_TOKEN=<add here>
export = DOMAIN_VERIFICATION=<add here>
```
6. Start the application, `npm start`
