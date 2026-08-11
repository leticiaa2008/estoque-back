const express = require("express");

const router = express.Router();

const {
    listarTipos,
    buscarTipo,
    criarTipo,
    atualizarTipo,
    excluirTipo
} = require("../controllers/tiposController");


router.get("/", listarTipos);

router.get("/:id", buscarTipo);

router.post("/", criarTipo);

router.put("/:id", atualizarTipo);

router.delete("/:id", excluirTipo);


module.exports = router;