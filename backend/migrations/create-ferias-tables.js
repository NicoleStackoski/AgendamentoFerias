require("dotenv").config();
const pool = require("../database/db");

async function criarTabelas() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ferias (
        id SERIAL PRIMARY KEY,
        usuario_nome VARCHAR(150) NOT NULL,
        cargo VARCHAR(50) NOT NULL,
        data_inicio DATE NOT NULL,
        data_fim DATE NOT NULL,
        cobertura TEXT,
        observacao TEXT,
        status VARCHAR(50) DEFAULT 'pendente',
        motivo_rejeicao TEXT,
        data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ferias_gerenciais (
        id SERIAL PRIMARY KEY,
        nome_gerente VARCHAR(150) NOT NULL,
        data_inicio DATE NOT NULL,
        data_fim DATE NOT NULL,
        filial VARCHAR(150),
        marca TEXT,
        canal TEXT,
        cobertura VARCHAR(150),
        observacao TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tabelas de férias criadas com sucesso!");
    process.exit();

  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    process.exit(1);
  }
}

criarTabelas();
