var express = require('express');
var router = express.Router();
const chatService = require('../server/chatService');
const userService = require('../server/userService');

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
      id_user = event.sender.id
      entry.messaging.forEach(function(event) {
        if (event.message) {
          console.log(event.sender);
          chatService.sendTextMessage(id_user, event.message.text);
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
