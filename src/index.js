const express = require('express');

require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())

//Crear un usuario
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

app.get('/users', async (req, res) => {

    try {
        let users = await User.find({})
        res.send(users);
    } catch(err) {
        res.status(500).send(err)
    }
})

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

//Crear una nota
app.post('/tasks', async (req, res) => {

    try {
        let task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

//Leer todas las notas
app.get('/tasks', async (req, res)=>{
    
    try {
        let tasks = await Task.find({})
        res.send(tasks)
    } catch (err) {
        res.status(500).send(err)
    };
} )

//Leer una sola nota

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







app.listen(port, () => {
    console.log("Server listening in " + port)
})


