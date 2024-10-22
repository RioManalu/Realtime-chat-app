const mongoose = require('mongoose');

async function connectDB() {
    try{
        await mongoose.connect(process.env.DB_URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('connected to DB');
        });

        connection.on('error', (err) => {
            console.log('something went wrong in mongodb', err);
        });

    }catch(err){
        console.log('something went wrong', err);
    }
}

module.exports = connectDB;