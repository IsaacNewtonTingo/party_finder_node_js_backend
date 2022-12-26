const express = require("express");
const { signup, verifyCode } = require("../controller/user");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);

module.exports = router;
