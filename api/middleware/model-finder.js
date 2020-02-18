'use strict';

let fs = require('fs');
const mockFs = require('../__mocks__/fs.js');

module.exports = (req, res, next) => {
  let modelName = req.params.model;
  let modelFileName = `${__dirname}/../models/${modelName}/${modelName}-collection.js`;

  if (req.mockFs) {
    fs = mockFs;
  }
  if (fs.existsSync(modelFileName)) {
    req.model = require(modelFileName);
    next();
  } else {
    next('invalid endpoint');
  }
};
