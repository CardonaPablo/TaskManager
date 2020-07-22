const express = require('express')

const Task = require('../models/task')

const router = new express.Router();

//Create a task
router.post('/tasks', async (req, res) => {

    try {
        let task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

//Get all tasks
router.get('/tasks', async (req, res)=>{
    
    try {
        let tasks = await Task.find({})
        res.send(tasks)
    } catch (err) {
        res.status(500).send(err)
    };
} )

//Get single task
router.get('/tasks/:id', async (req, res)=> {
    
    const id = req.params.id;
    try {
        let task = await Task.findById(id)
        if(!task)
            return res.status(404).send()
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
})

//Update a task
router.patch('/tasks/:id', async (req, res) => {
    let id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    let isValidOperation = updates.every((value) => allowedUpdates.includes(value))

    if(!isValidOperation)
        return res.status(403).send({ error: 'Cannot update property'})

    try {

        let task = await Task.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if(!task) 
            return res.status(404).send();

        res.send(task)
    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete a task
router.delete('/tasks/:id', async (req, res) => {
    
    let id = req.params.id;
    try {
        let task = await Task.findByIdAndDelete(id);
        
        if(!task) 
            return res.status(404).send();

        res.send(task)
    } catch (err) {
        res.status(500).send(err);
    }
})


module.exports = router;
