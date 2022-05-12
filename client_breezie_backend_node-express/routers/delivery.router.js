const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/delivery.controller");
const auth = require('../middleware/auth');
router.get("/", (req, res) => {
    res.send("Delivery");
});

router.get("/get-all-delivery/:startDate/:endDate", auth.auth, deliveryController.getAllDelivery);

router.get("/get-company-delivery", auth.auth, deliveryController.getCompanyDelivery);

router.put("/edit-delivery/:id", auth.auth, deliveryController.editDelivery);

router.post("/free-trial", auth.auth, deliveryController.freeTrial);

router.post("/add-delivery", auth.auth, deliveryController.addDelivery);

router.put("/mark-collected/:id", auth.auth, deliveryController.markCollected);

router.post("/notify-recepient/:id", auth.auth, deliveryController.notifyRecepient);

router.post("/addGeneralDelivery", auth.auth, deliveryController.addGeneralDelivery);

///
router.get("/get-allDelivery-data", deliveryController.getAllDeliveryData);

router.get("/get-general-delivery", auth.auth, deliveryController.getGeneralData);

router.delete("/delete-general-delivery/:id", auth.auth, deliveryController.deleteDeliveryData);

router.post("/general-delivery", auth.auth, deliveryController.generalDeliveryData);


module.exports = router;