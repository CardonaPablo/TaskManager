
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017' //Definir la conexión [No usar "localhost"]
const databaseName = 'task-manager' //Definir el nombre de la base de datos


MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((client) => {

    const db = client.db(databaseName) //Crear al base de datos, regresa una referencia
    // Create

    // db.collection("users").insertOne({
    //     _id: id,
    //     name: "Pablo Card",
    //     age: 19
    // }).then((result) => {
    //     console.log("Operation Result", result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: "Buy Mi Watch Color",
    //         completed: false
    //     },
    //     {
    //         description: "Start Node.js Course",
    //         completed: true
    //     },
    //     {
    //         description: "Start my own company",
    //         completed: false
    //     }
    // ]).then((result) => {
    //     console.log("Operation Result", result.ops)
    // })

    // Read

    // db.collection('users').findOne({
    //     _id: new ObjectID("5f14e7637ffe7a25fc5ceda3")
    // }).then((user) => {
    //     if(!user)
    //         console.log("Query returned no results")
    //     console.log("User", user)
    // })

    // let tasks = await db.collection('tasks').find({
    //     completed: false
    // }).toArray();

    //Update 

    
    // db.collection('users').updateOne({
    //     _id: new ObjectID("5f149662862d5d2c843052b5")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log("Result", result.result)
    // })

    // db.collection('tasks').updateMany({}, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log("Result", result.result)
    // })

    //Delete

    // db.collection('tasks').deleteMany({
    //    description: "Start Node.js Course" 
    // }).then((result) => {
    //     console.log(result.result)
    // })

    // db.collection('tasks').deleteOne({
    //    description: "Start Node.js Course" 
    // }).then((result) => {
    //     console.log(result.result)
    // })

}).catch((err) => {
    console.log("MongoDB Error", err);
});