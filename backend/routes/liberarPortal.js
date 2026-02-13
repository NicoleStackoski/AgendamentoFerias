const express = require("express");
const router = express.Router();
const { readLiberados, writeLiberados, readUsers } = require("../database/jsonDB");

// Listar os users
router.get("/usuarios", (req, res) => {
  try {
    const users = readUsers(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar usuários." });
  }
});

// Listar liberados
router.get("/", (req, res) => {
  try {
    const liberados = readLiberados();
    res.json(liberados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar lista de liberados." });
  }
});

// Liberar 
router.post("/", (req, res) => {
  try {
    const liberados = readLiberados();
    const usuario = req.body.usuario;

    if (!usuario) {
      return res.status(400).json({ message: "Usuário é obrigatório." });
    }

    // evitar duplicado
    if (liberados.some(l => l.usuario === usuario)) {
      return res.status(400).json({ message: "Usuário já está liberado." });
    }

    const novo = { usuario };
    liberados.push(novo);
    writeLiberados(liberados);

    res.json({ 
      message: "Portal liberado para usuário!", 
      liberados 
    });

  } catch (error) {
    res.status(500).json({ message: "Erro ao liberar portal." });
  }
});

// Remover
router.delete("/:usuario", (req, res) => {
  try {
    const usuario = req.params.usuario;
    let liberados = readLiberados();

    liberados = liberados.filter(l => l.usuario !== usuario);
    writeLiberados(liberados);

    res.json({ 
      message: "Liberação removida!", 
      liberados 
    });

  } catch (error) {
    res.status(500).json({ message: "Erro ao remover liberação." });
  }
});

module.exports = router;
