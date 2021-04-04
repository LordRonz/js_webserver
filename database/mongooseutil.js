"use strict";

const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false,
}, ()=>{
    console.log('Connected to DB');
});