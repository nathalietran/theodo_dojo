var express = require('express');
var router = express.Router();
const chatService = require('../server/chatService');

/* GET hello world page. */
router.get('/', function(req, res, next) {
  if (chatService.authenticate(req)) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

router.post('/', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {


      entry.messaging.forEach(function(event) {
        if (event.message) {
          chatService.sendTextMessage(event.sender.id, event.message.text);
        } else {
          console.log('...');
        }
      })
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

module.exports = router;
