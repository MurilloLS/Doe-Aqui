const Users = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// --- ROTAS PÚBLICAS ---

module.exports.signup = async (req, res) => {
    try {
        const { password, ...userData } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new Users({
            ...userData,
            password: hashedPassword,
            profilePic: req.file ? req.file.path : null
        });
        await user.save();
        res.status(201).send({ message: 'Utilizador registado com sucesso.' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ message: 'Email ou Documento já existem.' });
        }
        console.error("Erro no Signup:", err);
        res.status(500).send({ message: 'Erro interno no servidor.' });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username });
        console.log(username);
        if (!user) {
            return res.status(404).send({ message: 'Utilizador ou palavra-passe inválidos.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Utilizador ou palavra-passe inválidos.' });
        }
        const userForToken = { _id: user._id, username: user.username, user_type: user.user_type };
        const token = jwt.sign({ data: userForToken }, 'MYKEY', { expiresIn: '1h' });
        res.send({ message: 'Login bem-sucedido.', token, userId: user._id });
    } catch (error) {
        console.error("Erro no Login:", error);
        res.status(500).send({ message: 'Erro interno no servidor.' });
    }
};

// --- ROTAS PROTEGIDAS ---

// FUNÇÃO ADICIONADA PARA CORRIGIR O ERRO
module.exports.myProfile = async (req, res) => {
    try {
        // O ID do utilizador é obtido do token (req.user), não da URL
        const user = await Users.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).send({ message: 'Utilizador não encontrado.' });
        }
        res.send({ message: 'Perfil recuperado com sucesso.', user });
    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password, ...otherData } = req.body;
        const updatedData = { ...otherData };
        if (req.file) {
            updatedData.profilePic = req.file.path;
        }
        if (password) {
            updatedData.password = await bcrypt.hash(password, saltRounds);
        }
        const updatedUser = await Users.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ message: 'Utilizador não encontrado.' });
        }
        res.send({ message: 'Perfil atualizado com sucesso.', user: updatedUser });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ message: 'Email ou Documento já existem.' });
        }
        console.error("Erro ao atualizar utilizador:", err);
        res.status(500).send({ message: 'Erro no servidor ao atualizar perfil.' });
    }
};

module.exports.getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).send({ message: 'Utilizador não encontrado.' });
        }
        res.send({ message: 'Sucesso.', user });
    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

// --- Funções de "Likes" ---

module.exports.likeProducts = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        await Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } });
        res.send({ message: 'Produto curtido com sucesso.' });
    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor ao curtir.' });
    }
};

module.exports.unlikeProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        await Users.updateOne({ _id: userId }, { $pull: { likedProducts: productId } });
        res.send({ message: 'Produto descurtido com sucesso.' });
    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor ao descurtir.' });
    }
};

// FUNÇÃO ADICIONADA PARA CORRIGIR O ERRO
module.exports.getLikedProductIds = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await Users.findById(userId).select('likedProducts -_id');
        res.send({ message: 'Sucesso.', ids: user ? user.likedProducts : [] });
    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

module.exports.likedProducts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await Users.findById(userId).populate('likedProducts');
        res.send({ message: 'Sucesso.', products: user ? user.likedProducts : [] });
    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};