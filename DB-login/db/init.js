// db/init.js
// Script to initialize the database based on db/test.sql
// Requires: npm install pg

const { Client } = require('pg');

// Update these values as needed
const config = {
  user: 'postgres', // seu usuário do banco
  host: 'localhost',
  database: 'sistema_login',
  password: 'ifc', // sua senha do banco
  port: 5432,
};

async function initDb() {
  // First try connecting to the target database. If it doesn't exist,
  // connect to the default 'postgres' database and create it.
  let client = new Client(config);
  try {
    await client.connect();
  } catch (err) {
    // If connection fails because database doesn't exist, create it
    if (err.code === '3D000' || /database ".+" does not exist/i.test(err.message)) {
      console.log(`Database "${config.database}" not found — creating it using the default 'postgres' database.`);
      const adminConfig = Object.assign({}, config, { database: 'postgres' });
      const adminClient = new Client(adminConfig);
      try {
        await adminClient.connect();
        // Create the database if it doesn't exist
        await adminClient.query(`CREATE DATABASE ${quoteIdent(config.database)};`);
        console.log(`Database ${config.database} created.`);
      } catch (adminErr) {
        console.error('Erro ao criar o banco de dados:', adminErr);
        throw adminErr;
      } finally {
        await adminClient.end();
      }
      // Try connecting again to the target DB
      client = new Client(config);
      await client.connect();
    } else {
      throw err;
    }
  }

  try {
    // Ativar extensão pgcrypto
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Criar tabela usuarios (idempotente)
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Criar índice
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(usuario, email);`);

    // Inserir usuário exemplo (não duplica)
    await client.query(`
      INSERT INTO usuarios (usuario, email, senha)
      VALUES (
        'joaosilva',
        'joao@email.com',
        crypt('senha_super_secreta', gen_salt('bf'))
      )
      ON CONFLICT (usuario) DO NOTHING;
    `);

    console.log('Banco de dados e tabelas inicializados com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar o banco/tabelas:', err);
    throw err;
  } finally {
    await client.end();
  }
}

// Helper to safely quote identifiers (simple fallback)
function quoteIdent(name) {
  // If name contains only letters/numbers/underscore, return as-is; else quote it
  if (/^[a-zA-Z0-9_]+$/.test(name)) return name;
  return '"' + name.replace(/"/g, '""') + '"';
}

initDb();
