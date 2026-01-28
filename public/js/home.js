/**
 * home.js - painel inicial consumindo o back-end SQL via API
 * (mantém seu comportamento de atualizar periodicamente e em eventos)
 */
async function updateStatus() {
  try {
    const dash = await window.PUP.api.getDashboard();
    const mesas = document.getElementById("mesas-ocupadas");
    const vendas = document.getElementById("vendas-hoje");
    const avaliacao = document.getElementById("avaliacao");

    if (mesas) mesas.textContent = `${dash.mesas_ocupadas}/${dash.mesas_total}`;
    if (vendas) vendas.textContent = `R$ ${Number(dash.vendas_hoje || 0).toFixed(2)}`;
    if (avaliacao) avaliacao.textContent = `${Number(dash.avaliacao_media || 5).toFixed(1)}/5.0`;
  } catch (e) {
    // não spammar toast na home
    console.warn(e);
  }
}

setInterval(updateStatus, 5000);
setTimeout(updateStatus, 100);
window.addEventListener("pup:data-changed", updateStatus);

// Wrapper (caso alguma parte espere)
function updateHome() {
  updateStatus();
}
