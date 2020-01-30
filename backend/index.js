const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const routes = require("./routes");
const { setupWebSocket } = require("./websocket");

const app = express();
const server = http.Server(app);

setupWebSocket(server);

// Conecta ao banco de dados
mongoose.connect(
  "mongodb+srv://USERNAME:PASSWORD@cluster0-fvpm9.mongodb.net/DATABASE?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Libera para o React(porta padrão) acessar
// app.use(cors({ origin: "http://localhost:3000" }));
// Libera o acesso para qualquer aplicação
app.use(cors());

// Configuração para o express entender requisições com o corpo em json
app.use(express.json());

// Configuração para o express saber onde procurar as rotas
app.use(routes);

// Escuta as requisições na porta 3333
server.listen(3333);
