'use strict';

const notFoundMiddleware = (req, res, next) => {
  res.status(404).send('route not supported');
};

module.exports = notFoundMiddleware;
