const express = require('express');
const router = express.Router();
const urlController = require('../Controllers/urlController')


//POST API FOR url shorten  
router.post('/url/shorten', urlController.shortenUrl)

//GET API FOR redirect OR get orignal url
router.get('/:urlCode', urlController.getUrl)

module.exports = router;
