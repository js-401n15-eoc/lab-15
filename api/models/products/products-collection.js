'use strict';

const Collection = require('../collection.js');
const schema = require('./products-schema.js');

class Products extends Collection {}

module.exports = new Products(schema);
