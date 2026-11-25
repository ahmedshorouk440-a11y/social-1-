"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseRepositry = void 0;
class DataBaseRepositry {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    findOne({ filter, select, populate, }) {
        let query = this.model.findOne(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    findAll({ filter, select, populate }) {
        let query = this.model.find(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    findById({ id, select, populate, }) {
        let query = this.model.findById(id);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    updateOne({ filter, update }) {
        return this.model.updateOne(filter, update);
    }
    updateMany({ filter, update, }) {
        return this.model.updateMany(filter, update);
    }
    updateById({ id, update }) {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }
    deleteOne({ filter }) {
        return this.model.deleteOne(filter);
    }
    deleteById({ id }) {
        return this.model.findByIdAndDelete(id);
    }
}
exports.DataBaseRepositry = DataBaseRepositry;
