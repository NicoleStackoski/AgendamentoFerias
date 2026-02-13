const express = require("express");
const router = express.Router();
const {
  readFerias,
  writeFerias,
  readUsers
} = require("../database/jsonDB");
const crypto = require("crypto");

router.get("/", (req, res) => {
  const ferias = readFerias();
  const users = readUsers();

  let alterou = false;

  ferias.forEach(f => {

    if (!f.dataSolicitacao) {
      f.dataSolicitacao = new Date().toISOString();
      alterou = true;
    }

    
    const loginFerias =
      typeof f.login === "string"
        ? f.login.toLowerCase().trim()
        : null;

    
    const user = loginFerias
      ? users.find(
          u => u.login.toLowerCase().trim() === loginFerias
        )
      : null;

    
    if (!f.cargo) {
      f.cargo = user?.cargo || "adm";
      alterou = true;
    }
  });

  if (alterou) {
    writeFerias(ferias);
  }

  ferias.sort(
    (a, b) => new Date(a.dataSolicitacao) - new Date(b.dataSolicitacao)
  );

  res.json(ferias);
});

// Cadastrar novas férias
router.post("/", (req, res) => {
  const ferias = readFerias();

  const novo = {
    id: crypto.randomUUID(),
    login: req.body.login, 
    cargo: req.body.cargo || "adm", 
    inicio: req.body.inicio,
    fim: req.body.fim,
    cobertura: req.body.cobertura || [],
    observacao: req.body.observacao || "",
    status: "pendente",
    motivoRejeicao: "",
    dataSolicitacao: new Date().toISOString()
  };

  ferias.push(novo);
  writeFerias(ferias);

  res.status(201).json({
    message: "Férias cadastradas com sucesso!",
    data: novo
  });
});

// Login Master rejeita as férias
router.put("/rejeitar/:id", (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  const ferias = readFerias();
  const registro = ferias.find(f => f.id === id);

  if (!registro) {
    return res.status(404).json({
      error: "Registro de férias não encontrado."
    });
  }

  registro.status = "rejeitada";
  registro.motivoRejeicao = motivo || "Sem motivo informado";

  writeFerias(ferias);

  res.json({
    message: "Férias rejeitadas com sucesso!",
    data: registro
  });
});

// Excluir férias users
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { usuario } = req.query;

  if (!usuario) {
    return res.status(400).json({
      error: "Usuário não informado."
    });
  }

  const ferias = readFerias();
  const registro = ferias.find(f => f.id === id);

  if (!registro) {
    return res.status(404).json({
      error: "Registro de férias não encontrado."
    });
  }

  if (
    !registro.login ||
    registro.login.toLowerCase() !== usuario.toLowerCase()
  ) {
    return res.status(403).json({
      error: "Sem permissão para excluir estas férias."
    });
  }

  const filtrado = ferias.filter(f => f.id !== id);
  writeFerias(filtrado);

  res.json({
    message: "Férias excluídas com sucesso!"
  });
});

module.exports = router;
