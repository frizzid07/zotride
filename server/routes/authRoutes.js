const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

async function mailer(receiveremail, code) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "verifyzotride@gmail.com", // generated ethereal user
      pass: "atzqzpwkogtsynsu", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "verifyzotride@gmail.com", // sender address
    to: `${receiveremail}`, // list of receivers
    subject: "Verify your Registration", // Subject line
    text: `Your Verification Code is ${code}`, // plain text body
    html: `<b>Your Verification Code is ${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function validateEmail(email) {
  //Validates the email address
  var emailRegex =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  //Validates the phone number
  var phoneRegex = /^(\+1-|\+1|0)?\d{10}$/; // Change this regex based on requirement
  return phoneRegex.test(phone);
}

function validateUser(user) {
  // var dayOfBirthRegex = /^([0-2]?[1-9]|30|31)$/;
  // var monthOfBirthRegex = /^(0?[1-9]|1[0-2])$/;
  // var yearOfBirthRegex = /^(19[0-9][0-9]|20([0-1][0-9]|2[0-2]))$/;
  var dob = parseInt(user.dayOfBirth);
  var mob = parseInt(user.monthOfBirth);
  var yob = parseInt(user.yearOfBirth);
  var passRegex = /^[a-zA-Z0-9!@#$%^&*]{2,16}$/;
  return (
    1 <= dob &&
    dob <= 31 &&
    1 <= mob &&
    mob <= 12 &&
    1990 <= yob &&
    yob <= 2015 &&
    passRegex.test(user.password)
  );
}

router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    dayOfBirth,
    monthOfBirth,
    yearOfBirth,
    mobileNumber,
    email,
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !dayOfBirth ||
    !monthOfBirth ||
    !yearOfBirth ||
    !mobileNumber ||
    !email ||
    !password
  ) {
    return res.status(422).send({ error: "Please fill all the information" });
  }

  const user = new User({
    firstName,
    lastName,
    dayOfBirth,
    monthOfBirth,
    yearOfBirth,
    mobileNumber,
    email,
    password,
  });

  if (
    validateUser(user) &&
    validateEmail(user.email) &&
    validatePhone(user.mobileNumber)
  ) {
    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send({ message: "User Registered Successfully", token });
    } catch (err) {
      console.log(`DB Error: ${err}`);
      return res.status(422).send({ error: err.message });
    }
  } else {
    return res
      .status(422)
      .json({ error: "Please enter valid user credentials" });
  }
});

router.post("/verify", (req, res) => {
  const {
    firstName,
    lastName,
    dayOfBirth,
    monthOfBirth,
    yearOfBirth,
    mobileNumber,
    email,
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !dayOfBirth ||
    !monthOfBirth ||
    !yearOfBirth ||
    !mobileNumber ||
    !email ||
    !password
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  var exists = false;
  User.findOne({ mobileNumber: mobileNumber }).then(async (savedUser) => {
    if (savedUser) {
      exists = true;
    }
  });

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser || exists) {
      return res
        .status(422)
        .json({ error: "Credentials in use, login instead!" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      let user = [
        {
          firstName,
          lastName,
          dayOfBirth,
          monthOfBirth,
          yearOfBirth,
          mobileNumber,
          email,
          password,
        },
      ];
      if (
        validateUser(user[0]) &&
        validateEmail(user[0]?.email) &&
        validatePhone(user[0]?.mobileNumber)
      ) {
        await mailer(email, VerificationCode);
        res.send({
          message: "Verification Code Sent to your Email",
          udata: { user, VerificationCode },
        });
      } else {
        return res
          .status(422)
          .json({ error: "Please enter valid user credentials" });
      }
    } catch (err) {
      console.log(err);
      return res.status(422).send({ error: err.message });
    }
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body.data;
  if (!username || !password) {
    return res
      .status(422)
      .json({ error: "Please enter both email/mobile number and password" });
  }
  var savedUser = null;
  if (validateEmail(username)) {
    savedUser = await User.findOne({ email: username });
  } else if (validatePhone(username)) {
    savedUser = await User.findOne({ mobileNumber: Number(username) });
  }

  if (!savedUser) {
    return res
      .status(422)
      .json({ error: "Please enter valid user credentials" });
  }

    try {
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                console.log("Password matched");
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
                res.send({token});
            }
            else {
                console.log('Password does not match');
                return res.status(422).json({ error: "Invalid Credentials" });
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(422).send({error: err.message});
    }
});

router.post("/auth", async (req, res) => {
  const { token } = req.body.authToken;
  if (!token) {
    return res
      .status(401)
      .json({ error: "You must be logged in, token not given" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "You must be logged in, token invalid" });
    }
    const { _id } = payload;
    const userData = await User.findById(_id).lean().exec();
    console.log(userData);
    try {
        res.status(200).send({ userData });
    } catch (error) {
      console.log(error);
      return res.status(422).send({ error: error.message });
    } finally {
    }
  });
});

module.exports = router;