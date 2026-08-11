const express = require("express");

const router = express.Router();

const {
    listarProdutos,
    buscarProdutoPorSKU,
    criarProduto,
    atualizarProduto,
    excluirProduto
} = require("../controllers/produtosController");


router.get("/", listarProdutos);

router.get("/sku/:sku", buscarProdutoPorSKU);

router.post("/", criarProduto);

router.put("/:id", atualizarProduto);

router.delete("/:id", excluirProduto);


module.exports = router;