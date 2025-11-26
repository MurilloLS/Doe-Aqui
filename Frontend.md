# Documentação do Frontend (react-app) - Doe Aqui

## 1. Visão Geral
O `react-app` é a interface de utilizador (client-side) da plataforma "Doe Aqui". É uma aplicação *Single Page Application* (SPA) construída com **React**, focada na experiência de doação, troca de mensagens em tempo real e geolocalização de itens. A aplicação consome a API REST do backend (`node-app`) e utiliza WebSockets para o chat.

## 2. Tecnologias Principais

Baseado no `package.json`:

* **Core:** React (`^18.x`), React DOM, React Scripts.
* **Roteamento:** React Router DOM (`^6.x`).
* **Estilização:** Tailwind CSS (framework utilitário) com plugin **DaisyUI**.
* **Requisições HTTP:** Axios.
* **Gerenciamento de Estado:**
    * **Context API:** Para produtos curtidos (`LikedProductsContext`).
    * **Zustand:** Para gerenciamento do estado global do Chat e Socket.io.
* **Tempo Real:** Socket.io Client (`socket.io-client`).
* **Mapas:** React Leaflet & Leaflet (OpenStreetMap).
* **UI/UX:**
    * `react-toastify`: Notificações (Toasts).
    * `lucide-react` & `@heroicons/react`: Ícones.
    * `react-slick` & `slick-carousel`: Carrossel de imagens.
    * `framer-motion`: Animações.

## 3. Instalação e Execução

### Pré-requisitos
* Node.js e NPM instalados.
* O backend (`node-app`) deve estar rodando na porta `4000` (ou conforme configurado na API).

### Instalação
Navegue até a pasta `react-app` e instale as dependências:
```bash
cd react-app
npm install
```

### Execução (Desenvolvimento)
Para iniciar o servidor de desenvolvimento:
```bash
npm start
```
A aplicação estará disponível em `http://localhost:3000`.

## 4. Estrutura do Projeto

A estrutura de pastas dentro de `src/` segue uma organização modular:

```text
src/
├── assets/              # Imagens estáticas (logos, placeholders)
├── components/          # Componentes reutilizáveis
│   ├── messageComponents/ # Componentes específicos do Chat (Input, Lista, Skeleton)
│   ├── Header.jsx       # Barra de navegação principal
│   ├── ProductCard.js   # Card de exibição de item
│   └── ...
├── contexts/            # React Context API (ex: LikedProductsContext)
├── pages/               # Componentes de Página (Views das Rotas)
├── services/            # Camada de comunicação com API (Axios)
├── store/               # Gerenciamento de estado global (Zustand - useChatStore)
├── styles/              # Arquivos CSS globais ou específicos de página
├── App.js               # Definição de Rotas e Layout base
└── index.js             # Ponto de entrada (Providers e Styles)
```

## 5. Roteamento (Pages)

As rotas são definidas no `App.js` utilizando `react-router-dom`.

| Rota | Componente | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | Página inicial com listagem e busca. | Público |
| `/login` | `LoginPage` | Formulário de login. | Público |
| `/signup` | `SignupPage` | Formulário de cadastro. | Público |
| `/product/:id` | `ProductDetailPage`| Detalhes completos do produto (mapa, imagens). | Público |
| `/category/:category`| `CategoryPage` | Filtro de produtos por categoria. | Público |
| `/add-product` | `AddProductPage` | Formulário para adicionar nova doação. | **Privado** |
| `/my-products` | `MyProductsPage` | Lista de itens cadastrados pelo utilizador. | **Privado** |
| `/edit-product/:id` | `EditProductPage`| Edição de produto existente. | **Privado** |
| `/my-profile` | `MyProfilePage` | Visualização do perfil do utilizador. | **Privado** |
| `/edit-profile` | `EditProfilePage` | Edição de dados do utilizador. | **Privado** |
| `/liked-products` | `LikedProductsPage`| Lista de favoritos. | **Privado** |
| `/chats` | `ChatsPage` | Interface de chat em tempo real. | **Privado** |

## 6. Funcionalidades Principais

### Autenticação e API
A comunicação com o backend é centralizada na pasta `services/`.
* **`api.js`**: Instância do Axios. Intercepta requisições para injetar o token JWT armazenado no `localStorage`.
* **`userService.js`**: Login, registro e dados de perfil.
* **`productService.js`**: CRUD de produtos, busca e sistema de *likes*.
* **`messageService.js`**: Histórico de mensagens e envio via API.

### Sistema de Chat (Real-time)
O módulo de chat (`/chats`) é robusto e utiliza **Socket.io** e **Zustand**.
* **Gerenciamento de Estado (`useChatStore.js`)**: Controla a lista de mensagens, utilizadores online, conexão do socket e estado de carregamento.
* **Componentes**:
    * `ChatContainer.jsx`: Área principal da conversa.
    * `ChatList.jsx`: Sidebar com lista de utilizadores disponíveis.
    * `MessageInput.jsx`: Campo de envio de texto/imagem.

### Geolocalização e Mapas
Utiliza `react-leaflet` para exibir a localização aproximada dos produtos doados na página de detalhes (`ProductDetailPage`).

### Favoritos (Likes)
Utiliza um contexto global `LikedProductsContext` para garantir que o estado dos corações (likes) nos cards de produtos esteja sincronizado em toda a aplicação sem necessidade de recarregar a página.

## 7. Estilização
O projeto utiliza uma abordagem moderna com **Tailwind CSS**.
* Configuração no `tailwind.config.js`: Inclui o plugin **DaisyUI** para componentes pré-estilizados (botões, inputs, modais).
* Animações: `framer-motion` é usado para transições suaves.
* Responsividade: Layout adaptável para mobile e desktop.
