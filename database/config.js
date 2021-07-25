const mongoose = require('mongoose');

const dbConnection = async() => {
    try{
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("init db config")
    } catch (error){
        console.log(error);
        throw new Error("error en la base de datos")
    }
}

module.exports = {
    dbConnection
}