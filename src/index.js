const express = require('express');

require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');
const { response } = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())

//Crete user
app.post('/users', async (req, res) => {
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
app.get('/users', async (req, res) => {

    try {
        let users = await User.find({})
        res.send(users);
    } catch(err) {
        res.status(500).send(err)
    }
})

//Get single user
app.get('/users/:id', async (req, res) => {

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
app.patch('/users/:id', async (req, res) => {
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
            return response.status(404).send();

        res.send(user)
    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete a user
app.delete('/users/:id', async (req, res) => {

    let id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.send()
    } catch (err) {
        res.status(500).send(err);
    }
})

//Create a task
app.post('/tasks', async (req, res) => {

    try {
        let task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

//Get all tasks
app.get('/tasks', async (req, res)=>{
    
    try {
        let tasks = await Task.find({})
        res.send(tasks)
    } catch (err) {
        res.status(500).send(err)
    };
} )

//Get single task
app.get('/tasks/:id', async (req, res)=> {
    
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
app.patch('/tasks/:id', async (req, res) => {
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
            return response.status(404).send();

        res.send(task)
    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete a task
app.delete('/tasks/:id', async (req, res) => {
    
    let id = req.params.id;
    try {
        await Task.findByIdAndDelete(id);
        res.send()
    } catch (err) {
        res.status(500).send(err);
    }
})







app.listen(port, () => {
    console.log("Server listening in " + port)
})


