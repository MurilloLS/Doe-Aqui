const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://<username>:<password>@doeaqui-cluster.dlc34az.mongodb.net/?retryWrites=true&w=majority&appName=doeaqui-cluster');

        console.log('MongoDB conectado com sucesso.');
    } catch (err) {
        console.error('Falha ao conectar com o MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;