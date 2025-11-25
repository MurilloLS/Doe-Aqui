import api from './api'

// --- Rotas Protegidas ---
const getChatPartners = () => {
    // Rota: GET /messages/chats
    return api.get(`/messages/chats`);
};

const getMessagesByUserId = (userId) => {
    // Rota: GET /messages/:id
    return api.get(`/messages/${userId}`);
};

const sendMessage = (userId, formData) => {
    // Rota: POST /messages/send/:id
    return api.post(`/messages/send/${userId}`, formData);
};

const messageService = {
    getChatPartners,
    getMessagesByUserId,
    sendMessage
}

export default messageService;