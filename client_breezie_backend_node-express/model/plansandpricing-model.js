const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plansSchema = new Schema({
    name: {
        type: String,
        default: null,
    },
    location: {
        type: String,
        default: null,
    },
    ipad: {
        type: String,
        default: null,
    },
    qrcode: {
        type: String,
        default: null,
    },
    employees: {
        type: String,
        default: null,
    },
    DisplayName: {
        type: String,
        default: null,
    },
    contactlessSignIn: {
        type: Boolean,
        default: null,
    },
    vaccinationProofUpload: {
        type: Boolean,
        default: null,
    },
    employeeScreening: {
        type: Boolean,
        default: null,
    },
    remoteWorking: {
        type: Boolean,
        default: null,
    },
    multipleVisitoflows: {
        type: Boolean,
        default: null,
    },
    integrations: {
        type: Boolean,
        default: null,
    },
    price: [{
        currency: {
            type: String,
            default: null,
        },
        monthlyprice: {
            type: Number,
            default: null,
        },
        annualprice: {
            type: Number,
            default: null,
        },
    }, ],
    planId: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const addOnSchema = new Schema({
    name: {
        type: String,
        default: null,
    },
    price: [{
        currency: {
            type: String,
            default: null,
        },
        monthlyprice: {
            type: Number,
            default: null,
        },
        annualprice: {
            type: Number,
            default: null,
        },
    }, ],
    addOnId: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const plansandpricing = mongoose.model("plansandpricing", plansSchema);
const addOn = mongoose.model("addOn", addOnSchema);

module.exports = {
    plansandpricing,
    addOn,
};