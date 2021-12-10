const express = require('express');
const router = express.Router();
const urlController = require('../Controllers/urlController')
const redirect = require('../Controllers/redirect')

//POST API FOR url shorten  
router.post('/url/shorten', urlController.shortenUrl)

//GET API FOR redirect OR get orignal url
router.get('/:urlCode', redirect.getUrl)

module.exports = router;
