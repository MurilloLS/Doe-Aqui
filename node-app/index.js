// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database'); // Importar a sua função de ligação à BD

// Importar as rotas
const productRoutes = require('./routes/product.routes.js');
const userRoutes = require('./routes/user.routes.js');

// --- Inicialização e Configuração Essencial ---
const app = express();
const PORT = process.env.PORT || 4000;

// Ligar à base de dados ANTES de iniciar o servidor
connectDB();

// --- Middlewares ---

// Configuração do CORS para permitir pedidos do seu frontend (http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware para fazer o parse de JSON no corpo das requisições
app.use(express.json());

// Middleware para servir ficheiros estáticos (imagens da pasta 'uploads')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Configuração das Rotas ---

// Todas as rotas de produtos serão prefixadas com /api/products
app.use('/api/products', productRoutes);

// Todas as rotas de utilizador serão prefixadas com /api/users
app.use('/api/users', userRoutes);


// --- Arranque do Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});