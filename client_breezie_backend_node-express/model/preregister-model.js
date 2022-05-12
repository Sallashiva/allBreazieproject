const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preregisterSchema = new Schema({

    fullName: {
        type: String
    },
    companyName: {
        type: String
    },
    dateOfVisit: {
        type: Date
    },
    dateOut:{
        type: Date
    },
    location: {
        type: String
    },
    locationId:{
        type: Schema.Types.ObjectId,
        ref: 'devicelocations'
    },
    visitingHost: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'registers'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('preregister', preregisterSchema)