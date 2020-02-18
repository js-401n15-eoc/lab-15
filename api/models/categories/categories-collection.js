'use strict';

const Collection = require('../collection.js');
const schema = require('./categories-schema.js');

class Categories extends Collection {}

module.exports = new Categories(schema);
