const { ObjectId } = require('mongodb');
const { client } = require('../database/database');
const Data = require('./dataSchema');

async function findAll() {
    try {
        const res = await Data.find().limit();
        return res;
    } catch(err) {
        throw err;
    }
}

async function findById(id) {
    try {
        const res = await Data.findOne({ _id: ObjectId(id) });
        return res;
    } catch(err) {
        throw err;
    }
}

async function create(data) {
    try {
        let newData = {};
        if(Array.isArray(data)) {
            newData = await Data.insertMany(data);
            return newData;
        }
        newData = new Data(data);
        const savedData = await newData.save();
        return savedData;
    } catch(err) {
        throw err;
    }
}

async function update(filter, data, option=null) {
    try {
        const updatedData = await Data.findOneAndUpdate(filter, data, {
            new: true,
        });
        return updatedData;
    } catch(err) {
        throw err;
    }
}

async function del(filter) {
    try {
        const res = await Data.deleteOne(filter);
        return res;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    del,
};