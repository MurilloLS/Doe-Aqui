# 🚀 Guia de Configuração AWS S3

Este guia explica como configurar o AWS S3 para armazenar imagens do Doe-Aqui.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Configuração do Bucket](#configuração-do-bucket)
5. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- ✅ Conta AWS ativa
- ✅ IAM user com permissões S3
- ✅ Access Key ID e Secret Access Key do IAM user
- ✅ Node.js 14+ instalado

---

## Configuração Inicial

### 1. Criar um Bucket S3

```bash
# AWS Console → S3 → Create Bucket
# Nome sugerido: doe-aqui-uploads (ou seu-projeto-uploads)
# Região: us-east-1 (ou sua região preferida)
```

**Configurações recomendadas:**
- ✅ Block all public access = **OFF** (desativado)
- ✅ Enable versioning = **OFF** (opcional)
- ✅ Enable logging = **ON** (recomendado)

---

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `node-app/`:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua_access_key_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_key_aqui
AWS_S3_BUCKET=doe-aqui-uploads

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=sua_chave_jwt_secreta_aqui

# Server
PORT=4000
```

---

## Configuração do Bucket

### Opção 1: Via AWS Console (Recomendado para Iniciantes)

#### 1.1 Bucket Policy (Permitir acesso público)

```
AWS Console → S3 → seu-bucket → Permissions → Bucket Policy
```

Cole isto:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::doe-aqui-uploads/*"
    }
  ]
}
```

**Substitua `doe-aqui-uploads` pelo seu nome de bucket.**

#### 1.2 CORS Configuration (Permitir requisições do navegador)

```
AWS Console → S3 → seu-bucket → Permissions → CORS
```

Cole isto:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://seu-dominio-producao.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**Atualize os domínios conforme necessário.**

### Opção 2: Via Script Node.js

Se seu IAM user tiver permissões `s3:PutBucketPolicy` e `s3:PutBucketCors`:

```bash
# ⚠️ ATENÇÃO: Use apenas se tiver permissões IAM

# Configurar Bucket Policy
node scripts/setup-bucket-policy.js

# Configurar CORS
node scripts/setup-cors.js
```

**Se receber erro de IAM**, use a Opção 1 (AWS Console).

---

## Verificação de Dados

Para verificar se as URLs estão sendo salvas corretamente no MongoDB:

```bash
node scripts/debug-users.js
```

**Saída esperada:**
```
✅ Conectado ao MongoDB

👤 Primeiro Usuário:
{
  "profilePic": "https://doe-aqui-uploads.s3.us-east-1.amazonaws.com/profile-pictures/profilePic-1763225633686-758714234"
}

📦 Primeiro Produto:
{
  "pimage": "https://doe-aqui-uploads.s3.us-east-1.amazonaws.com/product-images/pimage-1763225930418-260365859"
}
```

Se as URLs estiverem corretas, a configuração S3 está funcionando! ✅

---

## Troubleshooting

### ❌ Erro: "403 Forbidden" ao acessar imagens

**Possíveis causas:**

1. **Bucket Policy não configurada**
   - Solução: Execute a Seção 1.1 acima

2. **Block all public access = ON**
   - Solução: AWS Console → S3 → seu-bucket → Permissions → Block all public access → OFF

3. **CORS não configurado**
   - Solução: Execute a Seção 1.2 acima

### ❌ Erro: "InvalidAccessKeyId" ao fazer upload

**Causas:**
- Access Key ID incorreta
- Credenciais expiradas
- `.env` não carregado

**Solução:**
```bash
# Verificar se .env existe
cat .env

# Ou reiniciar o servidor
npm run dev
```

### ❌ Erro: "NoSuchBucket"

**Causa:** Nome do bucket em `.env` está incorreto

**Solução:**
```bash
# Verificar nome exato do bucket
# AWS Console → S3 → ver nome do bucket
# Atualizar: AWS_S3_BUCKET=nome_correto em .env
```

### ❌ Imagens não aparecem no frontend

1. Verificar URL no MongoDB:
   ```bash
   node scripts/debug-users.js
   ```

2. Copiar URL e testar em navegador:
   ```
   https://seu-bucket.s3.us-east-1.amazonaws.com/caminho/image.jpg
   ```

3. Se URL funciona no navegador mas não na app:
   - Verificar CORS (Seção 1.2)
   - Limpar cache do navegador (Ctrl+F5)

---

## 📚 Referências

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## ✅ Checklist de Configuração

- [ ] Bucket S3 criado
- [ ] Access Key ID configurada em `.env`
- [ ] Secret Access Key configurada em `.env`
- [ ] Bucket Policy aplicada
- [ ] CORS configurado
- [ ] Block public access = OFF
- [ ] Teste de upload funcionando
- [ ] `debug-users.js` mostrando URLs corretas
- [ ] Imagens aparecem no frontend

---

**Dúvidas?** Consulte este documento ou abra uma issue no repositório.
