'use strict';

const oauth = require('../middleware/oauth-middleware.js');

describe('Oauth Middleware', () => {
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
