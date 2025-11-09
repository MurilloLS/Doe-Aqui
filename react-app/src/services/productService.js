import api from './api';

// --- Rotas Públicas ---
const getProducts = (category = null) => {
    // Rota: GET /api/products
    const url = category ? `/products?catName=${category}` : '/products';
    return api.get(url);
};

const getProductById = (productId) => {
    // Rota: GET /api/products/:productId
    return api.get(`/products/${productId}`);
};

const searchProducts = (searchTerm, location) => {
    // Rota: GET /api/products/search
    return api.get(`/products/search?search=${searchTerm}&loc=${location}`);
};


// --- Rotas Protegidas ---
const addProduct = (formData) => {
    // Rota: POST /api/products (não precisa de userId)
    return api.post('/products', formData);
};

const getMyProducts = () => {
    // Rota: GET /api/products/user/my-products (não precisa de userId)
    return api.get('/products/user/my-products');
};

const updateProduct = (productId, formData) => {
    // Rota: PUT /api/products/:productId
    return api.put(`/products/${productId}`, formData);
};

const deleteProduct = (productId) => {
    // Rota: DELETE /api/products/:productId (não precisa de userId)
    return api.delete(`/products/${productId}`);
};

const productService = {
    addProduct,
    getProducts,
    getProductById,
    getMyProducts,
    updateProduct,
    deleteProduct,
    searchProducts
};

export default productService;