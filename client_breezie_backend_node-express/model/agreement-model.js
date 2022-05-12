const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agreementSchema = new Schema({
    pdf: {
        type: String
    },
    userId: {
        type: String
    },
    agreementName:{
        type: String
    },
    agreementData: {
        type: String
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('agreement', agreementSchema)