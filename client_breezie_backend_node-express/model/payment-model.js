const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    country: {
        type: String,
    },
    address: {
        street:{
            type: String,
        },
        state: {
            type: String,
        },
        zip: {
            type: String,
        },
        city: {
            type: String,
        }
    },
    phone: {
        type: String,
    },
    orderId: {
        type: String,
    },
    paymentId: {
        type: String,
    },
    signatureId: {
        type: String,
    },
    amount: {
        type: String,
    },
    currency: {
        type: String,
    },
    receipt: {
        type: String,
    },
    status: {
        type: String,
    },
    plans: {
        planId: {
            type: String,
        },
        locations: {
            type: Number,
        },
        duration: {
            type: String,
        },
        price: {
            type: String
        },
        planName: {
            type: String
        },
    },
    deliveryAddOn: {
        planName: {
            type: String
        },
        price: {
            type: String,
        },
        duration: {
            type: String,
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        }
    },
    CateringAddOn: {
        planName: {
            type: String
        },
        price: {
            type: String,
        },
        duration: {
            type: String,
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        }
    },
});

module.exports = mongoose.model("payment", paymentSchema);