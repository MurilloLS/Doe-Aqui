const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// --- ROTAS PÚBLICAS ---

router.get('/', productController.getProducts);
router.get('/search', productController.search);
router.get('/:productId', productController.getProductsById);


// --- ROTAS PROTEGIDAS (Exigem autenticação) ---

router.post('/', authMiddleware, upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productController.addProduct);
router.get('/user/my-products', authMiddleware, productController.myProducts);
router.put('/:productId', authMiddleware, upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productController.updateProduct);
router.delete('/:productId', authMiddleware, productController.deleteProduct);


module.exports = router;