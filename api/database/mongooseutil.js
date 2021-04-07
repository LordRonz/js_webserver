const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    ssl: true,
}, (e) => {
    if (e) console.log(e);
    console.log('Connected to DB');
});
