const mongoose = require('mongoose');

const connectDB = async () => {
    try {
+       await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado com sucesso.');
    } catch (err) {
        console.error('Falha ao conectar com o MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;