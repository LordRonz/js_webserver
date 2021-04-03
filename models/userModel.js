const { ObjectId } = require('mongodb');
const User = require('./userSchema');


async function create(user) {
    try {
        const newUser = new User(user);
        const savedUser = await newUser.save();
        return savedUser;
    } catch(err) {
        throw err;
    }
}

function login(user) {

}

async function findUser(username) {
    try {
        const res = await User.findOne({'username': username});
        return res;
    } catch(err) {
        throw err;
    }
}

async function del(filter) {
    try {
        const res = await User.deleteOne(filter);
        return res;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    create,
    login,
    findUser,
    del,
}