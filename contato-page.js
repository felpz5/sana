/**
 * contato-page.js - envia formulário para o back-end (SQL) via API.
 */
async function enviarMensagem(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const assunto = document.getElementById("assunto").value;
  const mensagem = document.getElementById("mensagem").value.trim();

  try {
    await window.PUP.api.criarMensagemContato({ nome, email, assunto, mensagem });

    showMessage(`Obrigado ${nome}! Sua mensagem foi enviada com sucesso.`, "success");

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("assunto").value = "duvida";
    document.getElementById("mensagem").value = "";
  } catch (e) {
    showMessage(e.message || "Falha ao enviar mensagem.", "error");
  }
}
window.enviarMensagem = enviarMensagem;
