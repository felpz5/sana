/**
 * funcionario.js (SQL + compatibilidade do seu funcionario.js)
 * - Carrega mesas/pedidos via API
 * - Gerar código -> /api/mesas/codigo
 * - Liberar mesa -> /api/mesas/liberar
 * - Atualizar status do pedido -> /api/pedidos/:id
 */
let mesas = [];
let pedidos = [];

async function bootFuncionario() {
  await Promise.all([loadMesas(), loadPedidos()]);
  loadMesasSelect();

  // Atualiza ao vivo quando algo mudar no app (pedido novo, etc)
  window.addEventListener("pup:data-changed", async () => {
    await Promise.all([loadMesas(), loadPedidos()]);
    loadMesasSelect();
  });
}
document.addEventListener("DOMContentLoaded", () => setTimeout(bootFuncionario, 50));

async function loadMesas() {
  try {
    mesas = await window.PUP.api.getMesas();
    renderMesas();
  } catch (e) {
    showMessage(e.message || "Erro ao carregar mesas.", "error");
  }
}

function renderMesas() {
  const mesasGrid = document.getElementById("mesas-grid");
  if (!mesasGrid) return;

  mesasGrid.innerHTML = "";

  mesas.forEach((m) => {
    const card = document.createElement("div");
    const status = m.status || "livre";
    card.className = `mesa-card ${status}`;

    let statusText = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === "ocupada" && m.expira_em) {
      const exp = new Date(m.expira_em).getTime();
      const ms = exp - Date.now();
      const min = Math.floor(ms / 60000);
      if (min > 0) statusText += `<br><small>${min}min restantes</small>`;
      else statusText += "<br><small>Tempo esgotado</small>";
    }

    card.innerHTML = `
      <h4>Mesa ${m.numero}</h4>
            <div class="status">${statusText}</div>
      ${m.cliente ? `<small>Cliente: ${sanitizeInput(m.cliente)}</small><br>` : ""}
      ${
        status === "ocupada"
          ? `<button class="btn btn-back btn-small" onclick="liberarMesa(${m.numero})">Liberar</button>`
          : `<button class="btn btn-primary btn-small" onclick="ocuparMesa(${m.numero})">Ocupar</button>`
      }
    `;
    mesasGrid.appendChild(card);
  });
}

function loadMesasSelect() {
  const select = document.getElementById("mesa-select");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione uma mesa</option>';
  mesas
    .filter((m) => (m.status || "livre") === "livre")
    .forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.numero;
      opt.textContent = `Mesa ${m.numero}`;
      select.appendChild(opt);
    });
}

async function gerarCodigo() {
  const mesa = parseInt(document.getElementById("mesa-select")?.value, 10);
  const tempoMin = parseInt(document.getElementById("tempo-input")?.value, 10);
  const cliente = sanitizeInput(document.getElementById("cliente-input")?.value?.trim() || "");

  if (!mesa || !tempoMin || tempoMin <= 0) {
    showMessage("Selecione uma mesa e informe um tempo válido.", "error");
    return;
  }
  if (tempoMin > 480) {
    showMessage("Tempo máximo permitido é de 480 minutos (8 horas).", "error");
    return;
  }

  const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();

  try {
    await window.PUP.api.gerarCodigoMesa({ mesa, tempoMin, cliente, codigo });
    showMessage(`Mesa ${mesa} ocupada! Código: ${codigo}`, "success");
    notifyDataChanged();
    await loadMesas();
    loadMesasSelect();
  } catch (e) {
    showMessage(e.message || "Erro ao gerar código.", "error");
  }

  const mesaSelect = document.getElementById("mesa-select");
  const tempoInput = document.getElementById("tempo-input");
  const clienteInput = document.getElementById("cliente-input");
  if (mesaSelect) mesaSelect.value = "";
  if (tempoInput) tempoInput.value = "";
  if (clienteInput) clienteInput.value = "";
}

async function liberarMesa(mesaNumero) {
  if (!confirm(`Confirma a liberação da Mesa ${mesaNumero}?`)) return;

  try {
    await window.PUP.api.liberarMesa({ mesa: mesaNumero });
    showMessage(`Mesa ${mesaNumero} liberada com sucesso!`, "success");
    notifyDataChanged();
    await loadMesas();
    loadMesasSelect();
  } catch (e) {
    showMessage(e.message || "Erro ao liberar mesa.", "error");
  }
}

function ocuparMesa(mesaNumero) {
  const select = document.getElementById("mesa-select");
  if (select) select.value = String(mesaNumero);
  showTab("gerar-codigo");
}

// ===== PEDIDOS =====
async function loadPedidos() {
  try {
    const statusFilter = document.getElementById("status-filter")?.value || "todos";
    const status = statusFilter !== "todos" ? statusFilter : undefined;
    pedidos = await window.PUP.api.getPedidos(status);

    // puxa itens de cada pedido (o back-end salva itens em tabela separada; na tela mínima, o server retorna só pedidos)
    // Como a API atual não expõe itens, a gente mostra apenas total/horário.
    renderPedidos();
  } catch (e) {
    showMessage(e.message || "Erro ao carregar pedidos.", "error");
  }
}

function renderPedidos() {
  const list = document.getElementById("pedidos-list");
  if (!list) return;

  list.innerHTML = "";

  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    list.innerHTML = '<p class="empty-cart">Nenhum pedido encontrado</p>';
    return;
  }

  pedidos.forEach((p) => {
    const item = document.createElement("div");
    item.className = `pedido-item ${p.status}`;

    const criado = p.criado_em ? new Date(p.criado_em).toLocaleString() : "";
    item.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
        <div>
          <strong>Pedido #${p.id}</strong><br>
          <small>Status: ${p.status}</small><br>
          <small>${criado}</small>
        </div>
        <div style="text-align:right;">
          <div><strong>R$ ${Number(p.total || 0).toFixed(2)}</strong></div>
          <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:8px;">
            <button class="btn btn-small btn-primary" onclick="mudarStatusPedido(${p.id}, 'preparando')">Preparando</button>
            <button class="btn btn-small btn-back" onclick="mudarStatusPedido(${p.id}, 'entregue')">Entregue</button>
          </div>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

async function mudarStatusPedido(id, status) {
  try {
    await window.PUP.api.atualizarPedido(id, { status });
    showMessage(`Pedido #${id} atualizado para '${status}'.`, "success");
    notifyDataChanged();
    await loadPedidos();
  } catch (e) {
    showMessage(e.message || "Erro ao atualizar pedido.", "error");
  }
}
