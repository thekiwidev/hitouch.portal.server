const asyncHandler = require("express-async-handler");

const PersonalInfo = require("../models/personalInfoModel");
const Student = require("../models/studentModels");

// ==================================
// GET A STUDENT INFO
// @route       POST api/users
// @desc        creata a new user
// @access      Private

const getInfo = asyncHandler(async (req, res) => {
  const info = await PersonalInfo.find({ user: req.student.id });

  res.status(200).json(info);
});

// ==================================
// UPDATE STUDENT PERSONAL INFORMATION
// @route       POST api/info/update
// @desc        Authenticate Student
// @access      Private

const updateInfo = asyncHandler(async (req, res) => {
  const info = await PersonalInfo.findById(req.params.id);

  if (!info) {
    res.status(400);
    throw new Error("Info not found");
  }

  // check if a user is logged in
  const student = await Student.findById(req.student.id);

  if (!student) {
    res.status(401);
    throw new Error("User not found");
  }

  // check if the logged in user matches the info owner
  if (info.user.toString() !== student.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedUserInfo = await PersonalInfo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedUserInfo);
});

module.exports = {
  getInfo,
  updateInfo,
};
