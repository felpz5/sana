import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve front-end
app.use(express.static(path.join(__dirname, "..", "public")));

const db = await open({
  filename: path.join(__dirname, "pup.db"),
  driver: sqlite3.Database,
});

// Inicializa schema/seed
import fs from "fs";
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
await db.exec(schema);

// Helpers
const nowISO = () => new Date().toISOString();

app.get("/api/menu", async (req, res) => {
  const rows = await db.all("SELECT * FROM menu_items ORDER BY categoria, destaque DESC, popularidade DESC, id DESC");
  res.json(rows);
});

app.get("/api/promocoes", async (req, res) => {
  const rows = await db.all("SELECT * FROM promocoes ORDER BY id DESC");
  res.json(rows);
});

app.get("/api/jogos", async (req, res) => {
  const rows = await db.all("SELECT * FROM jogos ORDER BY id DESC");
  res.json(rows);
});

app.get("/api/premios", async (req, res) => {
  const rows = await db.all("SELECT * FROM premios ORDER BY pontos ASC, id DESC");
  res.json(rows);
});

app.get("/api/mesas", async (req, res) => {
  const rows = await db.all("SELECT numero, status, codigo, expira_em, cliente FROM mesas ORDER BY numero ASC");
  res.json(rows);
});

app.post("/api/mesas/codigo", async (req, res) => {
  const { mesa, tempoMin, cliente, codigo } = req.body || {};
  if (!mesa || !tempoMin || !codigo) return res.status(400).json({ error: "Informe mesa, tempoMin e codigo." });

  const expira = new Date(Date.now() + Number(tempoMin) * 60 * 1000).toISOString();
  await db.run(
    "UPDATE mesas SET codigo = ?, expira_em = ?, cliente = ?, status = 'ocupada' WHERE numero = ?",
    codigo, expira, cliente || null, mesa
  );
  res.status(201).json({ ok: true, mesa, codigo, expira_em: expira });
});

app.post("/api/mesas/liberar", async (req, res) => {
  const { mesa } = req.body || {};
  if (!mesa) return res.status(400).json({ error: "Informe a mesa." });

  await db.run(
    "UPDATE mesas SET codigo = NULL, expira_em = NULL, cliente = NULL, status = 'livre' WHERE numero = ?",
    mesa
  );
  res.json({ ok: true, mesa });
});


app.get("/api/pedidos", async (req, res) => {
  const { status } = req.query;
  const rows = status
    ? await db.all("SELECT * FROM pedidos WHERE status = ? ORDER BY id DESC", status)
    : await db.all("SELECT * FROM pedidos ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/pedidos", async (req, res) => {
  const { itens = [] } = req.body || {};
  if (!Array.isArray(itens) || itens.length === 0) return res.status(400).json({ error: "Pedido sem itens." });

  const total = itens.reduce((acc, it) => acc + Number(it.preco || 0) * Number(it.qtd || 1), 0);

  const result = await db.run(
    "INSERT INTO pedidos (status, total, criado_em) VALUES ('pendente', ?, ?)",
    total, nowISO()
  );
  const pedidoId = result.lastID;

  const stmt = await db.prepare("INSERT INTO pedido_itens (pedido_id, nome, preco, qtd) VALUES (?, ?, ?, ?)");
  for (const it of itens) {
    await stmt.run(pedidoId, String(it.nome || "Item"), Number(it.preco || 0), Number(it.qtd || 1));
  }
  await stmt.finalize();

  res.status(201).json({ id: pedidoId, status: "pendente", total });
});

app.patch("/api/pedidos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  const allowed = new Set(["pendente", "preparando", "entregue"]);
  if (!allowed.has(status)) return res.status(400).json({ error: "Status inválido." });

  await db.run("UPDATE pedidos SET status = ? WHERE id = ?", status, id);
  const row = await db.get("SELECT * FROM pedidos WHERE id = ?", id);
  res.json(row);
});

app.post("/api/contato", async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body || {};
  if (!nome || !email || !assunto || !mensagem) return res.status(400).json({ error: "Preencha todos os campos." });

  const result = await db.run(
    "INSERT INTO mensagens_contato (nome, email, assunto, mensagem, criado_em) VALUES (?, ?, ?, ?, ?)",
    nome, email, assunto, mensagem, nowISO()
  );
  res.status(201).json({ id: result.lastID });
});

app.post("/api/feedback", async (req, res) => {
  const { nota, texto } = req.body || {};
  const n = Number(nota);
  if (!Number.isInteger(n) || n < 1 || n > 5) return res.status(400).json({ error: "Nota deve ser 1 a 5." });

  const result = await db.run(
    "INSERT INTO feedback (nota, texto, criado_em) VALUES (?, ?, ?)",
    n, texto || null, nowISO()
  );
  res.status(201).json({ id: result.lastID });
});

app.get("/api/funcionarios", async (req, res) => {
  const rows = await db.all("SELECT * FROM funcionarios ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/funcionarios", async (req, res) => {
  const { nome, cargo } = req.body || {};
  if (!nome || !cargo) return res.status(400).json({ error: "Informe nome e cargo." });

  const result = await db.run("INSERT INTO funcionarios (nome, cargo) VALUES (?, ?)", nome, cargo);
  res.status(201).json({ id: result.lastID, nome, cargo });
});

app.delete("/api/funcionarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.run("DELETE FROM funcionarios WHERE id = ?", id);
  res.json({ ok: true });
});

app.get("/api/admin/dashboard", async (req, res) => {
  const mesasTotal = 20;
  const mesasOcupadasRow = await db.get("SELECT COUNT(*) as c FROM mesas WHERE status = 'ocupada'");
  const mesasOcupadas = mesasOcupadasRow?.c || 0;

  const receitaRow = await db.get("SELECT COALESCE(SUM(total), 0) as s FROM pedidos");
  const receita = receitaRow?.s || 0;

  const funcionariosRow = await db.get("SELECT COUNT(*) as c FROM funcionarios");
  const funcionariosTotal = funcionariosRow?.c || 0;

  const feedbackRow = await db.get("SELECT COALESCE(AVG(nota), 5) as a FROM feedback");
  const avaliacaoMedia = Number(feedbackRow?.a || 5);

  // Custos fictícios só pra preencher os cards
  const custos = receita * 0.35;
  const lucro = receita - custos;

  const jogosPopRow = await db.get("SELECT COUNT(*) as c FROM jogos");
  const jogosPop = jogosPopRow?.c || 0;

  // Vendas "hoje"
  const today = new Date();
  today.setHours(0,0,0,0);
  const vendasHojeRow = await db.get("SELECT COALESCE(SUM(total), 0) as s FROM pedidos WHERE criado_em >= ?", today.toISOString());
  const vendasHoje = vendasHojeRow?.s || 0;

  res.json({
    mesas_total: mesasTotal,
    mesas_ocupadas: mesasOcupadas,
    receita_total: receita,
    custos_total: custos,
    lucro_liquido: lucro,
    funcionarios_total: funcionariosTotal,
    avaliacao_media: avaliacaoMedia,
    jogos_populares: jogosPop,
    vendas_hoje: vendasHoje,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`P.U.P. rodando em http://localhost:${port}`));
