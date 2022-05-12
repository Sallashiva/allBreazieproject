const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    userId: {
        type: String
    },
    companyLogo: {
        type: String,
        default: "https://secure.breazie.com/images/brand/TechnoElevate.jpg"
    },
    idBadge: {
        type: String,
    },
    email: {
        type: Boolean,
    },
    contactless: {
        type: Boolean,
    },
    
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('brand', brandSchema)