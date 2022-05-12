const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    userId: {
        type: String,
    },
    fullName: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true,
        unique: true
    },
    role: {
        type: String,
    },
    defaultAdmin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
    },
    locationId: {
        type: Schema.Types.ObjectId
        // type: String,
    },
    locationName: {
        type: String,
    },
    assistantEmail: {
        type: String,
    },
    assistSms: {
        type: String,
    },
    deliveryIds: [{
        type: String,
    }, ],
    lastActivity: {
        recent: {
            type: String
        },
        time: {
            type: String
        },
    },
    loginTime: {
        type: String,
    },
    logoutTime: {
        type: String,
    },
    isRemoteUser: {
        type: String,
    },
    isRemote:{
        type: Boolean,
    },
    isDeliveryPerson: {
        type: Boolean,
        default: false,
    },
    isCatering:{
        type: Boolean,
        default: false,
    },
    isAnonymized: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    archivedate:{
        type: String,
    },
    acceess:{
        type: Boolean,
    },
    password: {
        type: String,
    },
    ExtraFields:[],

    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("employee", employeeSchema);