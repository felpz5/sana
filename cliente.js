/**
 * cliente.js (SQL + compatibilidade)
 * - Carrega menu, promoções, jogos e prêmios via API (SQLite)
 * - Carrinho + cria pedido no back-end
 * - Feedback salva no back-end
 */

let menu = [];
let promocoes = [];
let jogos = [];
let premios = [];

let carrinho = [];
let rating = 5;

// "Mesa virtual"
let mesaAtual = { id: "Cliente", totalGasto: 0 };

// ===== Fallbacks (para não quebrar se common.js não tiver) =====
function _escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Usa sanitizeInput do common.js se existir; senão usa fallback
const sanitizeInput = (typeof window.sanitizeInput === "function")
  ? window.sanitizeInput
  : _escapeHtml;

// Usa notifyDataChanged se existir; senão não faz nada
const notifyDataChanged = (typeof window.notifyDataChanged === "function")
  ? window.notifyDataChanged
  : () => {};

// ===== Boot =====
async function bootCliente() {
  try {
    // garante que a API foi carregada
    if (!window.PUP || !window.PUP.api) {
      throw new Error("API não carregada. Confira se js/api.js está antes do cliente.js.");
    }

    await Promise.all([
      refreshMenu(),
      refreshPromocoes(),
      refreshJogos(),
      refreshPremios()
    ]);

    // Render
    loadMenu();
    loadJogos();
    loadPremiosCliente();
    updateCarrinho();
  } catch (e) {
    console.error(e);
    if (typeof showMessage === "function") {
      showMessage(e.message || "Erro ao carregar dados do cliente.", "error");
    }
  }
}

// Inicia UMA VEZ só
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(bootCliente, 50);
});

// ===== Data fetch =====
async function refreshMenu() {
  menu = await window.PUP.api.getMenu();
}
async function refreshPromocoes() {
  promocoes = await window.PUP.api.getPromocoes();
}
async function refreshJogos() {
  jogos = await window.PUP.api.getJogos();
}
async function refreshPremios() {
  premios = await window.PUP.api.getPremios();
}

// ===== UX =====
function iniciarExperiencia() {
  document.querySelector(".welcome-screen")?.classList.add("hidden");
  document.getElementById("main-tabs")?.classList.remove("hidden");

  // Mostra cardápio por padrão
  if (typeof showTab === "function") showTab("cardapio");
  if (typeof showMessage === "function") {
    showMessage("Bem-vindo ao P.U.P.! Explore nosso cardápio e aproveite!", "success");
  }

  updateCarrinho();
  setTimeout(() => loadJogos(), 150);
}
window.iniciarExperiencia = iniciarExperiencia;

function chamarGarcom() {
  if (typeof showMessage === "function") {
    showMessage("Garçom chamado! Aguarde, ele estará com você em breve.", "success");
  }
}
window.chamarGarcom = chamarGarcom;

// ===== JOGOS =====
function loadJogos() {
  const jogosGrid = document.getElementById("jogos-grid");
  if (!jogosGrid) return;

  jogosGrid.innerHTML = "";

  if (!Array.isArray(jogos) || jogos.length === 0) {
    jogosGrid.innerHTML = "<p>Nenhum jogo disponível no momento.</p>";
    return;
  }

  jogos.forEach((jogo) => {
    const card = document.createElement("div");
    card.className = "menu-item";
    card.innerHTML = `
      <h4>🧠 ${sanitizeInput(jogo.nome)}</h4>
      <p>${sanitizeInput(jogo.descricao || "")}</p>
      <button class="btn btn-primary" type="button" style="margin-top: 10px;">
        <i class="fas fa-play"></i> Iniciar Quiz
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => iniciarQuiz(jogo.nome, jogo.link));
    jogosGrid.appendChild(card);
  });
}

function iniciarQuiz(nomeQuiz, link) {
  if (link) {
    window.location.href = link;
    return;
  }
  if (nomeQuiz === "Quiz Pokémon") {
    window.location.href = "quiz-pokemon.html";
  } else {
    if (typeof showMessage === "function") {
      showMessage(`${nomeQuiz} em desenvolvimento! Em breve disponível.`, "warning");
    }
  }
}
window.iniciarQuiz = iniciarQuiz;

// ===== MENU + PROMOÇÕES =====
function loadMenu() {
  loadPromocoes();
  loadMenuRegular();
}
window.loadMenu = loadMenu;

function loadPromocoes() {
  const grid = document.getElementById("promocoes-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const lista = Array.isArray(promocoes) ? promocoes : [];
  if (lista.length === 0) {
    grid.innerHTML = "<p>Nenhuma promoção disponível no momento.</p>";
    return;
  }

  lista.forEach((p) => {
    const preco = Number(p.preco_promocional ?? p.precoPromocional ?? p.preco ?? 0);

    const card = document.createElement("div");
    card.className = "promocao-card";
    card.innerHTML = `
      <h4>🏷️ ${sanitizeInput(p.nome)}</h4>
      <p>${sanitizeInput(p.descricao || "")}</p>
      <div class="preco-promocional">R$ ${preco.toFixed(2)}</div>
      <button class="btn btn-primary" type="button" style="margin-top: 15px;">
        <i class="fas fa-plus"></i> Adicionar Pacote
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => adicionarPromocaoAoCarrinho(p.nome, preco));
    grid.appendChild(card);
  });
}

