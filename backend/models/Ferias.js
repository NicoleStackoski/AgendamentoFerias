const pool = require("../database/db");

class Ferias {

  static async create(data) {
    const {
      usuario_nome,
      cargo,
      data_inicio,
      data_fim,
      cobertura,
      observacao
    } = data;

    await pool.query(
      `INSERT INTO ferias 
      (usuario_nome, cargo, data_inicio, data_fim, cobertura, observacao)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [usuario_nome, cargo, data_inicio, data_fim, cobertura, observacao]
    );
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM ferias ORDER BY data_solicitacao DESC"
    );
    return result.rows;
  }

  static async delete(id) {
    await pool.query("DELETE FROM ferias WHERE id = $1", [id]);
  }

}

module.exports = Ferias;
