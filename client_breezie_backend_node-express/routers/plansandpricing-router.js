const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const planandpricingController = require("../controllers/plansandpricing-controller");

router.get("/", (req, res) => {
    res.send("Planandpricing");
});

router.get("/get-all-plans", planandpricingController.getAllPlans);

router.post("/add-plan-pricing", planandpricingController.addPlanPricing);

router.put("/edit-plans/:id", planandpricingController.editPlans);

router.get("/get-all-addons", planandpricingController.getAllAddOns);

router.post("/add-addons", planandpricingController.addAddons);

router.post("/edit-addons", planandpricingController.editAddons);

module.exports = router;