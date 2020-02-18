'use strict';

const express = require('express');
const router = express.Router();
const oauth = require('../middleware/oauth-middleware.js');

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});

module.exports = router;
