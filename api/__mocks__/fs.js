'use strict';

module.exports = exports = {};

exports.existsSync = path => {
  return (
    path === `${__dirname}/../models/products/products-collection.js` ||
    path === `${__dirname}/../models/categories/categories-collection.js`
  );
};
