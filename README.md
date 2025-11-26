# Doe Aqui 🤝

> Plataforma de doação de produtos.

O **Doe Aqui** é uma aplicação completa (Full Stack) que conecta pessoas que desejam doar itens a quem precisa. O projeto é dividido em uma API RESTful robusta e um frontend moderno e responsivo.

## 🚀 Estrutura do Projeto

O repositório está organizado em dois diretórios principais (monorepo):

  * **[`node-app/`](https://github.com/MurilloLS/Doe-Aqui/tree/main/node-app)**: O Backend da aplicação. API construída com Node.js, Express e MongoDB. Gerencia usuários, produtos, autenticação e o chat em tempo real.
  * **[`react-app/`](https://github.com/MurilloLS/Doe-Aqui/blob/main/Frontend.md)**: O Frontend da aplicação. Interface SPA construída com React, Tailwind CSS e Socket.io Client para interação com o usuário.

-----

## 📚 Documentação Técnica

Para detalhes específicos sobre instalação, configuração e funcionalidades de cada parte, consulte as documentações individuais:

### 🛠️ [Documentação do Backend (API)](https://github.com/MurilloLS/Doe-Aqui/blob/main/API.md)

  * **Tecnologias:** Node.js, Express, Mongoose, JWT, AWS S3.
  * **Conteúdo:**
      * Configuração de variáveis de ambiente (`.env`).
      * Configuração do Banco de Dados e AWS S3.
      * Definição dos Schemas (User, Product, Message).
      * Lista completa de Endpoints da API.

### 💻 [Documentação do Frontend (Cliente)](https://github.com/MurilloLS/Doe-Aqui/blob/main/Frontend.md)

  * **Tecnologias:** React, Tailwind CSS (DaisyUI), Context API, Zustand, Socket.io.
  * **Conteúdo:**
      * Instalação e execução do servidor de desenvolvimento.
      * Estrutura de pastas e componentes.
      * Configuração de Rotas e Serviços.

-----

## ✨ Funcionalidades Principais

1.  **Doação de Produtos:** Cadastro de itens com fotos (upload via S3), descrição, categoria e localização.
2.  **Geolocalização:** Visualização aproximada de onde o produto se encontra.
3.  **Chat em Tempo Real:** Comunicação direta entre doador e interessado via Socket.io.
4.  **Sistema de Likes:** Usuários podem salvar produtos de interesse.
5.  **Perfis de Usuário:** Suporte para diferentes tipos de usuários (Indivíduos, ONGs, Empresas).

-----

## 📄 Licença

Este projeto está licenciado sob os termos definidos no arquivo [`LICENSE`](https://github.com/MurilloLS/Doe-Aqui/blob/main/LICENSE).
