'use strict';

const express = require('express');
const router = express.Router();
const handlers = require('./handlers.js');
const modelFinder = require('../middleware/model-finder.js');

const bearerAuth = require('../../auth/middleware/bearer-auth-middleware.js');
const aclCheck = require('../../auth/middleware/acl-middleware.js');

router.param('model', modelFinder);

router.get('/:model', bearerAuth, aclCheck('read'), handlers.getAll);
router.get('/:model/:id', bearerAuth, aclCheck('read'), handlers.getOne);
router.post('/:model', bearerAuth, aclCheck('create'), handlers.createRecord);
router.put(
  '/:model/:id',
  bearerAuth,
  aclCheck('update'),
  handlers.updateRecord,
);
router.delete(
  '/:model/:id',
  bearerAuth,
  aclCheck('delete'),
  handlers.deleteRecord,
);

// router.param('model', modelFinder);

// router.get('/:model', handlers.getAll);
// router.get('/:model/:id', handlers.getOne);
// router.post('/:model', handlers.createRecord);
// router.put('/:model/:id', handlers.updateRecord);
// router.delete('/:model/:id', handlers.deleteRecord);

module.exports = router;
