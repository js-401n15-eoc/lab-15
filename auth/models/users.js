'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const acl = require('./acl.js');
let secret = 'thisislab14bbq';

const Users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    default: 'guest',
    enum: ['admin', 'editor', 'producer', 'guest', 'godEmperor'],
  },
});

// mongo pre-save
Users.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 5);
});

// anything.statics.whatever === static or class method
Users.statics.authenticateBasic = async function(username, password) {
  try {
    let query = { username };
    let user = await this.findOne(query);
    if (user) {
      let isValid = bcrypt.compare(password, user.password);
      if (isValid) {
        return user;
      } else {
        throw 'Invalid User';
      }
    } else {
      throw 'Invalid User';
    }
  } catch (err) {
    console.error(err);
  }
};

// anything.methods.whatever === instance method
Users.methods.generateToken = function() {
  // Use the user stuff (this) to make a token.
  let userObject = {
    username: this.username,
  };
  return jwt.sign(userObject, secret);
};

Users.statics.authenticateWithToken = async function(token) {
  try {
    let tokenObject = jwt.verify(token, secret);
    let user = await this.findOne({ username: tokenObject.username });
    return user;
  } catch (e) {
    throw e.message;
  }
};

Users.virtual('accesses', acl[this.role]);

Users.methods.can = function(task) {
  return acl.schema.obj[this.role].includes(task);
};

module.exports = mongoose.model('users', Users);
