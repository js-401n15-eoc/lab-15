'use strict';

const express = require('express');
const router = express.Router();
const handlers = require('./handlers.js');
const modelFinder = require('../middleware/model-finder.js');

router.param('model', modelFinder);

router.get('/:model', handlers.getAll);
router.get('/:model/:id', handlers.getOne);
router.post('/:model', handlers.createRecord);
router.put('/:model/:id', handlers.updateRecord);
router.delete('/:model/:id', handlers.deleteRecord);

module.exports = router;
