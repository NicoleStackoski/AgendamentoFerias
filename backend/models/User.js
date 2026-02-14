const pool = require("../database/db");

class User {

  static async findByLogin(login) {
    const result = await pool.query(
      "SELECT * FROM users WHERE nome = $1",
      [login]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  static async create(data) {
    const { login, senha, tipo, cargo } = data;

    await pool.query(
      "INSERT INTO users (nome, senha, tipo, cargo) VALUES ($1, $2, $3, $4)",
      [login, senha, tipo, cargo]
    );
  }

  static async update(login, newData) {
    const { senha } = newData;

    await pool.query(
      "UPDATE users SET senha = $1 WHERE nome = $2",
      [senha, login]
    );
  }
}

module.exports = User;
