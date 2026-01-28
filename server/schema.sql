PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  preco REAL NOT NULL,
  destaque INTEGER DEFAULT 0,
  popularidade INTEGER DEFAULT 5
);

CREATE TABLE IF NOT EXISTS promocoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS jogos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  dificuldade TEXT,
  link TEXT
);

CREATE TABLE IF NOT EXISTS premios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  pontos INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mesas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero INTEGER UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'livre', -- livre|ocupada
  codigo TEXT,
  expira_em TEXT,
  cliente TEXT
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL DEFAULT 'pendente', -- pendente|preparando|entregue
  total REAL NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  qtd INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY(pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS funcionarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nota INTEGER NOT NULL,
  texto TEXT,
  criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TEXT NOT NULL
);

-- Seed (só se estiver vazio)
INSERT INTO menu_items (nome, descricao, categoria, preco, destaque, popularidade)
SELECT 'Pizza Pepperoni', 'Pepperoni + queijo', 'Pizzas', 39.90, 1, 9
WHERE NOT EXISTS (SELECT 1 FROM menu_items);

INSERT INTO menu_items (nome, descricao, categoria, preco, destaque, popularidade)
SELECT 'Burger Smash', 'Duplo smash + cheddar', 'Burgers', 28.50, 0, 8
WHERE (SELECT COUNT(*) FROM menu_items) = 1;

INSERT INTO menu_items (nome, descricao, categoria, preco, destaque, popularidade)
SELECT 'Refrigerante', 'Lata 350ml', 'Bebidas', 7.00, 0, 7
WHERE (SELECT COUNT(*) FROM menu_items) = 2;

INSERT INTO promocoes (nome, descricao, preco)
SELECT 'Combo Gamer', 'Burger + refri + batata', 34.90
WHERE NOT EXISTS (SELECT 1 FROM promocoes);

INSERT INTO jogos (nome, descricao, dificuldade, link)
SELECT 'Quiz Pokémon', 'Teste rápido de Pokémon', 'Fácil', 'quiz-pokemon.html'
WHERE NOT EXISTS (SELECT 1 FROM jogos);

INSERT INTO premios (nome, descricao, pontos)
SELECT 'Sobremesa grátis', '1 sobremesa por conta da casa', 50
WHERE NOT EXISTS (SELECT 1 FROM premios);

INSERT INTO funcionarios (nome, cargo)
SELECT 'Alex', 'Atendente'
WHERE NOT EXISTS (SELECT 1 FROM funcionarios);

-- Cria 20 mesas se não existirem
WITH RECURSIVE seq(x) AS (
  SELECT 1
  UNION ALL
  SELECT x+1 FROM seq WHERE x < 20
)
INSERT INTO mesas (numero, status)
SELECT x, 'livre'
FROM seq
WHERE NOT EXISTS (SELECT 1 FROM mesas);
