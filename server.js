const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();


// ======================================================
// MIDDLEWARES
// ======================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// Servir arquivos estáticos da pasta public (index.html, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));


// ======================================================
// ROTAS DA API
// ======================================================

const familiasRoutes = require("./routes/familias");
const tiposRoutes = require("./routes/tipos");
const produtosRoutes = require("./routes/produtos");
const movimentacoesRoutes = require("./routes/movimentacoes");

app.use("/api/familias", familiasRoutes);
app.use("/api/tipos", tiposRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/movimentacoes", movimentacoesRoutes);


// ======================================================
// ROTA DE TESTE DA API
// ======================================================

app.get("/api", (req, res) => {
    res.json({
        sucesso: true,
        sistema: "Controle de Estoque & Arquivo Morto",
        mensagem: "API do Controle de Estoque funcionando!",
        status: "online",
        versao: "1.0.0",
        rotas: {
            familias: "/api/familias",
            tipos: "/api/tipos",
            produtos: "/api/produtos",
            movimentacoes: "/api/movimentacoes"
        }
    });
});


// ======================================================
// ROTA PRINCIPAL / CATCH-ALL (ENTREGA O FRONTEND)
// ======================================================

app.get("*", (req, res, next) => {
    // Se a requisição for para a API e não encontrou a rota, passa para o handler de 404
    if (req.path.startsWith("/api")) {
        return next();
    }
    // Caso contrário, carrega a tela do frontend (index.html)
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ======================================================
// TRATAMENTO DE ROTA INEXISTENTE DA API
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: "Rota não encontrada."
    });
});


// ======================================================
// TRATAMENTO GLOBAL DE ERROS
// ======================================================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno do servidor."
    });
});


// ======================================================
// SERVIDOR
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
========================================
   📦 CONTROLE DE ESTOQUE & ARQUIVO
========================================

🚀 Servidor: http://localhost:${PORT}

📡 API:
   http://localhost:${PORT}/api

📁 Famílias:
   http://localhost:${PORT}/api/familias

🏷️ Tipos:
   http://localhost:${PORT}/api/tipos

📦 Produtos:
   http://localhost:${PORT}/api/produtos

🔄 Movimentações:
   http://localhost:${PORT}/api/movimentacoes

========================================
    `);
});