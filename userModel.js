const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//Structure of our User 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el){
                // this only works on Create and SAVE !!! 
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    }
});

userSchema.pre('save', async function(next){
    //only run this function if password field was actually modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfrim field from DB user document
    this.passwordConfirm = undefined;
    next();
});

// User model
const User = mongoose.model('User', userSchema);


module.exports = User;