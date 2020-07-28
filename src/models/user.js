const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken');
const Task = require('./task');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//Relation with tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
})

//Middleware

userSchema.pre('save', async function(next) {

    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next){ 
    await Task.deleteMany({ author: this._id})
    next()
})

//Add static method, finds user by credentials
userSchema.statics.findByCredentials = async (email, password) => {

    let user = await User.findOne({ email });
    if(!user)
        throw new Error('Unable to login')

    if(!(await bcrypt.compare(password, user.password)))
        throw new Error('Unable to login')

    return user
}
//Generate auth tpken with _id embedded
userSchema.methods.generateAuthToken = async function() {
    let token = jsonwebtoken.sign({_id: this._id.toString()}, 'secretstring')
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

//Overriding method to return user data
userSchema.methods.toJSON = function () {
    const userObj = this.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

const User = mongoose.model('User', userSchema)

module.exports = User;