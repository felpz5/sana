/**
 * cardapio-page.js - carrega cardápio do SQL via API e aplica filtro/busca.
 */
let __MENU__ = [];

async function loadMenu() {
  const menuGrid = document.getElementById("menu-grid");
  if (!menuGrid) return;

  menuGrid.innerHTML = "<p>Carregando...</p>";

  try {
    __MENU__ = await window.PUP.api.getMenu();
    renderMenu();
  } catch (e) {
    menuGrid.innerHTML = "";
    showMessage(e.message || "Erro ao carregar cardápio.", "error");
  }
}

function renderMenu() {
  const menuGrid = document.getElementById("menu-grid");
  if (!menuGrid) return;

  const categoria = document.getElementById("categoria-filter")?.value || "todos";
  const busca = (document.getElementById("search-input")?.value || "").toLowerCase();

  let items = __MENU__.slice();

  if (categoria !== "todos") items = items.filter(i => i.categoria === categoria);
  if (busca) items = items.filter(i =>
    (i.nome || "").toLowerCase().includes(busca) ||
    (i.descricao || "").toLowerCase().includes(busca)
  );

  menuGrid.innerHTML = "";
  if (!items.length) {
    menuGrid.innerHTML = "<p>Nenhum item encontrado.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h4>${item.nome} ${item.destaque ? "⭐" : ""}</h4>
      <p>${item.descricao || ""}</p>
      <div class="price">R$ ${Number(item.preco).toFixed(2)}</div>
      <small>Popularidade: ${item.popularidade ?? 0}/10</small>
    `;
    menuGrid.appendChild(div);
  });
}

function filterMenu() {
  renderMenu();
}

document.addEventListener("DOMContentLoaded", () => setTimeout(loadMenu, 50));
window.filterMenu = filterMenu;
