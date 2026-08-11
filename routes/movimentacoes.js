const express = require("express");

const router = express.Router();

const {
    registrarEntrada,
    registrarSaida,
    listarMovimentacoes
} = require("../controllers/movimentacoesController");


router.get("/", listarMovimentacoes);

router.post("/entrada", registrarEntrada);

router.post("/saida", registrarSaida);


module.exports = router;