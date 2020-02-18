'use strict';

const base64 = require('base-64');
const Users = require('../models/users.js');

module.exports = (req, res, next) => {
  // console.log('What are req.headers?', req.headers);
  if (!req.headers.authorization) {
    res.status(403).send('invalid login');
    next('invalid login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, password] = base64.decode(basic).split(':');
  // console.log('Are we down here?', user, password);
  Users.authenticateBasic(user, password)
    .then(validUser => {
      req.token = validUser.generateToken();
      next();
    })
    .catch(err => next(`Invalid Login! ${err}`));
};
