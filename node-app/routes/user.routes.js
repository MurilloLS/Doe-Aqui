// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// --- ROTAS DE AUTENTICAÇÃO (Públicas) ---
router.post('/signup', upload.single('profilePic'), userController.signup);
router.post('/login', userController.login);


// --- ROTAS DE GESTÃO DE PERFIL (Protegidas) ---

router.get('/me', authMiddleware, userController.myProfile);
router.put('/me', authMiddleware, upload.single('profilePic'), userController.updateUser);


// --- ROTAS DE "LIKES" DO UTILIZADOR (Protegidas) ---

router.get('/me/liked-products', authMiddleware, userController.likedProducts);
router.get('/me/liked-products/ids', authMiddleware, userController.getLikedProductIds);
router.post('/me/liked-products', authMiddleware, userController.likeProducts);
router.delete('/me/liked-products/:productId', authMiddleware, userController.unlikeProduct);


// --- ROTA PÚBLICA PARA VER PERFIS ---
router.get('/:userId', userController.getUserById);


module.exports = router;