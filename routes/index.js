let express = require('express');
let router = express.Router();

let path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
   // res.sendFile(path.join(__dirname, '/../public/client.html'));
});

router.use(express.static("public"));

module.exports = router;
