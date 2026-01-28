/**
 * cliente.js (SQL + compatibilidade do seu cliente.js)
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

// "Mesa virtual" (você estava usando assim no seu cliente.js)
let mesaAtual = { id: "Cliente", totalGasto: 0 };

async function bootCliente() {
  try {
    await Promise.all([refreshMenu(), refreshPromocoes(), refreshJogos(), refreshPremios()]);
    // Render padrão
    loadMenu();
    loadJogos();
    loadPremiosCliente();
    updateCarrinho();
  } catch (e) {
    showMessage(e.message || "Erro ao carregar dados do cliente.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => setTimeout(bootCliente, 50));

function iniciarExperiencia() {
  document.querySelector(".welcome-screen")?.classList.add("hidden");
  document.getElementById("main-tabs")?.classList.remove("hidden");

  // Mostra cardápio por padrão
  showTab("cardapio");
  showMessage("Bem-vindo ao P.U.P.! Explore nosso cardápio e aproveite!", "success");
  updateCarrinho();

  // garante jogos
  setTimeout(() => loadJogos(), 150);
}

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
      ${jogo.imagem ? `<img src="${jogo.imagem}" alt="${sanitizeInput(jogo.nome)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;" onerror="this.style.display='none'">` : ""}
      <h4>🧠 ${sanitizeInput(jogo.nome)}</h4>
      <p>${sanitizeInput(jogo.descricao || "")}</p>
      <button class="btn btn-primary" onclick="iniciarQuiz('${sanitizeInput(jogo.nome).replace(/'/g, "\\'")}')" style="margin-top: 10px;">
        <i class="fas fa-play"></i> Iniciar Quiz
      </button>
    `;
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
    showMessage(`${nomeQuiz} em desenvolvimento! Em breve disponível.`, "warning");
  }
}

function chamarGarcom() {
  showMessage("Garçom chamado! Aguarde, ele estará com você em breve.", "success");
}

// ===== MENU + PROMOÇÕES =====
function loadMenu() {
  loadPromocoes();
  loadMenuRegular();
}

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
    const card = document.createElement("div");
    card.className = "promocao-card";
    card.innerHTML = `
      <h4>🏷️ ${sanitizeInput(p.nome)}</h4>
      <p>${sanitizeInput(p.descricao || "")}</p>
      <div class="preco-original">De R$ ${Number(p.preco_original ?? p.precoOriginal ?? p.preco ?? 0).toFixed(2)}</div>
      <div class="preco-promocional">R$ ${Number(p.preco_promocional ?? p.precoPromocional ?? p.preco ?? 0).toFixed(2)}</div>
      <div class="validade">Válido até: ${sanitizeInput(p.validade || "")}</div>
      <button class="btn btn-primary" onclick="adicionarPromocaoAoCarrinho('${sanitizeInput(p.nome).replace(/'/g, "\\'")}', ${Number(p.preco_promocional ?? p.precoPromocional ?? p.preco ?? 0)})" style="margin-top: 15px;">
        <i class="fas fa-plus"></i> Adicionar Pacote
      </button>
    `;
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
    filtrado = filtrado.filter((i) => String(i.nome).toLowerCase().includes(busca) || String(i.descricao || "").toLowerCase().includes(busca));
  }

  filtrado.forEach((item) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h4>${sanitizeInput(item.nome)} ${Number(item.destaque) === 1 || item.destaque === true ? "⭐" : ""}</h4>
      <p>${sanitizeInput(item.descricao || "")}</p>
      <div class="price">R$ ${Number(item.preco || 0).toFixed(2)}</div>
      <button class="btn btn-primary" onclick="adicionarAoCarrinho('${sanitizeInput(item.nome).replace(/'/g, "\\'")}')" style="margin-top: 10px;">
        <i class="fas fa-plus"></i> Adicionar
      </button>
    `;
    grid.appendChild(div);
  });
}

function filterMenu() {
  loadMenu();
}

// ===== CARRINHO =====
function adicionarPromocaoAoCarrinho(nomePromocao, preco) {
  const it = carrinho.find((c) => c.nome === nomePromocao);
  if (it) it.quantidade++;
  else carrinho.push({ nome: nomePromocao, preco: Number(preco) || 0, categoria: "Promoção", quantidade: 1 });

  updateCarrinho();
  showMessage(`${nomePromocao} adicionado ao carrinho!`, "success");
}

function adicionarAoCarrinho(nomeItem) {
  const item = menu.find((m) => m.nome === nomeItem);
  if (!item) return;

  const it = carrinho.find((c) => c.nome === nomeItem);
  if (it) it.quantidade++;
  else carrinho.push({ nome: item.nome, preco: Number(item.preco) || 0, categoria: item.categoria, quantidade: 1 });

  updateCarrinho();
  showMessage(`${item.nome} adicionado ao carrinho!`, "success");
}

function removerDoCarrinho(nomeItem) {
  const idx = carrinho.findIndex((i) => i.nome === nomeItem);
  if (idx >= 0) carrinho.splice(idx, 1);
  updateCarrinho();
}

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
        <button class="btn btn-back btn-small" onclick="removerDoCarrinho('${sanitizeInput(item.nome).replace(/'/g, "\\'")}')" style="margin-left: 10px;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = String(totalItens);
}

async function finalizarPedido() {
  if (carrinho.length === 0) {
    showMessage("Adicione itens ao carrinho primeiro.", "warning");
    return;
  }

  const itens = carrinho.map((i) => ({ nome: i.nome, preco: Number(i.preco) || 0, qtd: Number(i.quantidade) || 1 }));

  try {
    const created = await window.PUP.api.criarPedido({ itens });
    const total = Number(created.total || 0);

    mesaAtual.totalGasto += total;
    carrinho = [];
    updateCarrinho();
    loadPremiosCliente();

    notifyDataChanged();
    showMessage(`Pedido #${created.id} enviado! Total: R$ ${total.toFixed(2)}`, "success");
  } catch (e) {
    showMessage(e.message || "Erro ao enviar pedido.", "error");
  }
}

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
      <button class="btn ${pode ? "btn-primary" : "btn-back"}" onclick="resgatarPremio(${Number(p.id)})" ${!pode ? "disabled" : ""}>
        ${pode ? "Resgatar" : "Pontos Insuficientes"}
      </button>
    `;
    premiosList.appendChild(card);
  });
}

function resgatarPremio(premioId) {
  const premio = premios.find((p) => Number(p.id) === Number(premioId));
  if (!premio) return;

  const pontosCliente = Math.floor((Number(mesaAtual.totalGasto) || 0) / 5);
  if (pontosCliente < Number(premio.pontos || 0)) {
    showMessage("Pontos insuficientes!", "warning");
    return;
  }
  showMessage(`Prêmio '${premio.nome}' resgatado! Peça ao atendente para adicionar.`, "success");
}

// ===== FEEDBACK =====
function setRating(stars) {
  rating = Number(stars) || 5;
  const starEls = document.querySelectorAll(".stars i");
  starEls.forEach((star, idx) => {
    if (idx < rating) star.classList.add("active");
    else star.classList.remove("active");
  });
}

async function enviarFeedback() {
  const texto = document.getElementById("feedback-text")?.value?.trim() || "";
  try {
    await window.PUP.api.criarFeedback({ nota: rating, texto });
    document.getElementById("feedback-text").value = "";
    setRating(5);
    notifyDataChanged();
    showMessage("Obrigado por seu feedback!", "success");
  } catch (e) {
    showMessage(e.message || "Erro ao enviar feedback.", "error");
  }
}
