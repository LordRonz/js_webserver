const { ObjectId } = require('mongodb');
const Data = require('./dataSchema');

const findAll = async (page) => {
    const lim = 20;
    const count = await Data.countDocuments();
    const totalPages = Math.ceil(count / lim);
    if (page && typeof page === 'number' && page > 0 && page <= totalPages) {
        const res = await Data.find()
            .limit(lim)
            .skip((page - 1) * lim)
            .exec();
        return res;
    }
    const res = await Data.find();
    return res;
};

const findById = async (id) => {
    const res = await Data.findOne({ _id: ObjectId(id) });
    return res;
};

const create = async (data) => {
    let newData = {};
    if (Array.isArray(data)) {
        if (data.length > 1000) return null;
        newData = await Data.insertMany(data);
        return newData;
    }
    newData = new Data(data);
    const savedData = await newData.save();
    return savedData;
};

const replace = async (filter, data) => {
    const updatedData = await Data.findOneAndReplace(filter, data, {
        new: true,
    });
    return updatedData;
};

const update = async (filter, data) => {
    const updatedData = await Data.findOneAndUpdate(filter, data, {
        new: true,
    });
    return updatedData;
};

const del = async (filter) => {
    const res = await Data.deleteOne(filter);
    return res;
};

module.exports = {
    findAll,
    findById,
    create,
    replace,
    update,
    del,
};
