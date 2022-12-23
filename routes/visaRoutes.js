const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMidleware");

const {
  createInfo,
  updateInfo,
  getInfo,
} = require("../controllers/visaControllers");

router.route("/").post(protect, createInfo).get(protect, getInfo);
router.route("/:id").put(protect, updateInfo);

module.exports = router;
