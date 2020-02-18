'use strict';

module.exports = (err, req, res, next) => {
  const error = {
    text: 'Server crashed!',
    error: err,
  };
  res.status(500).json(error);
};
