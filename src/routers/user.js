const express = require('express');

const router = new express.Router();

const User = require('../models/user');

//Create user
router.post('/users', async (req, res) => {
    
    try {
        let user = new User(req.body);
        await user.save()
        res.status(201).send(user)  
    }
    catch(err) {
        res.status(400).send(err)
    };
})

//Get all users
router.get('/users', async (req, res) => {
    
    try {
        let users = await User.find({})
        res.send(users);
    } catch(err) {
        res.status(500).send(err)
    }
})

//Get single user
router.get('/users/:id', async (req, res) => {

    const id = req.params.id;
    try {

        let user = await User.findById(id)
        if(!user) 
            return res.status(404).send();
        res.send(user)

    } catch(err){
        res.status(500).send(err)
    }
})

//Update a user
router.patch('/users/:id', async (req, res) => {
    let id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    let isValidOperation = updates.every((value) => allowedUpdates.includes(value))

    if(!isValidOperation)
        return res.status(403).send({ error: 'Cannot update property'})

    try {

        let user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if(!user) 
            return res.status(404).send();

        res.send(user)
    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete a user
router.delete('/users/:id', async (req, res) => {

    let id = req.params.id;
    try {
        let user = await User.findByIdAndDelete(id);

        if(!user) 
            return res.status(404).send();

        res.send(user)
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;