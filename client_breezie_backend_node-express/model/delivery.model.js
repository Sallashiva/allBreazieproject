const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    userId: {
        type: String
    },
    recepient: {
        type: String
    },
    emailNote: {
        type: String
    },
    empId: {
        type: String
    },
    deliveryTime: {
        type: String
    },
    collectedTime: {
        type: String
    },
    noOfPackages: {
        type: String
    },
    markAsCollected: {
        type: Boolean
    },
    signatureRequired: {
        type: Boolean
    },
    Note:{
        type: String
    },
    isGeneral: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const generalDeliverySchema = new Schema({
    fullName:{
        type: String
    },
    email:{
        type: String
    },
    phoneNumber:{
        type: Number
    },
    userId:{
        type: String
    }
})

const Delivery =mongoose.model('delivery', deliverySchema)
const genaralDelivery =mongoose.model('generalDeliverySchema', generalDeliverySchema)
module.exports = {
    Delivery,
    genaralDelivery
}