function loadMenuRegular() {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!Array.isArray(menu) || menu.length === 0) {
    grid.innerHTML = "<p>Cardápio não disponível no momento.</p>";
    return;
  }

  const categoria = document.getElementById("categoria-filter")?.value || "todos";
  const busca = (document.getElementById("search-input")?.value || "").toLowerCase();

  let filtrado = [...menu];

  if (categoria !== "todos") {
    filtrado = filtrado.filter((i) => String(i.categoria) === String(categoria));
  }

  if (busca) {
    filtrado = filtrado.filter((i) =>
      String(i.nome).toLowerCase().includes(busca) ||
      String(i.descricao || "").toLowerCase().includes(busca)
    );
  }

  filtrado.forEach((item) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h4>${sanitizeInput(item.nome)} ${(Number(item.destaque) === 1 || item.destaque === true) ? "⭐" : ""}</h4>
      <p>${sanitizeInput(item.descricao || "")}</p>
      <div class="price">R$ ${Number(item.preco || 0).toFixed(2)}</div>
      <button class="btn btn-primary" type="button" style="margin-top: 10px;">
        <i class="fas fa-plus"></i> Adicionar
      </button>
    `;
    div.querySelector("button").addEventListener("click", () => adicionarAoCarrinho(item.nome));
    grid.appendChild(div);
  });
}

function filterMenu() {
  loadMenu();
}
window.filterMenu = filterMenu;

// ===== CARRINHO =====
function adicionarPromocaoAoCarrinho(nomePromocao, preco) {
  const it = carrinho.find((c) => c.nome === nomePromocao);
  if (it) it.quantidade++;
  else carrinho.push({ nome: nomePromocao, preco: Number(preco) || 0, categoria: "Promoção", quantidade: 1 });

  updateCarrinho();
  if (typeof showMessage === "function") showMessage(`${nomePromocao} adicionado ao carrinho!`, "success");
}
window.adicionarPromocaoAoCarrinho = adicionarPromocaoAoCarrinho;

function adicionarAoCarrinho(nomeItem) {
  const item = menu.find((m) => m.nome === nomeItem);
  if (!item) return;

  const it = carrinho.find((c) => c.nome === nomeItem);
  if (it) it.quantidade++;
  else carrinho.push({ nome: item.nome, preco: Number(item.preco) || 0, categoria: item.categoria, quantidade: 1 });

  updateCarrinho();
  if (typeof showMessage === "function") showMessage(`${item.nome} adicionado ao carrinho!`, "success");
}
window.adicionarAoCarrinho = adicionarAoCarrinho;

function removerDoCarrinho(nomeItem) {
  const idx = carrinho.findIndex((i) => i.nome === nomeItem);
  if (idx >= 0) carrinho.splice(idx, 1);
  updateCarrinho();
}
window.removerDoCarrinho = removerDoCarrinho;

function updateCarrinho() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!cartItems || !cartTotal || !cartCount) return;

  if (carrinho.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
    cartTotal.textContent = "0,00";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;
  let totalItens = 0;
  cartItems.innerHTML = "";

  carrinho.forEach((item) => {
    const subtotal = (Number(item.preco) || 0) * (Number(item.quantidade) || 1);
    total += subtotal;
    totalItens += Number(item.quantidade) || 1;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${sanitizeInput(item.nome)}</strong><br>
        <small>R$ ${Number(item.preco || 0).toFixed(2)} x ${Number(item.quantidade || 1)}</small>
      </div>
      <div>
        <strong>R$ ${subtotal.toFixed(2)}</strong>
        <button class="btn btn-back btn-small" type="button" style="margin-left: 10px;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    row.querySelector("button").addEventListener("click", () => removerDoCarrinho(item.nome));
    cartItems.appendChild(row);
  });

  cartTotal.textContent = total.toFixed(2).replace(".", ",");
  cartCount.textContent = String(totalItens);
}

async function finalizarPedido() {
  if (carrinho.length === 0) {
    if (typeof showMessage === "function") showMessage("Adicione itens ao carrinho primeiro.", "warning");
    return;
  }

  const itens = carrinho.map((i) => ({
    nome: i.nome,
    preco: Number(i.preco) || 0,
    qtd: Number(i.quantidade) || 1
  }));

  try {
    const created = await window.PUP.api.criarPedido({ itens });
    const total = Number(created.total || 0);

    mesaAtual.totalGasto += total;
    carrinho = [];
    updateCarrinho();
    loadPremiosCliente();

    notifyDataChanged();
    if (typeof showMessage === "function") showMessage(`Pedido #${created.id} enviado! Total: R$ ${total.toFixed(2)}`, "success");
  } catch (e) {
    console.error(e);
    if (typeof showMessage === "function") showMessage(e.message || "Erro ao enviar pedido.", "error");
  }
}
window.finalizarPedido = finalizarPedido;

