const { ObjectId } = require('mongodb');
const Data = require('./dataSchema');

async function findAll(page) {
    try {
        const count = await Data.countDocuments();
        const lim = 20;
        const totalPages = Math.ceil(count / lim);
        if(page && page > 0 && page <= totalPages) {
            const res = await Data.find()
            .limit(lim)
            .skip((page - 1) * lim)
            .exec();
            return res;
        }
        const res = await Data.find();
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

async function replace(filter, data, option) {
    try {
        const updatedData = await Data.findOneAndReplace(filter, data, {
            new: true,
        });
        return updatedData;
    } catch(err) {
        throw err;
    }
}

async function update(filter, data, option) {
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
    replace,
    update,
    del,
};