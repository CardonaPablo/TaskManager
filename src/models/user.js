const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('user', {
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Invalid email")
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0)
                throw new Error("Age must be a positive number")
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validation(value) {
            if(value.toLowerCase().includes("password")){
                throw new Error('Password must not contain the word "Password"')
            }
        }
    }
})

module.exports = User;