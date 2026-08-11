const express = require("express");

const router = express.Router();

const {
    listarFamilias,
    buscarFamilia,
    criarFamilia,
    atualizarFamilia,
    excluirFamilia
} = require("../controllers/familiasController");


router.get("/", listarFamilias);

router.get("/:id", buscarFamilia);

router.post("/", criarFamilia);

router.put("/:id", atualizarFamilia);

router.delete("/:id", excluirFamilia);


module.exports = router;