const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');
require('dotenv').config();

// Middleware customizado para corrigir URLs do S3
const fixS3Urls = (req, res, next) => {
    if (req.file) {
        // Construir URL manualmente com o formato correto
        const bucket = process.env.AWS_S3_BUCKET;
        const region = process.env.AWS_REGION || 'us-east-1';
        const key = req.file.key;
        req.file.location = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }
    if (req.files) {
        Object.keys(req.files).forEach(fieldname => {
            if (req.files[fieldname] && req.files[fieldname].length > 0) {
                req.files[fieldname].forEach(file => {
                    const bucket = process.env.AWS_S3_BUCKET;
                    const region = process.env.AWS_REGION || 'us-east-1';
                    const key = file.key;
                    file.location = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
                });
            }
        });
    }
    next();
};

// Configuração do multer com S3
const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Organiza imagens em pastas por tipo
            const folder = file.fieldname === 'profilePic' ? 'profile-pictures' : 'product-images';
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${folder}/${file.fieldname}-${uniqueSuffix}`;
            cb(null, filename);
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    },
    fileFilter: function (req, file, cb) {
        // Apenas aceita imagens
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas ficheiros de imagem são permitidos'));
        }
    }
});

// Exportar tanto o multer quanto o middleware de correção de URLs
module.exports = uploadS3;
module.exports.fixS3Urls = fixS3Urls;
