require("dotenv").config();
const pool = require("./database/db");

async function reset() {
  try {
    await pool.query("DROP TABLE IF EXISTS ferias;");
    console.log("Tabela ferias removida com sucesso!");
    process.exit();
  } catch (error) {
    console.error("Erro ao remover tabela:", error);
    process.exit(1);
  }
}

reset();
