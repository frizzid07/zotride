const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

async function mailer(receiveremail, code) {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
            user: "verifyzotride@gmail.com", // generated ethereal user
            pass: "atzqzpwkogtsynsu" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'verifyzotride@gmail.com', // sender address
        to: `${receiveremail}`, // list of receivers
        subject: "Verify your Registration", // Subject line
        text: `Your Verification Code is ${code}`, // plain text body
        html: `<b>Your Verification Code is ${code}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

router.post('/register', async (req, res) => {
    const { firstName, lastName, dayOfBirth, monthOfBirth, yearOfBirth, mobileNumber, email, password } = req.body;
    if (!firstName || !lastName || !dayOfBirth || !monthOfBirth || !yearOfBirth || !mobileNumber || !email || !password) {
        return res.status(422).send({error : "Please fill all the information"});
    }

    const user = new User({
        firstName, lastName, dayOfBirth, monthOfBirth, yearOfBirth, mobileNumber, email, password
    });

    try {
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ message: "User Registered Successfully", token });
    } catch(err) {
        console.log(`DB Error: ${err}`)
        return res.status(422).send({error: err.message});
    }
});

router.post('/verify', (req, res) => {
    const { firstName, lastName, dayOfBirth, monthOfBirth, yearOfBirth, mobileNumber, email, password } = req.body;
    if (!firstName || !lastName || !dayOfBirth || !monthOfBirth || !yearOfBirth || !mobileNumber || !email || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    User.findOne({ email: email }).then(async (savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "Invalid Credentials" });
        }
        try {

            let VerificationCode = Math.floor(100000 + Math.random() * 900000);
            let user = [{ firstName, lastName, dayOfBirth, monthOfBirth, yearOfBirth, mobileNumber, email, password }]
            await mailer(email, VerificationCode);
            res.send({ message: "Verification Code Sent to your Email", udata: {user, VerificationCode} });
        }
        catch (err) {
            console.log(err);
            return res.status(422).send({error: err.message});
        }
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" });
    }
    const savedUser = await User.findOne({ email: email })

    if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
    }

    try {
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                console.log("Password matched");
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
                res.send({ token });
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

module.exports = router;