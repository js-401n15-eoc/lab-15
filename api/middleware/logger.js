'use strict';

module.exports = (req, res, next) => {
  console.log(
    `Path: ${req.path}, Method: ${req.method}, Request Time: ${req.requestTime}`
  );
  next();
};