// ===== PRÊMIOS =====
function loadPremiosCliente() {
  const premiosList = document.getElementById("premios-cliente-list");
  const pontosLabel = document.getElementById("pontos-cliente");
  if (!premiosList || !pontosLabel) return;

  const pontosCliente = Math.floor((Number(mesaAtual.totalGasto) || 0) / 5);
  pontosLabel.textContent = `Você tem ${pontosCliente} pontos!`;

  premiosList.innerHTML = "";

  (Array.isArray(premios) ? premios : []).forEach((p) => {
    const pode = pontosCliente >= Number(p.pontos || 0);

    const card = document.createElement("div");
    card.className = `premio-card ${pode ? "disponivel" : "indisponivel"}`;
    card.innerHTML = `
      <h4>🏆 ${sanitizeInput(p.nome)}</h4>
      <p>${sanitizeInput(p.descricao || "")}</p>
      <div class="pontos-necessarios ${pode ? "disponivel" : "indisponivel"}">${Number(p.pontos || 0)} pontos</div>
      <button class="btn ${pode ? "btn-primary" : "btn-back"}" type="button" ${!pode ? "disabled" : ""}>
        ${pode ? "Resgatar" : "Pontos Insuficientes"}
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => resgatarPremio(p.id));
    premiosList.appendChild(card);
  });
}

function resgatarPremio(premioId) {
  const premio = premios.find((p) => Number(p.id) === Number(premioId));
  if (!premio) return;

  const pontosCliente = Math.floor((Number(mesaAtual.totalGasto) || 0) / 5);
  if (pontosCliente < Number(premio.pontos || 0)) {
    if (typeof showMessage === "function") showMessage("Pontos insuficientes!", "warning");
    return;
  }
  if (typeof showMessage === "function") showMessage(`Prêmio '${premio.nome}' resgatado!`, "success");
}
window.resgatarPremio = resgatarPremio;

// ===== FEEDBACK =====
function setRating(stars) {
  rating = Number(stars) || 5;
  const starEls = document.querySelectorAll(".stars i");
  starEls.forEach((star, idx) => {
    if (idx < rating) star.classList.add("active");
    else star.classList.remove("active");
  });
}
window.setRating = setRating;

async function enviarFeedback() {
  const texto = document.getElementById("feedback-text")?.value?.trim() || "";
  try {
    await window.PUP.api.criarFeedback({ nota: rating, texto });
    document.getElementById("feedback-text").value = "";
    setRating(5);
    notifyDataChanged();
    if (typeof showMessage === "function") showMessage("Obrigado por seu feedback!", "success");
  } catch (e) {
    console.error(e);
    if (typeof showMessage === "function") showMessage(e.message || "Erro ao enviar feedback.", "error");
  }
}
window.enviarFeedback = enviarFeedback;
