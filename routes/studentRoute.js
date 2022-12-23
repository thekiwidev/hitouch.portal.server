const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMidleware");

const {
  registerStudent,
  loginStudent,
  getStudent,
} = require("../controllers/studentController");

router.post("/", registerStudent);
router.post("/signin", loginStudent);
router.get("/me", protect, getStudent);

module.exports = router;
