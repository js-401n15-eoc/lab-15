'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const agent = supergoose(server.authServer);
const Users = require('../models/users.js');
const base64 = require('base-64');

describe('auth server routes', () => {
  let signinObj;
  let signinObj2;

  beforeEach(async () => {
    signinObj = {
      username: 'john',
      password: 'blue',
    };

    signinObj2 = {
      username: 'bob',
      password: 'saget',
    };
    await Users.deleteMany({}).exec();
  });

  it('can allow a new user to sign up', () => {
    return agent
      .post('/signup')
      .send(signinObj)
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  it('can allow an existing user to sign in', async () => {
    const user1 = new Users(signinObj);
    await user1.save();

    const autHeader = base64.encode(
      `${signinObj.username}:${signinObj.password}`,
    );

    return agent
      .post('/signin')
      .set('authorization', `Basic ${autHeader}`)
      .then(response => {
        expect(!!response.text).toEqual(true);
        expect(response.statusCode).toBe(200);
      });
  });

  it('can return all users', async () => {
    const user1 = new Users(signinObj);
    const user2 = new Users(signinObj2);
    await user1.save(signinObj);
    await user2.save(signinObj2);

    const autHeader = base64.encode(
      `${signinObj.username}:${signinObj.password}`,
    );

    return agent
      .get('/users')
      .set('authorization', `Basic ${autHeader}`)
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.count).toEqual(2);
        expect(response.body.results[0].username).toEqual('john');
        expect(response.body.results[1].username).toEqual('bob');
      });
  });

  it('will return a blank object without authorization headers', async () => {
    const user1 = new Users(signinObj);
    const user2 = new Users(signinObj2);
    await user1.save(signinObj);
    await user2.save(signinObj2);

    return agent.get('/users').then(response => {
      expect(response.statusCode).toEqual(403);
      expect(response.body).toEqual({});
    });
  });

  // it('can allow someone to sign in with oauth', async () => {
  //   const user1 = new Users(signinObj);
  //   await user1.save(signinObj);

  //   return agent.get('/oauth').then(response => {
  //     console.log('Do we have a body?', response.body);
  //   });
  // });
});
