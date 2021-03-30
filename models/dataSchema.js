const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    Age: {
        type: Number,
        required: false,
        min: 1,
        max: 255,
    },
    Age1stCode: {
        type: Number,
        required: false,
        min: 1,
        max: 255,
    },
    Country: {
        type: String,
        required: false,
        max: 40,
    },
    DatabaseDesireNextYear: {
        type: String,
        required: false,
        max: 500,
    },
    DatabaseWorkedWith: {
        type: String,
        required: false,
        max: 500,
    },
    DevType: {
        type: String,
        required: false,
        max: 500,
    },
    Employment: {
        type: String,
        required: false,
        max: 500,
    },
    Gender: {
        type: String,
        required: false,
        max: 20,
    },
    LanguageDesireNextYear: {
        type: String,
        required: false,
        max: 200,
    },
    LanguageWorkedWith: {
        type: String,
        required: false,
        max: 200,
    },
    MiscTechDesireNextYear: {
        type: String,
        required: false,
        max: 200,
    },
    MiscTechWorkedWith: {
        type: String,
        required: false,
        max: 200,
    },
    OpSys: {
        type: String,
        required: false,
        max: 200,
    },
    PlatformWorkedWith: {
        type: String,
        required: false,
        max: 200,
    },
    UndergradMajor: {
        type: String,
        required: false,
        max: 200,
    },
    WebframeDesireNextYear: {
        type: String,
        required: false,
        max: 200,
    },
    WebframeWorkedWith: {
        type: String,
        required: false,
        max: 200,
    },
    YearsCode: {
        type: Number,
        required: false,
        min: 1,
        max: 255,
    },
    YearsCodePro: {
        type: Number,
        required: false,
        min: 1,
        max: 255,
    },
}, { versionKey: false });

module.exports = mongoose.model('datas', dataSchema);