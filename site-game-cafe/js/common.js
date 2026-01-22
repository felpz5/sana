// Dados globais compartilhados
let mesas = [];
let menu = [];
let pedidos = [];
let funcionarios = [];
let jogos = [];
let dispositivos = [];
let promocoes = [];
let premios = [];
let vendas = [];
let custos = [];
let feedbacks = [];
let quizPokemon = [];

// Inicialização dos dados
function initializeData() {
    // Mesas (20 mesas)
    const consoles = ['PS5', 'Xbox Series X', 'PC Gamer', 'Nintendo Switch'];
    for (let i = 1; i <= 20; i++) {
        mesas.push({
            id: i,
            status: 'livre',
            console: consoles[(i-1) % 4],
            codigo: null,
            cliente: null,
            tempoContratado: 0,
            startTime: null,
            totalGasto: 0
        });
    }

    // Menu
    menu = [
        {nome: "Pizza Margherita", preco: 25.00, categoria: "Pizzas", descricao: "Molho de tomate, mussarela, manjericão fresco", destaque: false, popularidade: 8},
        {nome: "Pizza Pepperoni", preco: 28.00, categoria: "Pizzas", descricao: "Molho de tomate, mussarela e pepperoni", destaque: true, popularidade: 9},
        {nome: "Burger Clássico", preco: 15.00, categoria: "Burgers", descricao: "Hambúrguer 180g, queijo, alface, tomate", destaque: false, popularidade: 7},
        {nome: "Refrigerante Lata", preco: 5.00, categoria: "Bebidas", descricao: "Coca-Cola, Guaraná ou Fanta Laranja", destaque: false, popularidade: 9},
        {nome: "Batata Frita", preco: 10.00, categoria: "Acompanhamentos", descricao: "Porção de batata frita crocante", destaque: false, popularidade: 8}
    ];

    // Funcionários
    funcionarios = [
        {id: 1, nome: "João Silva", email: "joao@pup.com", cargo: "Atendente", salario: 1800.00, status: "ativo", telefone: "(11) 99999-9999"},
        {id: 2, nome: "Maria Santos", email: "maria@pup.com", cargo: "Gerente", salario: 3500.00, status: "ativo", telefone: "(11) 98888-8888"}
    ];

    // Promoções
    promocoes = [
        {id: 1, nome: "Combo Gamer", descricao: "1 Pizza + 2 Refrigerantes", precoOriginal: 35.00, precoPromocional: 28.00, validade: "2024-12-31", ativa: true},
        {id: 2, nome: "Burger + Batata", descricao: "Qualquer burger + batata frita", precoOriginal: 25.00, precoPromocional: 20.00, validade: "2024-12-31", ativa: true}
    ];

    // Prêmios
    premios = [
        {id: 1, nome: "30 Minutos Grátis", pontos: 100, descricao: "30 minutos extras de jogo", disponivel: true},
        {id: 2, nome: "Refrigerante Grátis", pontos: 50, descricao: "Refrigerante lata", disponivel: true}
    ];

    // Jogos
    jogos = [
        {id: 1, nome: "Quiz Pokémon", categoria: "Quiz", descricao: "Teste seus conhecimentos sobre Pokémon", imagem: "pokemon.avif"},
        {id: 2, nome: "Quiz Cavaleiros do Zodíaco", categoria: "Quiz", descricao: "Desafie-se com perguntas sobre os Cavaleiros de Atena", imagem: "cavaleiros_do_zodiaco.avif"},
        {id: 3, nome: "Quiz Dragon Ball", categoria: "Quiz", descricao: "Prove que você é um verdadeiro fã de Dragon Ball", imagem: "Dragon-Ball-Super-Goku.jpg"}
    ];

    // Perguntas do Quiz Pokémon
    quizPokemon = [
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
        }
    ];

    // Dispositivos
    dispositivos = [
        {id: 1, tipo: "Console", modelo: "PlayStation 5", status: "ativo", mesa: 1},
        {id: 2, tipo: "Console", modelo: "Xbox Series X", status: "ativo", mesa: 2},
        {id: 3, tipo: "PC", modelo: "PC Gamer RTX 4070", status: "ativo", mesa: 3},
        {id: 4, tipo: "Console", modelo: "Nintendo Switch", status: "ativo", mesa: 4}
    ];
}

// Funções utilitárias
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>"'&]/g, function(match) {
        const map = {'<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'};
        return map[match];
    });
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function showTab(tabId) {
    console.log('Mostrando tab:', tabId);
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Encontra o botão clicado
    const clickedBtn = event ? event.target : document.querySelector(`[onclick*="${tabId}"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
        
        // Se for a aba de jogos, recarregar os jogos
        if (tabId === 'jogos') {
            console.log('Carregando jogos na aba...');
            setTimeout(() => loadJogos(), 100);
        }
    } else {
        console.error('Tab não encontrada:', tabId);
    }
}

// Inicializar dados ao carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});