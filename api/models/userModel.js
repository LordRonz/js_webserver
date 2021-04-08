const User = require('./userSchema');

const create = async (user) => {
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return { ...savedUser._doc, password: '********' };
};

const findUser = async (username) => {
    const res = await User.findOne({ username });
    return res;
};

const del = async (filter) => {
    const res = await User.deleteOne(filter);
    return res;
};

module.exports = {
    create,
    findUser,
    del,
};
