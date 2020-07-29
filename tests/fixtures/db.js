const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new ObjectId()
const userOne = {
    _id: userOneId,
    name: "Test User", 
    email: "test@test.com",
    password: "MyPass777!",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Test Subject", 
    email: "admin@test.com",
    password: "MyPass777!",
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new ObjectId(), 
    description: 'First task',
    completed: false,
    author: userOneId
}
const taskTwo = {
    _id: new ObjectId(), 
    description: 'Second task',
    completed: true,
    author: userOneId
}
const taskThree = {
    _id: new ObjectId(), 
    description: 'Third task',
    completed: true,
    author: userTwoId
}


let setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    userOneId,
    userOne,
    userTwo,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}