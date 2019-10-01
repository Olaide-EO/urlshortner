const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const URLSchema = new Schema({
    originalURL: {type: String},
    shortURL: {type: String}
}, {timestamps: true});

const modelClass = mongoose.model('shortURL', URLSchema);

module.exports = modelClass;