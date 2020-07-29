const express = require('express');

require('./db/mongoose');

//App configuration
const app = express();
const port = process.env.PORT
app.use(express.json())

//Routers
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log("Server listening in " + port)
})


