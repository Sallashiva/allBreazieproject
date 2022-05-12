const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceLocationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'registers'
    },
    locations: {
        officeName: {
            type: String,
        },
        address: {
            type: String,
        },
        timeZone: {
            type: String,
        },
    },
    deviceIdentifier: {
        type: String,
    },
    devices: {
        deviceName: {
            type: String,
            default: "Reception"
        },
        employeeInandOut: {
            type: Boolean,
            default: false
        },
        visitorInandOut: {
            type: Boolean,
            default: true
        },
        deliveries: {
            type: Boolean,
            default: false
        },
        catering: {
            type: Boolean,
            default: false
        },
    },
    isConnected:{
        type: Boolean,
        default: false
    },
    totalDevice:{
        type: Number,
        default: 0
    },
    deviceInformation: {
        deviceName: {
            type: String,
            default: null
        },
        SwipedOn: {
            type: String,
        },
        iOSVersion: {
            type: String,
        },
        device: {
            type: String,
        },
        lastActivity: {
            type: String,
        },
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('devicelocation', deviceLocationSchema)