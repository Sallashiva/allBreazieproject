const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const paymentController = require("../controllers/payment-controller");

router.post("/create-order", paymentController.createPayment);

router.post("/verification", paymentController.verification);

module.exports = router;