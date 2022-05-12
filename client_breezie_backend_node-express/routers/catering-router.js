const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const cateringController = require("../controllers/catering-controller.js");

const {
    cateringStorage
} = require("../helper/imageStorage");

// const auth = require('../middleware/auth');

router.get("/", (req, res) => {
    res.send("Catering");
});

router.get("/get-all-order-contacts", cateringController.getAllOrderContacts);

router.post("/get-company-order-contacts", cateringController.getCompanyOrderContacts);

router.post("/add-order-contacts", cateringController.addOrderContacts);

router.delete("/delete-order-contacts", cateringController.deleteOrderContacts);

//newOne 

router.get("/get-all-beverage",auth.auth, cateringController.getCateringBeverages);

router.post("/add-beverage",cateringStorage,auth.auth, cateringController.cateringBeverages);

router.put("/upadte-beverage/:id",cateringStorage,auth.auth, cateringController.updateCateringBeverages);

router.delete("/delete-beverage/:id",auth.auth, cateringController.deleteCateringBeverages);

 //food
 
 router.get("/get-all-foods",auth.auth, cateringController.getCateringFoods);

 router.post("/add-food",cateringStorage,auth.auth, cateringController.cateringFoods);

router.put("/upadte-food/:id",cateringStorage,auth.auth, cateringController.updateCateringFood);

 router.delete("/delete-food/:id",auth.auth, cateringController.deleteCateringFood);

 //cateringSetup

 router.get("/get-general-data", cateringController.getGeneralData);

 router.get("/get-all-data", cateringController.getAllCateringData);

 router.delete("/delete-general-catering/:id", auth.auth, cateringController.deleteCateringData);

router.post("/add-general-catering", auth.auth, cateringController.generalCateringData);



module.exports = router;