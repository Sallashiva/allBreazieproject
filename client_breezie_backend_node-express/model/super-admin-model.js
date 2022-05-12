const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superAdminSchema = new Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    emailId: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    otp: {
        type: Number,
        minLength: 6
    },
    expireTime: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('super-admin', superAdminSchema)