require("dotenv").config();
const pool = require("./database/db");
const usersJson = require("./data/users.json");

async function migrate() {
  try {
    for (const user of usersJson) {
      await pool.query(
        "INSERT INTO users (nome, senha, tipo, cargo) VALUES ($1, $2, $3, $4)",
        [user.login, user.senha, user.tipo, user.cargo]
      );
    }

    console.log("Usuários migrados com sucesso!");
    process.exit();
  } catch (error) {
    console.error("Erro ao migrar usuários:", error);
    process.exit(1);
  }
}

migrate();
