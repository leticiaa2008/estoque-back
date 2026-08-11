const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();


// ======================================================
// MIDDLEWARES
// ======================================================

app.use(cors());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

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
// ROTA PRINCIPAL (Servir a interface HTML)
// ======================================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ======================================================
// ROTA DE TESTE DA API
// ======================================================

app.get("/api", (req, res) => {

    res.json({
        sucesso: true,
        sistema: "Controle de Estoque & Arquivo Morto",
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

if (require.main === module) {
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
}

module.exports = app;

