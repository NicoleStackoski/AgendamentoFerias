const pool = require("../database/db");


// 🔹 LISTAR
async function listarFeriasGerenciais(req, res) {
  try {

    const result = await pool.query(
      "SELECT * FROM ferias_gerenciais ORDER BY criado_em DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar férias gerenciais" });
  }
}


// 🔹 CRIAR
async function criarFeriasGerenciais(req, res) {
  try {

    const {
      gerente,
      dataInicio,
      dataFim,
      filial = [],
      canal = [],
      marca = [],
      cobertura = [],
      observacao = ""
    } = req.body;

    if (!gerente || !dataInicio || !dataFim) {
      return res.status(400).json({
        error: "Gerente e período são obrigatórios"
      });
    }

    await pool.query(
      `INSERT INTO ferias_gerenciais 
      (nome_gerente, data_inicio, data_fim, filial, marca, canal, cobertura, observacao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        gerente,
        dataInicio,
        dataFim,
        Array.isArray(filial) ? filial.join(", ") : filial,
        Array.isArray(marca) ? marca.join(", ") : marca,
        Array.isArray(canal) ? canal.join(", ") : canal,
        Array.isArray(cobertura) ? cobertura.join(", ") : cobertura,
        observacao
      ]
    );

    res.status(201).json({ message: "Férias gerenciais cadastradas com sucesso!" });

  } catch (err) {
    console.error("ERRO AO SALVAR FÉRIAS GERENCIAIS:", err);
    res.status(500).json({ error: "Erro ao salvar férias gerenciais" });
  }
}


// 🔹 EXCLUIR
async function excluirFeriasGerenciais(req, res) {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM ferias_gerenciais WHERE id = $1",
      [id]
    );

    res.sendStatus(204);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir férias gerenciais" });
  }
}


module.exports = {
  listarFeriasGerenciais,
  criarFeriasGerenciais,
  excluirFeriasGerenciais
};
