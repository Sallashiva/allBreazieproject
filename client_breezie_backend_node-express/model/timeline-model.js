const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timelineSchema = new Schema({
    userId: {
        type: String,
    },
    employeeId: {
        type: String,
    },
    employeeName: {
        type: String,
    },
    loginTime: {
        type: String,
    },
    logoutTime: {
        type: String,
    },
    isRemote: {
        type: Boolean,
    },
    isRemoteUser: {
        type: Boolean,
    },
    closed: {
        type: Boolean,
    },
    device: {
        type: String,
    },
    locationId: {
        type: String,
    },
    locationName: {
        type: String,
    },
    signedOutMessage: {
        type: String,
    },
    signedInQuestion: [],
    employeeImage: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("timeline", timelineSchema);