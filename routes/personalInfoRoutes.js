const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMidleware");

const {
  updateInfo,
  getInfo,
} = require("../controllers/personalInfoControllers");

router.route("/").get(protect, getInfo);
router.route("/:id").put(protect, updateInfo);

module.exports = router;
