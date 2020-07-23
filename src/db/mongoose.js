const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017' //Definir la conexión [No usar "localhost"]
const databaseName = 'task-manager-api' //Definir el nombre de la base de datos

mongoose.set('useFindAndModify', false);

mongoose.connect(connectionURL + "/" + databaseName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


