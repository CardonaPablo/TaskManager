const express = require('express')

const Task = require('../models/task')

const router = new express.Router();

const auth = require('../middleware/auth')

//Create a task
router.post('/tasks', auth, async (req, res) => {
    
    req.body.author = req.user._id;

    try {
        let task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

//Get all tasks
//Query, filter by completed
// Limit and skip for pagination
// sortBy=createdAt_asc

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    //Sorting
    if(req.query.sortBy) {
        let parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options :{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        }).execPopulate()
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    };
})

//Get single task
router.get('/tasks/:id', auth, async (req, res)=> {
    
    const id = req.params.id;
    try {
        let task = await Task.findOne({
            _id: id,
            author: req.user._id
        })
        if(!task)
            return res.status(404).send()
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
})

//Update a task
router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    let isValidOperation = updates.every((value) => allowedUpdates.includes(value))

    if(!isValidOperation)
        return res.status(403).send({ error: 'Cannot update property'})

    try {

        let task = await Task.findOne({
            author: req.user._id,
            _id: req.params.id
        })

        if(!task) 
            return res.status(404).send();

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
    
    let id = req.params.id;
    try {
        let task = await Task.findOneAndDelete({
            author: req.user._id,
            _id: id
        })
        
        if(!task) 
            return res.status(404).send();

        res.send(task)
    } catch (err) {
        res.status(500).send(err);
    }
})


module.exports = router;
