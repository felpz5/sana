/**
 * quiz-pokemon.js - exemplo simples (não usa SQL aqui)
 * Mantive funcional para não quebrar a página do quiz.
 */
const perguntas = [
  { p: "Qual é o tipo do Pikachu?", op: ["Água", "Elétrico", "Fogo", "Planta"], r: 1 },
  { p: "Qual Pokémon evolui para Charizard?", op: ["Charmander", "Squirtle", "Bulbasaur", "Eevee"], r: 0 },
  { p: "Qual item captura Pokémon?", op: ["Master Sword", "Pokébola", "Triforce", "Chaos Emerald"], r: 1 },
  { p: "Quantas evoluções principais tem o Eevee (clássicas + novas)?", op: ["3", "5", "8", "10"], r: 2 },
  { p: "Qual região é da 1ª geração?", op: ["Johto", "Kanto", "Hoenn", "Sinnoh"], r: 1 },
];

let idx = 0;
let pontos = 0;
let selecionado = null;

function render() {
  document.getElementById("pergunta-atual").textContent = String(idx + 1);
  document.getElementById("total-perguntas").textContent = String(perguntas.length);
  document.getElementById("pergunta-texto").textContent = perguntas[idx].p;

  const cont = document.getElementById("opcoes-container");
  cont.innerHTML = "";
  selecionado = null;
  document.getElementById("btn-responder").disabled = true;

  perguntas[idx].op.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary";
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.margin = "0.5rem 0";
    btn.textContent = txt;
    btn.addEventListener("click", () => {
      selecionado = i;
      document.getElementById("btn-responder").disabled = false;
    });
    cont.appendChild(btn);
  });
}

function responderPergunta() {
  if (selecionado === null) return;
  if (selecionado === perguntas[idx].r) pontos++;

  idx++;
  if (idx >= perguntas.length) {
    document.getElementById("quiz-content").classList.add("hidden");
    document.getElementById("quiz-resultado").classList.remove("hidden");
    document.getElementById("pontuacao-final").textContent =
      `Você acertou ${pontos} de ${perguntas.length}!`;
    return;
  }
  render();
}

function reiniciarQuiz() {
  idx = 0; pontos = 0;
  document.getElementById("quiz-content").classList.remove("hidden");
  document.getElementById("quiz-resultado").classList.add("hidden");
  render();
}

document.addEventListener("DOMContentLoaded", render);
window.responderPergunta = responderPergunta;
window.reiniciarQuiz = reiniciarQuiz;
