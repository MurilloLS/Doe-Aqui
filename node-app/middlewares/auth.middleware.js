// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // 1. Verificar se o cabeçalho de autorização existe e está bem formatado
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: 'Acesso negado. Token não fornecido ou mal formatado.' });
        }

        // 2. Extrair o token de forma segura
        const token = authHeader.split(' ')[1];
        
        // 3. Verificar o token
        const decodedToken = jwt.verify(token, 'MYKEY');
        req.user = decodedToken.data;

        next();

    } catch (error) {
        // Captura erros de token expirado ou inválido
        res.status(401).send({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = authMiddleware;