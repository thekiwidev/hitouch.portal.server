const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const Student = require("../models/studentModels");
const PersonalInfo = require("../models/personalInfoModel");

// ==================================
// !CREATE A STUDENT
// @route       POST api/users
// @desc        creata a new user
// @access      Public
const registerStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // !CHECK IF USER EXIST
  const userExist = await Student.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error(`User with the email ${email}  already exist`);
  }

  // !HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // !CREATE THE STUDENT
  const student = await Student.create({
    name: `${lastName ? firstName + " " + lastName : firstName}`,
    email,
    password: hashedPassword,
  });

  if (student) {
    // !CHECK IF USER INFO EXIST
    const infoExist = await PersonalInfo.findOne({ email });

    if (infoExist) {
      res.status(400);
      throw new Error(`Info with the email ${email}  already exist`);
    }

    const userInfo = await PersonalInfo.create({
      user: student.id,
      firstName,
      lastName,
      email: student.email,
    });

    res.status(201).json({
      _id: student.id,
      email: student.email,
      name: userInfo.firstName,
      token: generateToken(student._id),
      info: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        user: userInfo.user,
        email: userInfo.email,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

// ==================================
// !LOGIN STUDENTS
// @route       POST api/users/login
// @desc        Authenticate Student
// @access      Public

const loginStudent = asyncHandler(async (req, res) => {
  // *Get the email and password
  const { email, password } = req.body;

  // *CHECK FOR EMAIL
  const student = await Student.findOne({ email });

  if (student && (await bcrypt.compare(password, student.password))) {
    res.status(201).json({
      _id: student.id,
      email: student.email,
      name: student.name.split(" ")[0],
      token: generateToken(student._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// ==================================
// !GET STUDENT DATA
// ==================================
// @route       GET api/user/me
// @desc        get a specific user account info
// @access      Private
const getStudent = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

// !GENERATE JWT TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudent,
};
