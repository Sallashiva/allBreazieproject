const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cateringSchema = new Schema({
    hostReceivesOrder: {
        type: Boolean,
    },
    orderContacts: [{
        emailId: {
            type: String,
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        phone: {
            type: String,
        },
        employeeId: {
            type: String,
        },
        isGeneralContact: {
            type: Boolean,
        },
    }, ],
    menu: {},
    thankYou: {},
    
    created_at: {
        type: Date,
        default: Date.now
    }
});


const cateringBeverages = new Schema({
    imagePath: {
        type: String,
    },
    userId:{
       type: String,
    },  
    bevergesName:{
        type: String,
    },
    price:{
        type: Number,
    }
})

const cateringFoods = new Schema({
    imagePath: {
        type: String,
    },
    userId:{
       type: String,
    },  
    foodName:{
        type: String,
    },
    price:{
        type: Number,
    },
    notes:{
        type: String,
    }
})

const generalCateringSchema = new Schema({
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

const Catering = mongoose.model("catering", cateringSchema);
const cateringBeverage = mongoose.model("cateringBeverages", cateringBeverages);
const cateringFood = mongoose.model("cateringFood", cateringFoods);
const GeneralCatering = mongoose.model("generalCatering", generalCateringSchema);

 module.exports={
    Catering,
    cateringBeverage,
    cateringFood,
    GeneralCatering
 }