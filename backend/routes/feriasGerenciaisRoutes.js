const express = require("express");
const router = express.Router();

const {
  listarFeriasGerenciais,
  criarFeriasGerenciais,
  excluirFeriasGerenciais
} = require("../controllers/feriasGerenciaisController");

router.get("/", listarFeriasGerenciais);
router.post("/", criarFeriasGerenciais);
router.delete("/:id", excluirFeriasGerenciais);

module.exports = router;
