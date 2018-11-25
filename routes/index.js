let express = require('express');
let router = express.Router();

let path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile(__dirname + '/index.html');

});

router.use(express.static("public"));

module.exports = router;
