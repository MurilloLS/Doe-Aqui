/**
 * Script DEBUG: Verificar dados de usuários no MongoDB
 * 
 * Execute no terminal para ver o que está salvo no banco:
 * node scripts/debug-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Users = require('../models/user.model.js');
const Products = require('../models/product.model.js');

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado ao MongoDB\n');

        // Ver primeiro usuário
        const user = await Users.findOne().select('username email profilePic');
        console.log('👤 Primeiro Usuário:');
        console.log(JSON.stringify(user, null, 2));

        // Ver primeiro produto
        const product = await Products.findOne().select('pname pimage pimage2');
        console.log('\n📦 Primeiro Produto:');
        console.log(JSON.stringify(product, null, 2));

        console.log('\n🔍 O que você vê acima é o que o frontend receberá!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

debugData();
