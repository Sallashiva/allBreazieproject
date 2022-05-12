const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rememberVisitorSchema = new Schema({
    FullName: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true
    },
    role: {
        type: String,
        default: "Visitor"
    },
    CompanyName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    lastActivity: {
        recent: {
            type: String
        },
        time: {
            type: String
        },
    },
    Extrafields: {
        type: Array,
    },
    DigitalSignature: {
        type: String
    },
    EmailId: {
        type: String,
        minLength: 5,
        maxLength: 30,
    },
    Visited: {
        type: String,
    },
    HostName: {
        type: String,
    },
    VisitorImage: {
        type: String
    },
    Category: {
        type: String
    },
    isAnonymized: {
        type: Boolean,
        default: false
    },
    location: {
        type: String
    },
    locationId:{
        type: Schema.Types.ObjectId,
        ref: 'devicelocations'
    },
    refreshmentData: {
        cateringOrder:[],
        totalPrice:{
            type: String
        },
        duration:{
            type: String
        }
    },
    loginTime: {
        type: String
    },
    logoutTime: {
        type: String
    },
    userId: {
        type: String
    },
    reject: {
        type: Boolean,
        default: false
    },
    isPending: {
        type: Boolean,
        default: false
    },
    rememberMe: {
        type: Boolean,
        default: true
    },
    visitorId:{
        type: Schema.Types.ObjectId
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('rememberVisitor', rememberVisitorSchema)