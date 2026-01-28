/**
 * admin.js (SQL + com partes do seu admin.js)
 * - Dashboard via /api/admin/dashboard
 * - Funcionários (listar + adicionar + remover) via /api/funcionarios
 * - Menu/Jogos/Promoções/Prêmios: leitura via API (tabelas) – edição fica como "em breve"
 */
let currentModal = null;

let funcionarios = [];
let menu = [];
let jogos = [];
let promocoes = [];
let premios = [];

async function bootAdmin() {
  await Promise.all([loadDashboard(), loadFuncionarios(), loadCatalogos()]);
  bindAdminAutoRefresh();
}
document.addEventListener("DOMContentLoaded", () => setTimeout(bootAdmin, 50));

function bindAdminAutoRefresh() {
  window.addEventListener("pup:data-changed", async () => {
    await Promise.all([loadDashboard(), loadFuncionarios()]);
  });
}

// ===== MODAL SYSTEM (igual ao seu) =====
function openModal(title, content, confirmCallback) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = content;
  document.getElementById("modal-overlay").classList.remove("hidden");
  currentModal = confirmCallback;
}
function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  currentModal = null;
}
function confirmModal() {
  if (currentModal) currentModal();
  closeModal();
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const d = await window.PUP.api.getDashboard();

    const receitaTotal = document.getElementById("receita-total");
    const totalFuncionarios = document.getElementById("total-funcionarios");
    const mesasAtivas = document.getElementById("mesas-ativas");
    const avaliacaoMedia = document.getElementById("avaliacao-media");
    const lucroLiquido = document.getElementById("lucro-liquido");
    const jogosPopulares = document.getElementById("jogos-populares");

    if (receitaTotal) receitaTotal.textContent = `R$ ${Number(d.receita_total || 0).toFixed(2)}`;
    if (totalFuncionarios) totalFuncionarios.textContent = Number(d.funcionarios_total || 0);
    if (mesasAtivas) mesasAtivas.textContent = `${Number(d.mesas_ocupadas || 0)}/${Number(d.mesas_total || 20)}`;
    if (avaliacaoMedia) avaliacaoMedia.textContent = `${Number(d.avaliacao_media || 5).toFixed(1)}/5.0`;
    if (lucroLiquido) lucroLiquido.textContent = `R$ ${Number(d.lucro_liquido || 0).toFixed(2)}`;
    if (jogosPopulares) jogosPopulares.textContent = Number(d.jogos_populares || 0);
  } catch (e) {
    showMessage(e.message || "Erro ao carregar dashboard.", "error");
  }
}

// ===== FUNCIONÁRIOS =====
async function loadFuncionarios() {
  try {
    funcionarios = await window.PUP.api.getFuncionarios();
    renderFuncionarios();
  } catch (e) {
    showMessage(e.message || "Erro ao carregar funcionários.", "error");
  }
}

function renderFuncionarios() {
  const list = document.getElementById("funcionarios-list");
  if (!list) return;

  list.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${funcionarios
          .map(
            (f) => `
          <tr>
            <td>${f.id}</td>
            <td>${sanitizeInput(f.nome)}</td>
            <td>${sanitizeInput(f.cargo)}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-delete btn-small" onclick="excluirFuncionario(${f.id})">Excluir</button>
              </div>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function adicionarFuncionario() {
  const content = `
    <div class="form-modal">
      <div class="form-group">
        <label>Nome:</label>
        <input type="text" id="func-nome" required maxlength="100">
      </div>
      <div class="form-group">
        <label>Cargo:</label>
        <select id="func-cargo">
          <option value="Atendente">Atendente</option>
          <option value="Gerente">Gerente</option>
          <option value="Técnico">Técnico</option>
        </select>
      </div>
    </div>
  `;

  openModal("Adicionar Funcionário", content, async () => {
    const nome = sanitizeInput(document.getElementById("func-nome").value.trim());
    const cargo = document.getElementById("func-cargo").value;

    if (!nome || !cargo) {
      showMessage("Preencha todos os campos obrigatórios!", "error");
      return;
    }

    try {
      await window.PUP.api.addFuncionario({ nome, cargo });
      showMessage("Funcionário adicionado com sucesso!", "success");
      notifyDataChanged();
      await loadFuncionarios();
      await loadDashboard();
    } catch (e) {
      showMessage(e.message || "Erro ao adicionar funcionário.", "error");
    }
  });
}

async function excluirFuncionario(id) {
  if (!confirm("Deseja excluir este funcionário?")) return;
  try {
    await window.PUP.api.delFuncionario(id);
    showMessage("Funcionário excluído!", "success");
    notifyDataChanged();
    await loadFuncionarios();
    await loadDashboard();
  } catch (e) {
    showMessage(e.message || "Erro ao excluir funcionário.", "error");
  }
}

// ===== CATÁLOGOS (READ-ONLY) =====
async function loadCatalogos() {
  try {
    [menu, jogos, promocoes, premios] = await Promise.all([
      window.PUP.api.getMenu(),
      window.PUP.api.getJogos(),
      window.PUP.api.getPromocoes(),
      window.PUP.api.getPremios(),
    ]);

    loadMenuAdmin();
    loadJogosAdmin();
    loadPromocoesAdmin();
    loadPremiosAdmin();
  } catch (e) {
    // não trava o admin se falhar
    console.warn(e);
  }
}

function loadMenuAdmin() {
  const el = document.getElementById("menu-admin-list");
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Destaque</th>
          <th>Popularidade</th>
        </tr>
      </thead>
      <tbody>
        ${(Array.isArray(menu) ? menu : [])
          .map(
            (it) => `
          <tr>
            <td>${sanitizeInput(it.nome)}</td>
            <td>${sanitizeInput(it.categoria || "")}</td>
            <td>R$ ${Number(it.preco || 0).toFixed(2)}</td>
            <td>${Number(it.destaque) === 1 || it.destaque === true ? "⭐" : "-"}</td>
            <td>${Number(it.popularidade || 0)}/10</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <p style="margin-top:10px;color:#666;">Edição do cardápio via SQL: em breve (por enquanto é leitura).</p>
  `;
}

function loadJogosAdmin() {
  const el = document.getElementById("jogos-list");
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Categoria</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
        ${(Array.isArray(jogos) ? jogos : [])
          .map(
            (j) => `
          <tr>
            <td>${sanitizeInput(j.nome)}</td>
            <td>${sanitizeInput(j.categoria || "")}</td>
            <td>${sanitizeInput(j.descricao || "")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function loadPromocoesAdmin() {
  const el = document.getElementById("promocoes-list");
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>
        ${(Array.isArray(promocoes) ? promocoes : [])
          .map(
            (p) => `
          <tr>
            <td>${sanitizeInput(p.nome)}</td>
            <td>${sanitizeInput(p.descricao || "")}</td>
            <td>R$ ${Number(p.preco_original ?? p.precoOriginal ?? 0).toFixed(2)}</td>
            <td>R$ ${Number(p.preco_promocional ?? p.precoPromocional ?? 0).toFixed(2)}</td>
            <td>${sanitizeInput(p.validade || "")}</td>
            <td>${Number(p.ativa) === 1 || p.ativa === true ? "Sim" : "Não"}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function loadPremiosAdmin() {
  const el = document.getElementById("premios-list");
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Pontos</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
        ${(Array.isArray(premios) ? premios : [])
          .map(
            (p) => `
          <tr>
            <td>${sanitizeInput(p.nome)}</td>
            <td>${Number(p.pontos || 0)}</td>
            <td>${sanitizeInput(p.descricao || "")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}
