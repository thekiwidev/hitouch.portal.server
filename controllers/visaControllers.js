const asyncHandler = require("express-async-handler");

const VisaInfo = require("../models/visaModel");
const Student = require("../models/studentModels");

// ==================================
// GET A STUDENT INFO
// @route       POST api/users
// @desc        creata a new user
// @access      Private

const createInfo = asyncHandler(async (req, res) => {
  // get the vars from the body
  const {
    firstName,
    lastName,
    nationality,
    passportNum,
    passportExpDate,
    dob,
  } = req.body;

  const student = await Student.findById(req.student.id);

  if (!student) {
    res.status(401);
    throw new Error("User not found");
  }

  const visaExist = await VisaInfo.findOne({ user: student });

  if (visaExist) {
    res.status(400);
    throw new Error("Update your visa info Instead!!!");
  }

  const info = await VisaInfo.create({
    user: req.student.id,
    firstName,
    lastName,
    nationality,
    passportNum,
    passportExpDate,
    dob,
  });

  res.status(200).json(info);
});
// ==================================
// GET A STUDENT INFO
// @route       POST api/users
// @desc        creata a new user
// @access      Private

const getInfo = asyncHandler(async (req, res) => {
  const info = await VisaInfo.find({ user: req.student.id });

  res.status(200).json(info);
});

// ==================================
// UPDATE STUDENT PERSONAL INFORMATION
// @route       POST api/info/update
// @desc        Authenticate Student
// @access      Private

const updateInfo = asyncHandler(async (req, res) => {
  const info = await VisaInfo.findById(req.params.id);

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

  const updatedUserInfo = await VisaInfo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedUserInfo);
});

module.exports = {
  createInfo,
  getInfo,
  updateInfo,
};
