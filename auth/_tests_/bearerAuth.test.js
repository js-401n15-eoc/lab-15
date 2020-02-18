'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../../api/server.js');
const agent = supergoose(server.apiServer);
const Users = require('../models/users.js');
const base64 = require('base-64');

describe('bearer auth routes', () => {
  let superUserObj;
  let dummyToken;

  const superuserSetup = async () => {
    await agent.post('/signup').send(superUserObj);
    const authHeader = base64.encode(
      `${superUserObj.username}:${superUserObj.password}`,
    );
    await agent.post('/signin').set('authorization', `Basic ${authHeader}`);
  };

  beforeEach(async () => {
    superUserObj = {
      username: 'bob',
      password: 'saget',
      role: 'godEmperor',
    };

    dummyToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsImlhdCI6MTU4MjAwNjY4NH0.JCrt5ATPQ577dUcrQ-wYTQzQAvLNplIF9a0ZFIqPCUY';

    await superuserSetup();
  });

  it('can access the public page without authentication or authorization', () => {
    return agent.get('/public').then(res => {
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('public page for anyone');
    });
  });

  it('can access the secret page after logging in', () => {
    return agent.get('/secret')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You have access to the secret route. Shhh!`);
      });
  });

  it('can access the private page after logging in', () => {
    return agent.get('/private')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`Hi, ${superUserObj.username}. Here is the private page!`);
      });
  });

  it('can access the readonly page after logging in', () => {
    return agent.get('/readonly')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You (${superUserObj.username}) can read! Whoo!`);
      });
  });

  it('can access the create page after logging in', () => {
    return agent.post('/create')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You (${superUserObj.username}) can create! Whoo!`);
      });
  });

  it('can access the update (put) page after logging in', () => {
    return agent.put('/update')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You (${superUserObj.username}) can put! Whoo!`);
      });
  });

  it('can access the update (patch) page after logging in', () => {
    return agent.patch('/update')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You (${superUserObj.username}) can patch! Whoo!`);
      });
  });

  it('can access the delete page after logging in', () => {
    return agent.delete('/delete')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You (${superUserObj.username}) can delete! Bye-bye!`);
      });
  });

  it('can access the everything page after logging in as a superuser', () => {
    return agent.get('/everything')
      .set('authorization', `bearer ${dummyToken}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(`You (${superUserObj.username}) can do everything! Mwa ha ha ha!`);
      });
  });
});