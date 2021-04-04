"use strict";

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    Age: {
        type: Number,
        required: false,
        min: -1,
        max: 255,
        default: -1,
    },
    Age1stCode: {
        type: Number,
        required: false,
        min: -1,
        max: 255,
        default: -1,
    },
    Country: {
        type: String,
        required: false,
        max: 40,
        default: "",
    },
    DatabaseDesireNextYear: {
        type: String,
        required: false,
        max: 500,
        default: "",
    },
    DatabaseWorkedWith: {
        type: String,
        required: false,
        max: 500,
        default: "",
    },
    DevType: {
        type: String,
        required: false,
        max: 500,
        default: "",
    },
    Employment: {
        type: String,
        required: false,
        max: 500,
        default: "",
    },
    Gender: {
        type: String,
        required: false,
        max: 20,
        default: "",
    },
    LanguageDesireNextYear: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    LanguageWorkedWith: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    MiscTechDesireNextYear: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    MiscTechWorkedWith: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    OpSys: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    PlatformWorkedWith: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    UndergradMajor: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    WebframeDesireNextYear: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    WebframeWorkedWith: {
        type: String,
        required: false,
        max: 200,
        default: "",
    },
    YearsCode: {
        type: Number,
        required: false,
        min: -1,
        max: 255,
        default: -1,
    },
    YearsCodePro: {
        type: Number,
        required: false,
        min: -1,
        max: 255,
        default: -1,
    },
}, { versionKey: false });

module.exports = mongoose.model('datas', dataSchema);