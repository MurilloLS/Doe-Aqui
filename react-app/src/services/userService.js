import api from './api';

// --- Rotas Públicas ---
const login = (username, password) => {
    // Rota: POST /api/users/login
    return api.post('/users/login', { username, password });
};

const signup = (formData) => {
    // Rota: POST /api/users/signup
    return api.post('/users/signup', formData);
};

const getUserDetails = (userId) => {
    // Rota: GET /api/users/:userId (para ver perfis públicos)
    return api.get(`/users/${userId}`);
};


// --- Rotas Protegidas (o token é enviado automaticamente) ---
const getMyProfile = () => {
    // Rota: GET /api/users/me -> Não precisa de userId
    return api.get('/users/me');
};

const updateUser = (formData) => {
    // Rota: PUT /api/users/me
    return api.put('/users/me', formData);
};

// --- Funções de "Likes" ---
const likeProduct = (productId) => {
    // Rota: POST /api/users/me/liked-products
    return api.post('/users/me/liked-products', { productId });
};

const unlikeProduct = (productId) => {
    // Rota: DELETE /api/users/me/liked-products/:productId
    return api.delete(`/users/me/liked-products/${productId}`);
};

const getLikedProductIds = () => {
    // Rota: GET /api/users/me/liked-products/ids
    return api.get('/users/me/liked-products/ids');
};

const getLikedProducts = () => {
    // Rota: GET /api/users/me/liked-products
    return api.get('/users/me/liked-products');
};

const userService = {
    login,
    signup,
    getMyProfile,
    updateUser,
    getUserDetails,
    likeProduct,
    unlikeProduct,
    getLikedProductIds,
    getLikedProducts
};

export default userService;