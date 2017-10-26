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
  console.log('EVENT_RECEIVED');


  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      entry.messaging.forEach(function(event) {
        id_user = event.sender.id;
        if (event.message) {
          if (userService.isUserKnown(id_user)) {
            userService.addUser(id_user, id_user);
            chatService.sendTextMessage(id_user, 'Bienvenue !\n' + event.message.text);
          } else {
            chatService.sendTextMessage(id_user, event.message.text);
          }
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
