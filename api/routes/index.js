var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});
