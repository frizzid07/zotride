const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    dayOfBirth: {type: Number},
    monthOfBirth: {type: Number},
    yearOfBirth: {type: Number},
    isDriver: {type: Boolean, default: false},
    mobileNumber: {type: Number, required: [true, "Cannot be blank"], unique: true},
    email: {type: String, required: [true, "Cannot be blank"], unique: true},
    password: {type: String, required: [true, "Cannot be blank"]},
    activeDriverRide: {type: String, default: null},
    activePassengerRides: {type: []},
    past_rides:{type: []}
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    const user = this;
    console.log("Just before saving before hashing  ", user.password);
    if (!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    console.log("Just before saving & after hashing", user.password);
    next();
})

mongoose.model("User", userSchema)