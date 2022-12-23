const mongoose = require("mongoose");

const visaInfoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    dob: {
      type: String,
    },

    nationality: {
      type: String,
    },

    firstLang: {
      type: String,
    },

    passportNum: {
      type: String,
    },

    passportExpDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VisaInfo", visaInfoSchema);
