const express = require("express");
const router = express.Router();
const checkOutsController = require("./checkout.controller");

router.post("/crear", checkOutsController.crear);

module.exports = router;
