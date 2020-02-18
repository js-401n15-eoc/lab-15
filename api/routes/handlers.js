'use strict';

let handlers = {};

handlers.getAll = (req, res) => {
  req.model
    .get()
    .then(results => {
      let output = {
        count: results.length,
        results,
      };
      res.status(200).json(output);
    })
    .catch(error => console.error(error));
};

handlers.getOne = (req, res) => {
  req.model
    .get(req.params.id)
    .then(record => {
      res.status(200).json(record);
    })
    .catch(error => console.error(error));
};

handlers.createRecord = (req, res, next) => {
  let record = req.body;
  req.model
    .create(record)
    .then(createdRecord => {
      res.status(201).json(createdRecord);
    })
    .catch(error => next(error));
};

handlers.updateRecord = (req, res, next) => {
  req.model
    .update(req.params.id, req.body)
    .then(updatedRecord => {
      res.status(200).json(updatedRecord);
    })
    .catch(error => next(error));
};

handlers.deleteRecord = (req, res, next) => {
  req.model
    .delete(req.params.id)
    .then(() => {
      res.status(204).send('deleted');
    })
    .catch(error => next(error));
};

module.exports = handlers;
