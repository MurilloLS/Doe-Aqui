const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadS3 = require('../middlewares/uploadS3.middleware');
const { fixS3Urls } = require('../middlewares/uploadS3.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// --- ROTAS PÚBLICAS ---

router.get('/', productController.getProducts);
router.get('/search', productController.search);
router.get('/:productId', productController.getProductsById);


// --- ROTAS PROTEGIDAS (Exigem autenticação) ---

router.post('/', authMiddleware, uploadS3.fields([{ name: 'pimage' }, { name: 'pimage2' }]), fixS3Urls, productController.addProduct);
router.get('/user/my-products', authMiddleware, productController.myProducts);
router.put('/:productId', authMiddleware, uploadS3.fields([{ name: 'pimage' }, { name: 'pimage2' }]), fixS3Urls, productController.updateProduct);
router.delete('/:productId', authMiddleware, productController.deleteProduct);


module.exports = router;