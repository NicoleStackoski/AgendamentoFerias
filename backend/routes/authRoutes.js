const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", (req, res) => authController.login(req, res));
router.post("/set-password", (req, res) => authController.setPassword(req, res));

module.exports = router;
