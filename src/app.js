const express = require('express');

require('./db/mongoose');

//App configuration
const app = express();
app.use(express.json())

//Routers
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

app.use(UserRouter)
app.use(TaskRouter)

module.exports = app;

