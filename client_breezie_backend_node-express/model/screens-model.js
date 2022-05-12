const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const screenSchema = new Schema({
    userId:{
        type:String
    },
    hidden:{
        type:Boolean
    },
    selected: {
        type: String,
    },
    imagePath: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('screens', screenSchema)