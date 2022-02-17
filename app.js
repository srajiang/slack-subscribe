/**
 * This sample demonstrates a Slack app which uses the Subscribe in Slack functionality
 * I have stubbed out or left comments indicating functionality for databases or 
 * validations that aren't implemented for sample purposes but should be implemented for
 * full functionality
 * */
const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
const app = new App({
  clientId: process.env.SLACK_CLIENT_ID,
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
  logLevel: LogLevel.DEBUG,
});

// handle domain challenge verification
receiver.router.get('/slack-challenge/*.html', (req, res) => {
  res.send(`slack-domain-verification=${process.env.DOMAIN_VERIFICATION}`);
});

// Test view that approximates options for user to configure notifications
const getNotificationView = (resource, viewId, viewOptions) => {
  const viewTitle = viewId.split('_').join(' ');

  return {
    "type": 'app_notification_subscription_configuration', // must be set to this type
    "callback_id": viewId,
    "private_metadata": resource,
    "title": {
      "type": "plain_text",
      "text": viewTitle,
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": viewOptions ?? `${resource}\n\n[Options for configuring this subscription go here]`
      },
    }],
  }
};

/* Handlers */
const handleCreate = async ({ body, ack, say, configure }) => {
  // acknowledge the event as an interaction payload
  await ack();
  
  /* recommended - validate the user and request */
  // if (getUserOptions(body.user) === undefined) {
    // say(`You don't have permission to set up this notification`);
    // return;

  // persist sub request to db
  // await saveSubscriptionRequest(body);

  // TODO: build subscription options
  let subOptions;

  const { notification_subscription: { resource_link } } = body;
  // open a view to present user options for configuring their notification subscription
  configure(getNotificationView(resource_link, "new_notification", subOptions)); 
};

const handleConfigure = async ({ body, ack, configure }) => {
  await ack();
  // recommended - validate the user and request

  // fetch existing sub from database and get options
  let subOptions;

  const { notification_subscription: { id } } = body;
  // open view to present user options to configure notification subscription
  configure(getNotificationView(id, "existing_notification", subOptions));
};

const handleDeleted = async ({ body, ack }) => {
  await ack();
  // Optional code to trigger other processes when a user has deleted their slack subscription
  // Update database write to reflect sub has been deleted
};

/* Stub mock external calls */
const callExternalApi = async ({ payload }) => {
  console.log('CALLING EXT API');
}

/* Registration of subscription middlewares includes handler logic for three Slack interaction payloads 
 * 1. A new subscription notification create requested by user 
 * 2. An existing subscription notification updated requested by user
 * 3. User has deleted an existing subscription notification
*/
app.subscription({
  onCreate: [handleCreate, callExternalApi],
  onConfigure: handleConfigure,
  onDeleted: handleDeleted,
});

/* Handle view submissions */
app.view('new_notification', async ({ ack, body, client, }) => {
  await ack();
  const { trigger_id, view: { private_metadata }} = body;

  // call Slack api method to finalize sub creation
  try {
    const res = await client.apps.notifications.subscriptions.create({
      token: process.env.SLACK_BOT_TOKEN,
      trigger_id,
      channel_id: 'C02ULENDFB6',
      name: private_metadata,
      type: {
        name: private_metadata,
        label: 'New Notification',
      },
      resource_link: private_metadata,
    });

    console.log('Create success: ', res);
    // save subscription to your db 
    // const { notification_subscription } = res;
    // await saveSubscription(notification_subscription.id);
  } catch (error) {
    console.log('Error creating', error);
  }
});

app.view('existing_notification', async ({ ack, client, body, view }) => {
  await ack();
  const { trigger_id } = body;
  const { private_metadata } = view;

  console.log('VIEW SUBMISSION', view);
  console.log('private_metadata' in view)
  console.log('private metadata', view.private_metadata);
  try {
    const res = await client.apps.notifications.subscriptions.update({
      token: process.env.SLACK_BOT_TOKEN,
      trigger_id,
      notification_subscription_id: private_metadata,
      channel_id: 'C02ULENDFB6',
    });
    console.log('Update success: ', res);
  } catch (error) {
    console.log('Error updating', error.data)
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log( `⚡️ Bolt app is running!` );
})();