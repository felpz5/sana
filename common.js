/**
 * common.js (compatível com o seu projeto original + versão SQL)
 * - Tabs (aceita showTab('id') e showTab(event,'id'))
 * - Toast (showMessage)
 * - sanitizeInput + validações básicas
 * - Eventos de atualização: pup:data-changed
 * - Ano no footer
 */
(function () {
  // ===== UTIL =====
  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  window.sanitizeInput = function sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input.replace(/[<>"'&]/g, (m) => {
      const map = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "&": "&amp;" };
      return map[m] || m;
    });
  };

  window.validateEmail = function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  };

  window.validatePhone = function validatePhone(phone) {
    // Formato (11) 99999-9999
    return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(String(phone || "").trim());
  };

  window.notifyDataChanged = function notifyDataChanged() {
    window.dispatchEvent(new CustomEvent("pup:data-changed"));
  };

  // ===== TOAST =====
  window.showMessage = function showMessage(text, type = "info") {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.position = "fixed";
    div.style.right = "16px";
    div.style.bottom = "16px";
    div.style.padding = "10px 12px";
    div.style.borderRadius = "10px";
    div.style.color = "#fff";
    div.style.fontFamily = "system-ui, Arial";
    div.style.fontSize = "14px";
    div.style.zIndex = "9999";
    div.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";
    div.style.maxWidth = "360px";

    const colors = {
      success: "#16a34a",
      error: "#dc2626",
      warning: "#d97706",
      info: "#2563eb",
    };
    div.style.background = colors[type] || colors.info;

    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3200);
  };

  // ===== TABS =====
  window.showTab = function showTab(arg1, arg2) {
    // Compatibilidade:
    // - showTab('cardapio')
    // - showTab(event,'cardapio')
    let ev = null;
    let tabId = null;

    if (typeof arg1 === "string") {
      tabId = arg1;
    } else {
      ev = arg1 || null;
      tabId = arg2;
    }

    if (!tabId) return;

    // tenta achar o container mais próximo (página pode ter mais de um conjunto)
    // regra simples: desativa todos
    document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    // ativa botão
    const btn =
      (ev && ev.target && ev.target.classList && ev.target.classList.contains("tab-btn") && ev.target) ||
      document.querySelector(`.tab-btn[onclick*="'${tabId}'"], .tab-btn[onclick*="\\"${tabId}\\""], .tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add("active");

    // ativa conteúdo
    const content = document.getElementById(tabId);
    if (content) content.classList.add("active");

    // hook: se a aba for jogos e existir loadJogos()
    if (tabId === "jogos" && typeof window.loadJogos === "function") {
      setTimeout(() => window.loadJogos(), 80);
    }
  };

  document.addEventListener("DOMContentLoaded", () => setYear());
})();
