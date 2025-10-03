-- ============================================
-- 1. Criar o banco de dados (opcional)
-- ============================================
-- Execute este comando fora do banco, se quiser criar o banco
-- CREATE DATABASE sistema_login;

-- ============================================
-- 2. Conectar ao banco desejado
-- ============================================
-- \c sistema_login

-- ============================================
-- 3. Ativar extensão para criptografia de senhas
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 4. Criar a tabela de usuários
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice (opcional, melhora performance)
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(usuario, email);

-- ============================================
-- 5. Inserir um novo usuário com senha criptografada
-- ============================================
INSERT INTO usuarios (usuario, email, senha)
VALUES (
    'joaosilva',
    'joao@email.com',
    crypt('senha_super_secreta', gen_salt('bf'))
);

-- ============================================
-- 6. Verificar login de um usuário (autenticação)
-- ============================================
-- Substitua os valores entre aspas pela entrada do usuário
SELECT *
FROM usuarios
WHERE usuario = 'joaosilva'
  AND senha = crypt('senha_super_secreta', senha);

-- Se retornar uma linha, o login foi bem-sucedido.
-- Se não retornar nada, usuário ou senha estão incorretos.
