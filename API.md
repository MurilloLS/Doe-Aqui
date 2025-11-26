# Documentação Técnica do Backend - Doe Aqui

## 1. Visão Geral
O **node-app** é uma API RESTful desenvolvida em Node.js/Express. Serve como backend para a plataforma "Doe Aqui", gerindo autenticação, perfis de utilizadores e um catálogo de produtos para doação com suporte a geolocalização e upload de imagens.

### Tecnologias Principais
* **Core:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Auth:** JWT (JSON Web Tokens), Bcrypt
* **Storage:** AWS S3 (via `@aws-sdk/client-s3` e `multer-s3`)

---

## 2. Instalação e Configuração

### Pré-requisitos
Certifique-se de ter configurado um arquivo `.env` na raiz `node-app/` com as seguintes chaves:

```env
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=sua_chave_secreta
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=nome-do-bucket
````

### Comandos

Scripts definidos no `package.json`:

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (com nodemon)
npm run dev

# Rodar em produção
npm start
```

-----

## 3\. Modelos de Dados (Schemas)

### User Schema (`models/user.model.js`)

Define os dados dos utilizadores (Físicos, ONGs ou Empresas).

| Campo | Tipo | Detalhes |
| :--- | :--- | :--- |
| `username` | String | Nome de exibição. |
| `email` | String | Único no sistema. |
| `password` | String | Armazenado como hash. |
| `user_type` | String | Enum: `['INDIVIDUAL', 'NGO', 'COMPANY']`. |
| `mobile` | String | Telefone de contato. |
| `document` | String | CPF/CNPJ (Único e esparso). |
| `location_city` | String | Cidade. |
| `location_state` | String | Estado. |
| `profilePic` | String | URL da imagem no S3. |
| `likedProducts`| Array | Lista de IDs (`ObjectId`) referenciando `Products`. |

### Product Schema (`models/product.model.js`)

Define os itens disponíveis para doação.

| Campo | Tipo | Detalhes |
| :--- | :--- | :--- |
| `pname` | String | Título do produto. |
| `pdesc` | String | Descrição detalhada. |
| `category` | String | Categoria do item. |
| `listing_type` | String | Tipo de listagem. |
| `addedBy` | ObjectId | Referência ao `Users` (dono do item). |
| `pLoc` | Object | GeoJSON Point `{ type: 'Point', coordinates: [lon, lat] }`. Indexado como `2dsphere`. |
| `pimage` | String | URL da imagem principal (S3). |
| `pimage2` | String | URL da imagem secundária (S3). |

-----

## 4\. API Endpoints

A API está dividida em dois recursos principais: **Products** e **Users**.

**Base URL:** `http://localhost:4000/api`

### 📦 Produtos (`/api/products`)

Gerenciamento de itens para doação.

| Método | Endpoint | Descrição | Parâmetros / Body Esperado |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Lista todos os produtos. | Query Params opcionais. |
| **GET** | `/search` | Busca produtos. | Params de busca (ex: `?search=xyz`). |
| **GET** | `/:productId` | Detalhes de um produto. | `productId`: ID do MongoDB. |
| **POST** | `/` | Cria um novo produto. | **Multipart/Form-Data**:<br>- `pname`, `pdesc`, `category`, `listing_type`<br>- `pLoc` (coords)<br>- `pimage` (Arquivo)<br>- `pimage2` (Arquivo) |
| **PUT** | `/:productId` | Atualiza um produto. | Mesmo formato do POST (campos opcionais). |
| **DELETE**| `/:productId` | Remove um produto. | `productId`: ID do produto a remover. |
| **GET** | `/user/my-products`| Lista produtos do utilizador logado. | N/A |

### 👤 Usuários (`/api/users`)

Gerenciamento de contas e interação social (likes).

| Método | Endpoint | Descrição | Parâmetros / Body Esperado |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | Cria uma nova conta. | **Multipart/Form-Data**:<br>- `username`, `email`, `password`<br>- `user_type`, `mobile`<br>- `location_city`, `location_state`<br>- `profilePic` (Arquivo) |
| **POST** | `/login` | Autentica o utilizador. | **JSON**:<br>`{ "email": "...", "password": "..." }` |
| **GET** | `/me` | Dados do utilizador logado. | Header `Authorization: Bearer <token>` |
| **PUT** | `/me` | Atualiza perfil logado. | Suporta atualização de campos e upload de nova `profilePic`. |
| **GET** | `/:userId` | Perfil público de outro user. | `userId`: ID do utilizador alvo. |

### ❤️ Likes / Favoritos

Endpoints específicos para gerir a lista de interesses.

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/me/liked-products` | Retorna a lista completa (objetos) de produtos curtidos. |
| **GET** | `/me/liked-products/ids`| Retorna apenas uma lista de IDs dos produtos curtidos. |
| **POST** | `/me/liked-products` | Adiciona like. **Body:** `{ "productId": "..." }` |
| **DELETE**| `/me/liked-products/:productId` | Remove o like de um produto específico. |


### 💬 Mensagens (`/api/messages`)

Rotas para chat privado entre utilizadores. Todas exigem autenticação via token JWT.

**Base URL:** `/api/messages`

| Método | Rota (Endpoint) | Descrição | Parâmetros e Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/:id` | Retorna o histórico de conversas entre o utilizador logado e o utilizador alvo (`:id`). | **Params:** `id` (ID do utilizador com quem se fala).<br>**Retorno:** Array de objetos `Message`. |
| **POST** | `/send/:id` | Envia uma nova mensagem para o utilizador alvo (`:id`). | **Params:** `id` (ID do destinatário).<br>**Body (JSON):**<br>`{`<br>  `"text": "Olá, tenho interesse...",`<br>  `"image": "https://..."` (Opcional)<br>`}` |

> **Nota sobre Real-time:** O backend possui dependências de `socket.io` para comunicação em tempo real, permitindo que mensagens enviadas via API sejam recebidas instantaneamente pelos clientes conectados, sem necessidade de *refresh*.
-----

## 5\. Middleware e Fluxos Especiais

### Autenticação (`auth.middleware.js`)

O sistema utiliza **JWT (JSON Web Token)**. Rotas protegidas exigem o cabeçalho:
`Authorization: Bearer <SEU_TOKEN>`
O middleware decodifica o token e injeta os dados do utilizador em `req.user`.

### Upload de Imagens (`uploadS3.middleware.js`)

O upload é feito diretamente para o AWS S3 usando `multer-s3`.

  * **Imagens de Perfil:** Salvas na pasta `profile-pictures/`.
  * **Imagens de Produtos:** Salvas na pasta `product-images/`.
  * **Correção de URL:** O middleware `fixS3Urls` garante que o campo no banco de dados receba a URL pública completa (`https://bucket.s3...`).
