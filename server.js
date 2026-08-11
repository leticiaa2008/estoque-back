const express = require("express");
const cors = require("cors");
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


// ======================================================
// ROTAS
// ======================================================

const familiasRoutes =
    require("./routes/familias");

const tiposRoutes =
    require("./routes/tipos");

const produtosRoutes =
    require("./routes/produtos");

const movimentacoesRoutes =
    require("./routes/movimentacoes");


app.use("/api/familias", familiasRoutes);

app.use("/api/tipos", tiposRoutes);

app.use("/api/produtos", produtosRoutes);

app.use(
    "/api/movimentacoes",
    movimentacoesRoutes
);


// ======================================================
// ROTA PRINCIPAL
// ======================================================

app.get("/", (req, res) => {

    res.json({
        sucesso: true,
        sistema: "Controle de Estoque & Arquivo Morto",
        status: "online",
        versao: "1.0.0"
    });

});


// ======================================================
// ROTA DE TESTE
// ======================================================

app.get("/api", (req, res) => {

    res.json({
        sucesso: true,
        mensagem:
            "API do Controle de Estoque funcionando!",
        rotas: {
            familias: "/api/familias",
            tipos: "/api/tipos",
            produtos: "/api/produtos",
            movimentacoes:
                "/api/movimentacoes"
        }
    });

});


// ======================================================
// TRATAMENTO DE ROTA INEXISTENTE
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

const PORT =
    process.env.PORT || 3000;


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