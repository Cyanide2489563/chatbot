const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
    channelAccessToken: 'HDYUYWQd0tD5EDSYryrwK83/D8tpzmBbPzg5ZZ+u7/7SNCTNOdt5mjtlnJ//bZFJ3mc8T0A8yYLXQfHoQPqegI/luKGjaUG1vJdSaahrcbwm0s6KV3A973XF4exyDDXHNNfjT1Ry4zx1la36UVicBwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '355703bef6d6e6a93d9b278b68590e0f',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
    res.sendStatus(200);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };

    // use reply API
    return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});