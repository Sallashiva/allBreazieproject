const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const newVisitorSchema = new Schema({
    fullName:{
        type:String
    },
    companyName:{
        type:String
    },
    location:{
        type:String
    },
    visiting:{
        type:String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('newVisitor', newVisitorSchema)
