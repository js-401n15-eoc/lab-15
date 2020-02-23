'use strict';

class Collection {
  constructor(schema) {
    this.database = [];
    this.schema = schema;
  }

  get(id) {
    return id ? this.schema.findOne({ _id: id }) : this.schema.find({});
  }

  create(record) {
    const newRecord = new this.schema(record);
    return newRecord.save();
  }

  update(id, record) {
    return this.schema.findByIdAndUpdate(id, record, { new: true });
  }

  delete(id) {
    return this.schema.findByIdAndDelete(id);
  }
}

module.exports = Collection;
