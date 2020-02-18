'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const agent = supergoose(server.apiServer);
const categories = require('../models/categories/categories-collection.js');
const products = require('../models/products/products-collection.js');

describe('bad API routes', () => {
  let badObj;
  let goodObj;
  beforeEach(async () => {
    goodObj = {
      name: 'mythical_weapons',
      display_name: 'mythical weapons',
      description: 'smite thee!',
    };

    badObj = {
      name: 'bad object',
      description: 'gonna FAAAAAAAAIL!',
      badProp: 'should not have this',
    };
    await categories.schema.deleteMany({}).exec();
  });

  it('can return a 500 on a failed post', () => {
    return agent
      .post('/api/v1/categories')
      .send(badObj)
      .then(response => expect(response.statusCode).toBe(500))
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can return a 500 on a failed update', () => {
    return agent
      .post(`/api/v1/categories`)
      .send(goodObj)
      .then(() =>
        agent
          .put(`/api/v1/categories/-12345`)
          .send(badObj)
          .then(response => expect(response.statusCode).toBe(500)),
      )
      .catch(error => expect(error).not.toBeDefined());
  });
});

describe('API routes for categories', () => {
  let testObj1;
  let testObj2;

  beforeEach(async () => {
    testObj1 = {
      name: 'mythical_weapons',
      display_name: 'mythical weapons',
      description: 'smite thee!',
    };

    testObj2 = {
      name: 'household_goods',
      display_name: 'household goods',
      description: 'stuff fo yo crib!',
    };

    await categories.schema.deleteMany({}).exec();
  });

  it('can post a category', () => {
    return agent
      .post('/api/v1/categories')
      .send(testObj1)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(!!response.body._id).toEqual(true);
        Object.keys(testObj1).forEach(key => {
          expect(testObj1[key]).toEqual(response.body[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get all categories', async () => {
    await categories.schema(testObj1).save();
    await categories.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    return agent
      .get('/api/v1/categories')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let index in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(memDb[index][key]).toEqual(
              response.body.results[index][key],
            );
          });
        }
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get one category', () => {
    return agent
      .post(`/api/v1/categories/`)
      .send(testObj1)
      .then(createRes =>
        agent.get(`/api/v1/categories/${createRes.body._id}`).then(response => {
          expect(response.statusCode).toBe(200);
          Object.keys(testObj1).forEach(key => {
            expect(testObj1[key]).toEqual(response.body[key]);
          });
        }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can update a category', () => {
    const editObj = {
      name: 'uber_weapons',
      display_name: 'uber weapons',
      description: 'cool beans',
    };

    return agent
      .post(`/api/v1/categories/`)
      .send(testObj1)
      .then(createRes =>
        agent
          .put(`/api/v1/categories/${createRes.body._id}`)
          .send(editObj)
          .then(response => {
            expect(response.statusCode).toBe(200);
            Object.keys(editObj).forEach(key => {
              expect(response.body[key]).toEqual(editObj[key]);
            });
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can delete a category', () => {
    return agent
      .post(`/api/v1/categories/`)
      .send(testObj1)
      .then(createRes =>
        agent
          .delete(`/api/v1/categories/${createRes.body._id}`)
          .then(response => {
            expect(response.statusCode).toBe(204);
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });
});

describe('API routes for products', () => {
  let testObj1;
  let testObj2;

  beforeEach(async () => {
    testObj1 = {
      category_id: 'mythical_weapons',
      price: 9999,
      weight: 42.3,
      quantity_in_stock: 1,
    };

    testObj2 = {
      category_id: 'household_goods',
      price: 3,
      weight: 0.5,
      quantity_in_stock: 111,
    };

    await products.schema.deleteMany({}).exec();
  });

  it('can post a product', () => {
    return agent
      .post('/api/v1/products')
      .send(testObj1)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(!!response.body._id).toEqual(true);
        Object.keys(testObj1).forEach(key => {
          expect(testObj1[key]).toEqual(response.body[key]);
        });
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get all products', async () => {
    await products.schema(testObj1).save();
    await products.schema(testObj2).save();
    let memDb = [testObj1, testObj2];

    return agent
      .get('/api/v1/products')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(2);
        for (let index in response.body.results) {
          Object.keys(testObj1).forEach(key => {
            expect(memDb[index][key]).toEqual(
              response.body.results[index][key],
            );
          });
        }
      })
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can get one product', () => {
    return agent
      .post(`/api/v1/products`)
      .send(testObj1)
      .then(createRes =>
        agent.get(`/api/v1/products/${createRes.body._id}`).then(response => {
          expect(response.statusCode).toBe(200);
          Object.keys(testObj1).forEach(key => {
            expect(testObj1[key]).toEqual(response.body[key]);
          });
        }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can update a product', () => {
    const editObj = {
      category_id: 'uber_weapons',
      price: 333,
      weight: 42.5,
      quantity_in_stock: 3,
    };

    return agent
      .post(`/api/v1/products`)
      .send(testObj1)
      .then(createRes =>
        agent
          .put(`/api/v1/products/${createRes.body._id}`)
          .send(editObj)
          .then(response => {
            expect(response.statusCode).toBe(200);
            Object.keys(editObj).forEach(key => {
              expect(response.body[key]).toEqual(editObj[key]);
            });
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });

  it('can delete a product', () => {
    return agent
      .post(`/api/v1/products`)
      .send(testObj1)
      .then(createRes =>
        agent
          .delete(`/api/v1/products/${createRes.body._id}`)
          .then(response => {
            expect(response.statusCode).toBe(204);
          }),
      )
      .catch(error => expect(error).not.toBeDefined());
  });
});
