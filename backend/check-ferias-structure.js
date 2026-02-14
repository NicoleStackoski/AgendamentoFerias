require("dotenv").config();
const pool = require("./database/db");

async function check() {
  const result = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'ferias'
  `);

  console.log(result.rows);
  process.exit();
}

check();
