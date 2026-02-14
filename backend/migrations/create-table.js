const pool = require("./database/db");

async function criarTabelas() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ferias (
        id SERIAL PRIMARY KEY,

        criado_por INTEGER REFERENCES users(id),
        usuario_id INTEGER REFERENCES users(id),

        data_inicial DATE NOT NULL,
        data_final DATE NOT NULL,

        cobertura TEXT,
        observacao TEXT,

        tipo TEXT DEFAULT 'usuario',
        status TEXT DEFAULT 'Pendente',

        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tabelas criadas com sucesso!");
    process.exit();
  } catch (erro) {
    console.error("Erro ao criar tabelas:", erro);
    process.exit(1);
  }
}

criarTabelas();
