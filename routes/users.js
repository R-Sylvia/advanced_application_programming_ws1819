var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource and other test');
  res.render('users', {'messages':messages, 'title':'Users'});
});

module.exports = router;

var Message = function(author, text) {
    this.Author = author;
    this.Text = text;
};

var messages = [];

module.exports.init = function() {
    messages.push(new Message('user1', 'first message text'));
    messages.push(new Message('user2', 'second message text'));
    messages.push(new Message('user3', 'third message text'));
}
