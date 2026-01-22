// Função para selecionar perguntas aleatórias
function selecionarPerguntasAleatorias(quantidade = 10) {
    const perguntasEmbaralhadas = [...perguntas].sort(() => Math.random() - 0.5);
    return perguntasEmbaralhadas.slice(0, quantidade);
}

// Variável para armazenar as perguntas do quiz atual
let perguntasQuiz = [];

// Quiz Pokémon
let perguntaAtual = 0;
let pontos = 0;
let respostaSelecionada = null;

const perguntas = [
    {
        pergunta: "Qual é o Pokémon número 1 na Pokédex Nacional?",
        opcoes: ["Pikachu", "Bulbasaur", "Charmander", "Squirtle"],
        resposta: 1
    },
    {
        pergunta: "Que tipo de Pokémon é super efetivo contra Pokémon do tipo Água?",
        opcoes: ["Fogo", "Elétrico", "Grama", "Pedra"],
        resposta: 2
    },
    {
        pergunta: "Qual é a evolução do Pikachu?",
        opcoes: ["Raichu", "Pichu", "Electrode", "Voltorb"],
        resposta: 0
    },
    {
        pergunta: "Em que cidade Ash Ketchum começou sua jornada?",
        opcoes: ["Cerulean City", "Viridian City", "Pallet Town", "Pewter City"],
        resposta: 2
    },
    {
        pergunta: "Quantas evoluções o Eevee possui na primeira geração?",
        opcoes: ["2", "3", "4", "5"],
        resposta: 1
    },
    {
        pergunta: "Qual é o tipo do Pokémon Psyduck?",
        opcoes: ["Psíquico", "Água", "Normal", "Voador"],
        resposta: 1
    },
    {
        pergunta: "Quem é o líder do Ginásio de Pewter City?",
        opcoes: ["Misty", "Lt. Surge", "Brock", "Sabrina"],
        resposta: 2
    },
    {
        pergunta: "Qual Pokémon é conhecido como o 'Pokémon Rato'?",
        opcoes: ["Rattata", "Pikachu", "Sandshrew", "Diglett"],
        resposta: 1
    },
    {
        pergunta: "Quantos tipos de Pokémon existem na primeira geração?",
        opcoes: ["15", "17", "18", "20"],
        resposta: 0
    },
    {
        pergunta: "Qual é a evolução do Magikarp?",
        opcoes: ["Seaking", "Goldeen", "Gyarados", "Staryu"],
        resposta: 2
    },
    {
        pergunta: "Que item é necessário para evoluir alguns Pokémon?",
        opcoes: ["Pedra Evolutiva", "Doce Raro", "Poção", "Pokébola"],
        resposta: 0
    },
    {
        pergunta: "Qual é o Pokémon lendário do tipo Fogo?",
        opcoes: ["Articuno", "Zapdos", "Moltres", "Mew"],
        resposta: 2
    },
    {
        pergunta: "Quantos Pokémon iniciais existem na região de Kanto?",
        opcoes: ["2", "3", "4", "5"],
        resposta: 1
    },
    {
        pergunta: "Qual é o nome do Professor da região de Kanto?",
        opcoes: ["Professor Elm", "Professor Birch", "Professor Oak", "Professor Rowan"],
        resposta: 2
    },
    {
        pergunta: "Que tipo de Pokémon é o Gengar?",
        opcoes: ["Fantasma/Veneno", "Sombrio", "Psíquico", "Normal"],
        resposta: 0
    },
    {
        pergunta: "Qual é o Pokémon número 150 na Pokédex?",
        opcoes: ["Mew", "Mewtwo", "Dragonite", "Charizard"],
        resposta: 1
    },
    {
        pergunta: "Em que nível o Charmander evolui para Charmeleon?",
        opcoes: ["Nível 14", "Nível 16", "Nível 18", "Nível 20"],
        resposta: 1
    },
    {
        pergunta: "Qual é a fraqueza do tipo Psíquico?",
        opcoes: ["Fantasma", "Sombrio", "Inseto", "Todas as anteriores"],
        resposta: 3
    },
    {
        pergunta: "Que Pokémon é conhecido por dormir muito?",
        opcoes: ["Slowpoke", "Snorlax", "Slakoth", "Abra"],
        resposta: 1
    },
    {
        pergunta: "Qual é o nome da companheira do Ash em Hoenn?",
        opcoes: ["May", "Dawn", "Serena", "Misty"],
        resposta: 0
    }
];

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function mostrarPergunta() {
    const pergunta = perguntasQuiz[perguntaAtual];
    const perguntaAtualEl = document.getElementById('pergunta-atual');
    const totalPerguntasEl = document.getElementById('total-perguntas');
    const perguntaTextoEl = document.getElementById('pergunta-texto');
    const container = document.getElementById('opcoes-container');
    const btnResponder = document.getElementById('btn-responder');
    
    perguntaAtualEl.textContent = perguntaAtual + 1;
    totalPerguntasEl.textContent = perguntasQuiz.length;
    perguntaTextoEl.textContent = pergunta.pergunta;
    
    container.innerHTML = '';
    
    pergunta.opcoes.forEach((opcao, index) => {
        const opcaoDiv = document.createElement('div');
        opcaoDiv.className = 'quiz-option';
        opcaoDiv.onclick = () => selecionarResposta(index);
        opcaoDiv.innerHTML = `
            <input type="radio" name="resposta" id="opcao${index}" value="${index}">
            <label for="opcao${index}">${opcao}</label>
        `;
        container.appendChild(opcaoDiv);
    });
    
    btnResponder.disabled = true;
    respostaSelecionada = null;
}

