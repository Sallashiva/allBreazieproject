const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    history: [{
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
        totalAmount: {
            typr: String
        },
        locations: {
            type: Number,
        },
        plans: {
            planId: {
                type: String,
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
            startDate: {
                type: String,
            },
            endDate: {
                type: String,
            }
        },
        deliveryAddOn: {
            planName: {
                type: String
            },
            startDate: {
                type: String,
            },
            endDate: {
                type: String,
            },
            price: {
                type: String,
            },
            duration: {
                type: String,
            },
        },
        CateringAddOn: {
            planName: {
                type: String
            },
            startDate: {
                type: String,
            },
            endDate: {
                type: String,
            },
            price: {
                type: String,
            },
            duration: {
                type: String,
            },
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    }, ],
    userId: {
        type: String,
    },
    paymentMethods: {
        cardHoldersName: {
            type: String,
        },
        cardDetails: {
            type: String,
        },
        savedCard: {
            type: String,
        },
    },
    // settings: {
        accountDetails: {
            accountName: {
                type: String,
            },
            billingContactName: {
                type: String,
            },
            billingContactEmail: {
                type: String,
            },
        },
        invoiceAddress: {
            hostingRegion: {
                type: String,
            },
            address: {
                type: String,
            },
            state: {
                type: String,
            },
            pincode: {
                type: Number,
            },
            city: {
                type: String,
            },
            phone: {
                type: Number,
            },
        },
    // },

    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("account", accountSchema);