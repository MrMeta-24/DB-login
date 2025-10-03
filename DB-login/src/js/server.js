const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuração do banco
const pool = new Pool({
  user: 'SEU_USUARIO',
  host: 'localhost',
  database: 'NOME_DO_BANCO',
  password: 'SUA_SENHA',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Rota de registro
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email já registrado.' });
    }

    await pool.query(
      'INSERT INTO usuarios (usuario, email, senha) VALUES ($1, $2, crypt($3, gen_salt(\'bf\')))',
      [username, email, password]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = crypt($2, senha)',
      [email, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login bem-sucedido!', username: result.rows[0].usuario });
    } else {
      res.status(401).json({ message: 'Email ou senha incorretos.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
