require("dotenv").config();
const pool = require("./database/db");

async function atualizarTabela() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS tipo TEXT,
      ADD COLUMN IF NOT EXISTS cargo TEXT;
    `);

    console.log("Tabela users atualizada!");
    process.exit();
  } catch (error) {
    console.error("Erro ao atualizar tabela:", error);
    process.exit(1);
  }
}

atualizarTabela();
