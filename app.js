
const { App, WorkflowStep } = require('@slack/bolt');
const fs = require('fs');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

app.event('reaction_added', async ({ event, client }) => {
  try {

    // Call the conversations.history method using the built-in WebClient
    const result = await client.conversations.history({
      channel: event.item.channel,
      latest: event.item.ts,
      inclusive: true, // Limit the results to only one
      limit: 1
    });

    // There should only be one result (stored in the zeroth index)
    const message = result.messages[0];

    let rawdata = fs.readFileSync("/Users/karthikkalyanaraman1/titan/src/data.json");
    let data = JSON.parse(rawdata);

    if(message.reactions[0].name.toUpperCase() === "SOLANA") {
      message.reactions[0].name = "SOL"
    }
    
    let payload = {
      "description": message.text,
      "title": message.text.substring(0, 10) + "...",
      "token": message.reactions[0].name.toUpperCase()
    }

    data.push(payload)

    fs.writeFile ("/Users/karthikkalyanaraman1/titan/src/data.json", JSON.stringify(data), function(err) {
      if (err) throw err;
      console.log('complete');
      }
    );
  }
  catch(e) {
    console.log('error:', e);
  }
});

(async () => {
  // Start your app
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();