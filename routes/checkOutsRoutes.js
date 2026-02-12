const express = require("express");
const router = express.Router();
const checkOutsController = require("../controller/checkOutsController");

router.post("/crear", checkOutsController.crear);

module.exports = router;
