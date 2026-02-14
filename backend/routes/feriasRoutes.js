const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// 🔹 LISTAR FÉRIAS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        usuario_nome,
        cargo,
        data_inicio,
        data_fim,
        cobertura,
        observacao,
        status,
        motivo_rejeicao,
        data_solicitacao
      FROM ferias
      ORDER BY data_solicitacao ASC
    `);

    const dadosFormatados = result.rows.map(f => ({
      id: f.id,
      login: f.usuario_nome,
      cargo: f.cargo,
      inicio: f.data_inicio,
      fim: f.data_fim,
      cobertura: f.cobertura ? f.cobertura.split(", ") : [],
      observacao: f.observacao,
      status: f.status,
      motivoRejeicao: f.motivo_rejeicao,
      dataSolicitacao: f.data_solicitacao
    }));

    res.json(dadosFormatados);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar férias" });
  }
});

// 🔹 CADASTRAR FÉRIAS
router.post("/", async (req, res) => {
  try {
    const {
      login,
      cargo,
      inicio,
      fim,
      cobertura,
      observacao
    } = req.body;

    const coberturaString = Array.isArray(cobertura)
      ? cobertura.join(", ")
      : cobertura || "";

    const result = await pool.query(
      `INSERT INTO ferias 
      (usuario_nome, cargo, data_inicio, data_fim, cobertura, observacao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        login,
        cargo || "adm",
        inicio,
        fim,
        coberturaString,
        observacao || ""
      ]
    );

    const f = result.rows[0];

    res.status(201).json({
      message: "Férias cadastradas com sucesso!",
      data: {
        id: f.id,
        login: f.usuario_nome,
        cargo: f.cargo,
        inicio: f.data_inicio,
        fim: f.data_fim,
        cobertura: f.cobertura ? f.cobertura.split(", ") : [],
        observacao: f.observacao,
        status: f.status,
        motivoRejeicao: f.motivo_rejeicao,
        dataSolicitacao: f.data_solicitacao
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar férias" });
  }
});

// 🔹 REJEITAR FÉRIAS
router.put("/rejeitar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    await pool.query(
      `UPDATE ferias 
       SET status = 'rejeitada', motivo_rejeicao = $1 
       WHERE id = $2`,
      [motivo || "Sem motivo informado", id]
    );

    res.json({ message: "Férias rejeitadas com sucesso!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao rejeitar férias" });
  }
});

// 🔹 EXCLUIR FÉRIAS
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM ferias WHERE id = $1",
      [id]
    );

    res.json({ message: "Férias excluídas com sucesso!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir férias" });
  }
});

module.exports = router;
