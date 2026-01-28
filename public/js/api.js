/**
 * API client do P.U.P.
 * Front-end (HTML/JS) conversa com o back-end via fetch, e o back-end conversa com o SQL.
 */
(function () {
  const API_BASE = ""; // mesmo domínio (ex.: http://localhost:3000)

  async function request(path, { method = "GET", body, headers = {} } = {}) {
    const opts = { method, headers: { ...headers } };

    if (body !== undefined) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(API_BASE + path, opts);
    const isJson = (res.headers.get("content-type") || "").includes("application/json");

    if (!res.ok) {
      const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
      const msg = payload?.error || payload?.message || payload || `Erro HTTP ${res.status}`;
      throw new Error(msg);
    }

    return isJson ? res.json() : res.text();
  }

  window.PUP = window.PUP || {};
  window.PUP.api = {
    getMenu: () => request("/api/menu"),
    getPromocoes: () => request("/api/promocoes"),
    getJogos: () => request("/api/jogos"),
    getPremios: () => request("/api/premios"),
    getMesas: () => request("/api/mesas"),
    getPedidos: (status) => request(status ? `/api/pedidos?status=${encodeURIComponent(status)}` : "/api/pedidos"),
    criarPedido: (pedido) => request("/api/pedidos", { method: "POST", body: pedido }),
    atualizarPedido: (id, patch) => request(`/api/pedidos/${id}`, { method: "PATCH", body: patch }),
    criarMensagemContato: (msg) => request("/api/contato", { method: "POST", body: msg }),
    criarFeedback: (fb) => request("/api/feedback", { method: "POST", body: fb }),
    gerarCodigoMesa: (payload) => request("/api/mesas/codigo", { method: "POST", body: payload }),
    liberarMesa: (payload) => request("/api/mesas/liberar", { method: "POST", body: payload }),
    getDashboard: () => request("/api/admin/dashboard"),
    getFuncionarios: () => request("/api/funcionarios"),
    addFuncionario: (f) => request("/api/funcionarios", { method: "POST", body: f }),
    delFuncionario: (id) => request(`/api/funcionarios/${id}`, { method: "DELETE" }),
  };
})();
