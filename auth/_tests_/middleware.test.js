'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../../api/server.js');
const agent = supergoose(server);
const Users = require('../models/users.js');
const base64 = require('base-64');
const oauth = require('../middleware/oauth-middleware.js');
const bearerAuth = require('../middleware/bearer-auth-middleware.js');

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

describe('Auth Middleware', () => {
  it('allows a user to authenticate on github through oauth', () => {
    let req = {
      query: {
        code: '8ed12f5b4c6ffc167482',
      },
    };
    let res = {};
    let next = jest.fn();

    return oauth(req, res, next).then(() => {
      expect(next).toHaveBeenCalled();
    });
  });
});