function selecionarResposta(index) {
    // Remove seleção anterior
    document.querySelectorAll('.quiz-option').forEach(opcao => {
        opcao.style.backgroundColor = '';
        opcao.style.borderColor = '#E5E7EB';
    });
    
    // Seleciona nova opção
    const opcaoSelecionada = document.querySelectorAll('.quiz-option')[index];
    opcaoSelecionada.style.backgroundColor = '#F3E8FF';
    opcaoSelecionada.style.borderColor = '#8B5CF6';
    
    // Marca o radio button
    document.getElementById(`opcao${index}`).checked = true;
    
    respostaSelecionada = index;
    document.getElementById('btn-responder').disabled = false;
}

function responderPergunta() {
    if (respostaSelecionada === null) return;
    
    const pergunta = perguntasQuiz[perguntaAtual];
    if (respostaSelecionada === pergunta.resposta) {
        pontos++;
        showMessage('Correto! 🎉', 'success');
    } else {
        showMessage(`Incorreto! A resposta era: ${pergunta.opcoes[pergunta.resposta]}`, 'error');
    }
    
    perguntaAtual++;
    
    if (perguntaAtual < perguntasQuiz.length) {
        setTimeout(mostrarPergunta, 1500);
    } else {
        setTimeout(mostrarResultado, 1500);
    }
}

function mostrarResultado() {
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-resultado').classList.remove('hidden');
    
    let mensagem = `Você acertou ${pontos} de ${perguntasQuiz.length} perguntas!\n\n`;
    
    if (pontos === perguntasQuiz.length) {
        mensagem += '🏆 Perfeito! Você é um mestre Pokémon!';
    } else if (pontos >= perguntasQuiz.length * 0.7) {
        mensagem += '😊 Muito bom! Você conhece bem Pokémon!';
    } else if (pontos >= perguntasQuiz.length * 0.5) {
        mensagem += '👍 Não foi mal! Continue estudando!';
    } else {
        mensagem += '😅 Que tal estudar mais sobre Pokémon?';
    }
    
    document.getElementById('pontuacao-final').textContent = mensagem;
}

function reiniciarQuiz() {
    perguntaAtual = 0;
    pontos = 0;
    respostaSelecionada = null;
    perguntasQuiz = selecionarPerguntasAleatorias(10);
    document.getElementById('quiz-content').classList.remove('hidden');
    document.getElementById('quiz-resultado').classList.add('hidden');
    mostrarPergunta();
}

// Inicializar quiz quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    perguntasQuiz = selecionarPerguntasAleatorias(10);
    mostrarPergunta();
});