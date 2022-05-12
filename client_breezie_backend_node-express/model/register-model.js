const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
    firstName: {
        type: String,
        minLength: 3,
        required: true
    },
    lastName: {
        type: String,
        minLength: 1,
        required: true
    },
    emailId: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        minLength: 8,
        required: true
    },
    companyName: {
        type: String,
        minLength: 3,
        maxLength: 30,
    },
    address: {
        type: String,
        minLength: 3,
        maxLength: 30,
    },
    agreeTerms: {
        type: Boolean,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    plan: {
        freeTrialUsed: {
            type: Boolean
        },
        planName: {
            type: String
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        packageType: {
            type: String
        },
        price: {
            type: Number
        },
        currency: {
            type: String
        },
        planId: {
            type: String
        },
        duration: {
            type: String
        },
        location: {
            type: Number
        }
    },
    totalLocation: {
        type: Number,
        default: 1
    },
    deliveryAddOn: {
        deliveryFreeTrialUsed: {
            type: Boolean,
            default: false
        },
        planName: {
            type: String
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        }
    },
    CateringAddOn: {
        cateringFreeTrialUsed: {
            type: Boolean,
            default: false
        },
        planName: {
            type: String
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        }
    },
    freeTrial: {
        activate: {
            type: Boolean,
            default: false
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        }
    },
    country: {
        type: String,
    },
    password: {
        type: String,
    },
    settingId: {
        type: String,
    },
    deviceAndLocationIds: [{
        type: String,
    }],
    agreementId: [{
        type: String,
    }],
    otp: {
        type: Number,
        minLength: 6
    },
    expireTime: {
        type: Number
    },
    accountId: {
        type: String,
    },
    planandpricingId: {
        type: String,
    },
    cateringId: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('register', registerSchema)