const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Servir arquivos estáticos do frontend (JS, CSS, Imagens)
app.use(express.static(path.join(__dirname, "public")));

// 2. Rotas da API
app.use("/api/familias", require("./routes/familias"));
app.use("/api/tipos", require("./routes/tipos"));
app.use("/api/produtos", require("./routes/produtos"));
app.use("/api/movimentacoes", require("./routes/movimentacoes"));

// 3. Entrega o frontend ao acessar qualquer rota do navegador
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // Se for /api e não existir, passa para o 404 da API
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 4. Tratamento de erro 404 da API
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: "Rota da API não encontrada." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app;
