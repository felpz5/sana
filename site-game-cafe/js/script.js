// Dados globais
let mesas = [];
let menu = [];
let pedidos = [];
let carrinho = [];
let funcionarios = [];
let jogos = [];
let dispositivos = [];
let promocoes = [];
let premios = [];
let vendas = [];
let custos = [];
let feedbacks = [];
let mesaAtual = null;
let rating = 5;
let currentModal = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadMenu();
    loadMesas();
    updateStatus();
    setRating(5);
});

// Inicializar todos os dados
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
            totalGasto: 0,
            gamesPlayed: []
        });
    }

    // Menu completo
    menu = [
        {nome: "Pizza Margherita", preco: 25.00, categoria: "Pizzas", descricao: "Molho de tomate, mussarela, manjericão fresco", destaque: false, popularidade: 8},
        {nome: "Pizza Pepperoni", preco: 28.00, categoria: "Pizzas", descricao: "Molho de tomate, mussarela e pepperoni", destaque: true, popularidade: 9},
        {nome: "Pizza Quatro Queijos", preco: 30.00, categoria: "Pizzas", descricao: "Mussarela, parmesão, gorgonzola e provolone", destaque: false, popularidade: 7},
        {nome: "Pizza Calabresa", preco: 27.00, categoria: "Pizzas", descricao: "Molho de tomate, mussarela e calabresa", destaque: false, popularidade: 8},
        {nome: "Pizza Frango com Catupiry", preco: 29.00, categoria: "Pizzas", descricao: "Frango desfiado e catupiry cremoso", destaque: true, popularidade: 9},
        {nome: "Burger Clássico", preco: 15.00, categoria: "Burgers", descricao: "Hambúrguer 180g, queijo, alface, tomate", destaque: false, popularidade: 7},
        {nome: "Burger Vegetariano", preco: 14.00, categoria: "Burgers", descricao: "Hambúrguer de grão de bico e legumes", destaque: false, popularidade: 6},
        {nome: "Burger Duplo", preco: 20.00, categoria: "Burgers", descricao: "Dois hambúrgueres 180g, queijo cheddar", destaque: true, popularidade: 8},
        {nome: "Burger Bacon", preco: 18.00, categoria: "Burgers", descricao: "Hambúrguer 180g, bacon crocante, queijo", destaque: false, popularidade: 7},
        {nome: "Burger Cheddar", preco: 17.00, categoria: "Burgers", descricao: "Hambúrguer 180g com molho de cheddar", destaque: false, popularidade: 6},
        {nome: "Refrigerante Lata", preco: 5.00, categoria: "Bebidas", descricao: "Coca-Cola, Guaraná ou Fanta Laranja", destaque: false, popularidade: 9},
        {nome: "Suco Natural", preco: 7.00, categoria: "Bebidas", descricao: "Laranja, limão ou abacaxi com hortelã", destaque: false, popularidade: 7},
        {nome: "Água Mineral", preco: 3.00, categoria: "Bebidas", descricao: "Com ou sem gás", destaque: false, popularidade: 8},
        {nome: "Chá Gelado", preco: 5.00, categoria: "Bebidas", descricao: "Pêssego ou limão", destaque: false, popularidade: 6},
        {nome: "Batata Frita", preco: 10.00, categoria: "Acompanhamentos", descricao: "Porção de batata frita crocante", destaque: false, popularidade: 8},
        {nome: "Onion Rings", preco: 12.00, categoria: "Acompanhamentos", descricao: "Anéis de cebola empanados", destaque: true, popularidade: 7},
        {nome: "Salada Caesar", preco: 18.00, categoria: "Saladas", descricao: "Alface, croutons, parmesão e molho caesar", destaque: false, popularidade: 6},
        {nome: "Pasta Carbonara", preco: 22.00, categoria: "Massas", descricao: "Espaguete com molho carbonara", destaque: false, popularidade: 7},
        {nome: "Nachos", preco: 15.00, categoria: "Entradas", descricao: "Tortilhas com queijo derretido e guacamole", destaque: true, popularidade: 8},
        {nome: "Brownie", preco: 8.00, categoria: "Sobremesas", descricao: "Brownie de chocolate com sorvete", destaque: true, popularidade: 9}
    ];

    // Funcionários
    funcionarios = [
        {id: 1, nome: "João Silva", email: "joao@pup.com", cargo: "Atendente", salario: 1800.00, status: "ativo", telefone: "(11) 99999-9999", dataAdmissao: "2023-01-01"},
        {id: 2, nome: "Maria Santos", email: "maria@pup.com", cargo: "Gerente", salario: 3500.00, status: "ativo", telefone: "(11) 98888-8888", dataAdmissao: "2023-02-01"},
        {id: 3, nome: "Pedro Oliveira", email: "pedro@pup.com", cargo: "Técnico", salario: 2200.00, status: "ativo", telefone: "(11) 97777-7777", dataAdmissao: "2023-03-01"},
        {id: 4, nome: "Ana Costa", email: "ana@pup.com", cargo: "Atendente", salario: 1800.00, status: "ativo", telefone: "(11) 96666-6666", dataAdmissao: "2023-04-01"}
    ];

    // Jogos
    jogos = [
        {nome: "Fortnite", jogadas: 156, categoria: "Battle Royale", popularidade: 9},
        {nome: "Minecraft", jogadas: 142, categoria: "Sandbox", popularidade: 8},
        {nome: "Call of Duty", jogadas: 128, categoria: "FPS", popularidade: 9},
        {nome: "Among Us", jogadas: 95, categoria: "Party", popularidade: 7},
        {nome: "FIFA 24", jogadas: 134, categoria: "Esporte", popularidade: 8}
    ];

    // Dispositivos
    dispositivos = [
        {id: 1, tipo: "PS5", quantidade: 5, status: "disponivel", manutencao: 0},
        {id: 2, tipo: "Xbox Series X", quantidade: 5, status: "disponivel", manutencao: 0},
        {id: 3, tipo: "PC Gamer", quantidade: 5, status: "disponivel", manutencao: 1},
        {id: 4, tipo: "Nintendo Switch", quantidade: 5, status: "disponivel", manutencao: 0}
    ];

    // Promoções
    promocoes = [
        {id: 1, nome: "Combo Gamer", descricao: "1 Pizza + 2 Refrigerantes", precoOriginal: 35.00, precoPromocional: 28.00, validade: "2024-12-31", ativa: true},
        {id: 2, nome: "Burger + Batata", descricao: "Qualquer burger + batata frita", precoOriginal: 25.00, precoPromocional: 20.00, validade: "2024-12-31", ativa: true},
        {id: 3, nome: "Noite de Pizza", descricao: "2 Pizzas grandes", precoOriginal: 60.00, precoPromocional: 45.00, validade: "2024-12-31", ativa: true},
        {id: 4, nome: "Combo Família", descricao: "4 Burgers + 4 Refrigerantes", precoOriginal: 80.00, precoPromocional: 65.00, validade: "2024-12-31", ativa: true}
    ];

    // Prêmios
    premios = [
        {id: 1, nome: "30 Minutos Grátis", pontos: 100, descricao: "30 minutos extras de jogo", disponivel: true},
        {id: 2, nome: "Refrigerante Grátis", pontos: 50, descricao: "Refrigerante lata", disponivel: true},
        {id: 3, nome: "Batata Frita", pontos: 70, descricao: "Porção de batata frita", disponivel: true},
        {id: 4, nome: "1 Hora Grátis", pontos: 180, descricao: "1 hora extra de jogo", disponivel: true},
        {id: 5, nome: "Combo Gamer", pontos: 250, descricao: "Pizza + 2 refrigerantes", disponivel: true}
    ];

    // Custos exemplo
    custos = [
        {data: "2024-01-01", valor: 500.00, categoria: "Aluguel", descricao: "Aluguel do espaço"},
        {data: "2024-01-05", valor: 1200.00, categoria: "Salários", descricao: "Pagamento de funcionários"},
        {data: "2024-01-10", valor: 800.00, categoria: "Suprimentos", descricao: "Compra de alimentos"},
        {data: "2024-01-15", valor: 300.00, categoria: "Manutenção", descricao: "Manutenção dos consoles"}
    ];
}

// ===== NAVEGAÇÃO =====
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    if (sectionId !== 'home') {
        document.getElementById(sectionId).classList.remove('hidden');
    }
    
    if (sectionId === 'funcionario') {
        loadMesas();
        loadPedidos();
        loadMesasSelect();
    } else if (sectionId === 'admin') {
        updateDashboard();
        loadFuncionarios();
        loadMenuAdmin();
        loadJogosAdmin();
        loadDispositivosAdmin();
        loadPromocoesAdmin();
        loadPremiosAdmin();
        loadFinanceiro();
    } else if (sectionId === 'cliente') {
        loadPromocoesCliente();
        loadPremiosCliente();
    }
}

function showTab(tabId) {
    const section = document.querySelector(`#${tabId}`).closest('.section');
    
    section.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    section.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function showAdminTab(tabId) {
    const section = event.target.closest('.admin-section');
    
    section.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    section.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// ===== ÁREA DO CLIENTE =====
function loginMesa() {
    const codigo = document.getElementById('mesa-codigo').value.trim();
    if (!codigo) {
        alert('Por favor, digite o código da mesa.');
        return;
    }

    const mesa = mesas.find(m => m.codigo === codigo && m.status === 'ocupada');
    if (mesa) {
        mesaAtual = mesa;
        document.getElementById('mesa-numero').textContent = mesa.id;
        document.getElementById('mesa-info').classList.remove('hidden');
        
        if (mesa.startTime) {
            updateTimer();
        }
        
        alert(`Bem-vindo à Mesa ${mesa.id}!`);
        updateCarrinho();
        loadPremiosCliente();
    } else {
        alert('Código inválido ou mesa não está ocupada.');
    }
}

function updateTimer() {
    if (!mesaAtual || mesaAtual.status !== 'ocupada') return;
    
    const tempoContratado = mesaAtual.tempoContratado * 60;
    const tempoDecorrido = (Date.now() - mesaAtual.startTime) / 1000;
    const tempoRestante = Math.max(0, tempoContratado - tempoDecorrido);
    
    const horas = Math.floor(tempoRestante / 3600);
    const minutos = Math.floor((tempoRestante % 3600) / 60);
    const segundos = Math.floor(tempoRestante % 60);
    
    const tempoFormatado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    document.getElementById('mesa-tempo').textContent = tempoFormatado;
    
    if (tempoRestante > 0) {
        setTimeout(updateTimer, 1000);
    } else {
        document.getElementById('mesa-tempo').textContent = "Tempo Esgotado!";
    }
}

function loadMenu() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;
    
    menuGrid.innerHTML = '';
    
    const categoria = document.getElementById('categoria-filter')?.value || 'todos';
    const busca = document.getElementById('search-input')?.value.toLowerCase() || '';
    
    let menuFiltrado = menu;
    
    if (categoria === 'Destaques') {
        menuFiltrado = menuFiltrado.filter(item => item.destaque);
    } else if (categoria === 'Mais Populares') {
        menuFiltrado = menuFiltrado.sort((a, b) => b.popularidade - a.popularidade);
    } else if (categoria !== 'todos') {
        menuFiltrado = menuFiltrado.filter(item => item.categoria === categoria);
    }
    
    if (busca) {
        menuFiltrado = menuFiltrado.filter(item => 
            item.nome.toLowerCase().includes(busca) || 
            item.descricao.toLowerCase().includes(busca)
        );
    }
    
    menuFiltrado.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h4>${item.nome} ${item.destaque ? '⭐' : ''}</h4>
            <p>${item.descricao}</p>
            <div class="price">R$ ${item.preco.toFixed(2)}</div>
            <small>Popularidade: ${item.popularidade}/10</small>
            <button class="btn btn-primary" onclick="adicionarAoCarrinho('${item.nome}')" style="margin-top: 10px;">
                <i class="fas fa-plus"></i> Adicionar
            </button>
        `;
        menuGrid.appendChild(menuItem);
    });
}

function filterMenu() {
    loadMenu();
}

function adicionarAoCarrinho(nomeItem) {
    if (!mesaAtual) {
        alert('Faça login em uma mesa primeiro.');
        return;
    }
    
    const item = menu.find(m => m.nome === nomeItem);
    if (item) {
        const itemCarrinho = carrinho.find(c => c.nome === nomeItem);
        if (itemCarrinho) {
            itemCarrinho.quantidade++;
        } else {
            carrinho.push({...item, quantidade: 1});
        }
        
        updateCarrinho();
        alert(`${item.nome} adicionado ao carrinho!`);
    }
}

function removerDoCarrinho(nomeItem) {
    const index = carrinho.findIndex(item => item.nome === nomeItem);
    if (index > -1) {
        carrinho.splice(index, 1);
        updateCarrinho();
    }
}

function updateCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        cartTotal.textContent = '0,00';
        cartCount.textContent = '0';
        return;
    }
    
    let total = 0;
    let totalItens = 0;
    cartItems.innerHTML = '';
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        totalItens += item.quantidade;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                <small>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</small>
            </div>
            <div>
                <strong>R$ ${subtotal.toFixed(2)}</strong>
                <button class="btn btn-back btn-small" onclick="removerDoCarrinho('${item.nome}')" style="margin-left: 10px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalItens;
}

function finalizarPedido() {
    if (!mesaAtual) {
        alert('Faça login em uma mesa primeiro.');
        return;
    }
    
    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho primeiro.');
        return;
    }
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const novoPedido = {
        id: pedidos.length + 1,
        mesaId: mesaAtual.id,
        itens: carrinho.map(item => `${item.nome} (${item.quantidade}x)`),
        valor: total,
        status: 'pendente',
        timestamp: new Date().toLocaleString()
    };
    
    pedidos.push(novoPedido);
    mesaAtual.totalGasto += total;
    
    // Adicionar pontos (1 ponto a cada R$ 5 gastos)
    const pontosGanhos = Math.floor(total / 5);
    
    carrinho = [];
    updateCarrinho();
    
    alert(`Pedido #${novoPedido.id} enviado! Total: R$ ${total.toFixed(2)}\nVocê ganhou ${pontosGanhos} pontos!`);
    loadPremiosCliente();
}

function loadPromocoesCliente() {
    const promocoesList = document.getElementById('promocoes-cliente-list');
    if (!promocoesList) return;
    
    promocoesList.innerHTML = '';
    
    const promocoesAtivas = promocoes.filter(p => p.ativa);
    
    promocoesAtivas.forEach(promocao => {
        const promocaoCard = document.createElement('div');
        promocaoCard.className = 'promocao-card';
        promocaoCard.innerHTML = `
            <h4>🏷️ ${promocao.nome}</h4>
            <p>${promocao.descricao}</p>
            <div class="preco-original">De R$ ${promocao.precoOriginal.toFixed(2)}</div>
            <div class="preco-promocional">R$ ${promocao.precoPromocional.toFixed(2)}</div>
            <div class="validade">Válido até: ${promocao.validade}</div>
        `;
        promocoesList.appendChild(promocaoCard);
    });
}

function loadPremiosCliente() {
    const premiosList = document.getElementById('premios-cliente-list');
    const pontosLabel = document.getElementById('pontos-cliente');
    
    if (!premiosList || !pontosLabel) return;
    
    const pontosCliente = mesaAtual ? Math.floor(mesaAtual.totalGasto / 5) : 0;
    pontosLabel.textContent = `Você tem ${pontosCliente} pontos!`;
    
    premiosList.innerHTML = '';
    
    premios.forEach(premio => {
        if (premio.disponivel) {
            const podeResgatar = mesaAtual && pontosCliente >= premio.pontos;
            
            const premioCard = document.createElement('div');
            premioCard.className = `premio-card ${podeResgatar ? 'disponivel' : 'indisponivel'}`;
            premioCard.innerHTML = `
                <h4>🏆 ${premio.nome}</h4>
                <p>${premio.descricao}</p>
                <div class="pontos-necessarios ${podeResgatar ? 'disponivel' : 'indisponivel'}">
                    ${premio.pontos} pontos
                </div>
                <button class="btn ${podeResgatar ? 'btn-primary' : 'btn-back'}" 
                        onclick="resgatarPremio(${premio.id})" 
                        ${!podeResgatar ? 'disabled' : ''}>
                    ${podeResgatar ? 'Resgatar' : 'Pontos Insuficientes'}
                </button>
            `;
            premiosList.appendChild(premioCard);
        }
    });
}

function resgatarPremio(premioId) {
    if (!mesaAtual) {
        alert('Faça login em uma mesa primeiro.');
        return;
    }
    
    const premio = premios.find(p => p.id === premioId);
    const pontosCliente = Math.floor(mesaAtual.totalGasto / 5);
    
    if (pontosCliente < premio.pontos) {
        alert('Pontos insuficientes!');
        return;
    }
    
    if (confirm(`Deseja resgatar '${premio.nome}' por ${premio.pontos} pontos?`)) {
        // Simular resgate (em um sistema real, isso seria persistido)
        alert(`Prêmio '${premio.nome}' resgatado com sucesso! Peça ao atendente para adicioná-lo.`);
        loadPremiosCliente();
    }
}

function setRating(stars) {
    rating = stars;
    const starElements = document.querySelectorAll('.stars i');
    starElements.forEach((star, index) => {
        if (index < stars) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function enviarFeedback() {
    if (!mesaAtual) {
        alert('Faça login em uma mesa primeiro.');
        return;
    }
    
    const comentario = document.getElementById('feedback-text').value.trim();
    
    const novoFeedback = {
        mesaId: mesaAtual.id,
        avaliacao: rating,
        comentario: comentario,
        timestamp: new Date().toLocaleString()
    };
    
    feedbacks.push(novoFeedback);
    
    alert('Obrigado por seu feedback!');
    document.getElementById('feedback-text').value = '';
    setRating(5);
}

// ===== ÁREA DO FUNCIONÁRIO =====
function loadMesas() {
    const mesasGrid = document.getElementById('mesas-grid');
    if (!mesasGrid) return;
    
    mesasGrid.innerHTML = '';
    
    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        mesaCard.className = `mesa-card ${mesa.status}`;
        
        let statusText = mesa.status.charAt(0).toUpperCase() + mesa.status.slice(1);
        if (mesa.status === 'ocupada' && mesa.startTime) {
            const tempoDecorrido = (Date.now() - mesa.startTime) / 1000 / 60;
            const tempoRestante = mesa.tempoContratado - tempoDecorrido;
            if (tempoRestante > 0) {
                statusText += `<br><small>${Math.floor(tempoRestante)}min restantes</small>`;
            } else {
                statusText += '<br><small>Tempo esgotado</small>';
            }
        }
        
        mesaCard.innerHTML = `
            <h4>Mesa ${mesa.id}</h4>
            <div class="console">${mesa.console}</div>
            <div class="status">${statusText}</div>
            ${mesa.cliente ? `<small>Cliente: ${mesa.cliente}</small><br>` : ''}
            ${mesa.status === 'ocupada' ? 
                `<button class="btn btn-back btn-small" onclick="liberarMesa(${mesa.id})">Liberar</button>` :
                `<button class="btn btn-primary btn-small" onclick="ocuparMesa(${mesa.id})">Ocupar</button>`
            }
        `;
        mesasGrid.appendChild(mesaCard);
    });
}

function loadMesasSelect() {
    const mesaSelect = document.getElementById('mesa-select');
    if (!mesaSelect) return;
    
    mesaSelect.innerHTML = '<option value="">Selecione uma mesa</option>';
    
    mesas.filter(m => m.status === 'livre').forEach(mesa => {
        const option = document.createElement('option');
        option.value = mesa.id;
        option.textContent = `Mesa ${mesa.id} (${mesa.console})`;
        mesaSelect.appendChild(option);
    });
}

function gerarCodigo() {
    const mesaId = parseInt(document.getElementById('mesa-select').value);
    const tempo = parseInt(document.getElementById('tempo-input').value);
    const cliente = document.getElementById('cliente-input').value.trim();
    
    if (!mesaId || !tempo || tempo <= 0) {
        alert('Selecione uma mesa e informe um tempo válido.');
        return;
    }
    
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa || mesa.status !== 'livre') {
        alert('Mesa não disponível.');
        return;
    }
    
    const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    mesa.status = 'ocupada';
    mesa.codigo = codigo;
    mesa.cliente = cliente || `Cliente Mesa ${mesaId}`;
    mesa.tempoContratado = tempo;
    mesa.startTime = Date.now();
    mesa.totalGasto = 0;
    
    alert(`Mesa ${mesaId} ocupada!\nCódigo: ${codigo}\nTempo: ${tempo} minutos\nConsole: ${mesa.console}`);
    
    loadMesas();
    loadMesasSelect();
    updateStatus();
    
    document.getElementById('mesa-select').value = '';
    document.getElementById('tempo-input').value = '';
    document.getElementById('cliente-input').value = '';
}

function liberarMesa(mesaId) {
    if (confirm(`Confirma a liberação da Mesa ${mesaId}?`)) {
        const mesa = mesas.find(m => m.id === mesaId);
        if (mesa) {
            // Registrar venda do tempo de jogo
            if (mesa.totalGasto > 0) {
                vendas.push({
                    data: new Date().toISOString().split('T')[0],
                    hora: new Date().toLocaleTimeString(),
                    valor: mesa.totalGasto,
                    tipo: "jogo",
                    descricao: `Mesa ${mesaId} - ${mesa.cliente}`
                });
            }
            
            mesa.status = 'livre';
            mesa.codigo = null;
            mesa.cliente = null;
            mesa.tempoContratado = 0;
            mesa.startTime = null;
            
            loadMesas();
            loadMesasSelect();
            updateStatus();
            
            alert(`Mesa ${mesaId} liberada com sucesso!`);
        }
    }
}

function ocuparMesa(mesaId) {
    document.getElementById('mesa-select').value = mesaId;
    showTab('gerar-codigo');
}

function loadPedidos() {
    const pedidosList = document.getElementById('pedidos-list');
    if (!pedidosList) return;
    
    const statusFilter = document.getElementById('status-filter')?.value || 'todos';
    
    let pedidosFiltrados = pedidos;
    if (statusFilter !== 'todos') {
        pedidosFiltrados = pedidos.filter(p => p.status === statusFilter);
    }
    
    pedidosList.innerHTML = '';
    
    if (pedidosFiltrados.length === 0) {
        pedidosList.innerHTML = '<p class="empty-cart">Nenhum pedido encontrado</p>';
        return;
    }
    
    pedidosFiltrados.forEach(pedido => {
        const pedidoItem = document.createElement('div');
        pedidoItem.className = `pedido-item ${pedido.status}`;
        pedidoItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>Pedido #${pedido.id} - Mesa ${pedido.mesaId}</strong><br>
                    <small>${pedido.itens.join(', ')}</small><br>
                    <small>${pedido.timestamp}</small>
                </div>
                <div style="text-align: right;">
                    <strong>R$ ${pedido.valor.toFixed(2)}</strong><br>
                    <span class="status-badge ${pedido.status}">${pedido.status.toUpperCase()}</span><br>
                    ${pedido.status === 'pendente' ? 
                        `<button class="btn btn-accent btn-small" onclick="atualizarStatusPedido(${pedido.id}, 'preparando')" style="margin-top: 5px;">Preparar</button>` :
                        pedido.status === 'preparando' ?
                        `<button class="btn btn-primary btn-small" onclick="atualizarStatusPedido(${pedido.id}, 'entregue')" style="margin-top: 5px;">Entregar</button>` :
                        ''
                    }
                </div>
            </div>
        `;
        pedidosList.appendChild(pedidoItem);
    });
}

function filterPedidos() {
    loadPedidos();
}

function atualizarStatusPedido(pedidoId, novoStatus) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.status = novoStatus;
        
        // Se entregue, adicionar às vendas
        if (novoStatus === 'entregue') {
            vendas.push({
                data: new Date().toISOString().split('T')[0],
                hora: new Date().toLocaleTimeString(),
                valor: pedido.valor,
                tipo: "comida",
                descricao: `Pedido #${pedidoId} - Mesa ${pedido.mesaId}`
            });
        }
        
        loadPedidos();
        updateStatus();
        alert(`Pedido #${pedidoId} atualizado para: ${novoStatus.toUpperCase()}`);
    }
}

// ===== ÁREA DO ADMIN =====
function updateDashboard() {
    const mesasOcupadas = mesas.filter(m => m.status === 'ocupada').length;
    const totalVendas = vendas.reduce((sum, v) => sum + v.valor, 0);
    const totalCustos = custos.reduce((sum, c) => sum + c.valor, 0);
    const lucro = totalVendas - totalCustos;
    const mediaAvaliacao = feedbacks.length > 0 ? 
        feedbacks.reduce((sum, f) => sum + f.avaliacao, 0) / feedbacks.length : 5.0;
    
    document.getElementById('receita-total').textContent = `R$ ${totalVendas.toFixed(2)}`;
    document.getElementById('total-funcionarios').textContent = funcionarios.filter(f => f.status === 'ativo').length;
    document.getElementById('mesas-ativas').textContent = `${mesasOcupadas}/20`;
    document.getElementById('avaliacao-media').textContent = `${mediaAvaliacao.toFixed(1)}/5.0`;
    document.getElementById('lucro-liquido').textContent = `R$ ${lucro.toFixed(2)}`;
    document.getElementById('jogos-populares').textContent = jogos.length;
}

function loadFuncionarios() {
    const funcionariosList = document.getElementById('funcionarios-list');
    if (!funcionariosList) return;
    
    funcionariosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Salário</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${funcionarios.map(func => `
                    <tr>
                        <td>${func.id}</td>
                        <td>${func.nome}</td>
                        <td>${func.cargo}</td>
                        <td>R$ ${func.salario.toFixed(2)}</td>
                        <td><span class="status-badge ${func.status}">${func.status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarFuncionario(${func.id})">Editar</button>
                                <button class="btn btn-delete btn-small" onclick="excluirFuncionario(${func.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadMenuAdmin() {
    const menuList = document.getElementById('menu-admin-list');
    if (!menuList) return;
    
    menuList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Destaque</th>
                    <th>Popularidade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${menu.map((item, index) => `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.categoria}</td>
                        <td>R$ ${item.preco.toFixed(2)}</td>
                        <td>${item.destaque ? '⭐' : '-'}</td>
                        <td>${item.popularidade}/10</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarItemMenu(${index})">Editar</button>
                                <button class="btn btn-delete btn-small" onclick="excluirItemMenu(${index})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadJogosAdmin() {
    const jogosList = document.getElementById('jogos-list');
    if (!jogosList) return;
    
    jogosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Jogadas</th>
                    <th>Popularidade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${jogos.map((jogo, index) => `
                    <tr>
                        <td>${jogo.nome}</td>
                        <td>${jogo.categoria}</td>
                        <td>${jogo.jogadas}</td>
                        <td>${jogo.popularidade}/10</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarJogo(${index})">Editar</button>
                                <button class="btn btn-delete btn-small" onclick="excluirJogo(${index})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadDispositivosAdmin() {
    const dispositivosList = document.getElementById('dispositivos-list');
    if (!dispositivosList) return;
    
    dispositivosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Status</th>
                    <th>Manutenção</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${dispositivos.map(disp => `
                    <tr>
                        <td>${disp.id}</td>
                        <td>${disp.tipo}</td>
                        <td>${disp.quantidade}</td>
                        <td><span class="status-badge ${disp.status}">${disp.status}</span></td>
                        <td>${disp.manutencao} dias</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarDispositivo(${disp.id})">Editar</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadPromocoesAdmin() {
    const promocoesList = document.getElementById('promocoes-list');
    if (!promocoesList) return;
    
    promocoesList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Preço Original</th>
                    <th>Preço Promocional</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${promocoes.map(promo => `
                    <tr>
                        <td>${promo.nome}</td>
                        <td>${promo.descricao}</td>
                        <td>R$ ${promo.precoOriginal.toFixed(2)}</td>
                        <td>R$ ${promo.precoPromocional.toFixed(2)}</td>
                        <td>${promo.validade}</td>
                        <td><span class="status-badge ${promo.ativa ? 'ativo' : 'inativo'}">${promo.ativa ? 'Ativa' : 'Inativa'}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarPromocao(${promo.id})">Editar</button>
                                <button class="btn btn-delete btn-small" onclick="excluirPromocao(${promo.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadPremiosAdmin() {
    const premiosList = document.getElementById('premios-list');
    if (!premiosList) return;
    
    premiosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Pontos</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${premios.map(premio => `
                    <tr>
                        <td>${premio.nome}</td>
                        <td>${premio.descricao}</td>
                        <td>${premio.pontos}</td>
                        <td><span class="status-badge ${premio.disponivel ? 'disponivel' : 'indisponivel'}">${premio.disponivel ? 'Disponível' : 'Indisponível'}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarPremio(${premio.id})">Editar</button>
                                <button class="btn btn-delete btn-small" onclick="excluirPremio(${premio.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadFinanceiro() {
    const transacoesList = document.getElementById('transacoes-list');
    const totalReceitas = document.getElementById('total-receitas');
    const totalCustosEl = document.getElementById('total-custos');
    const totalLucro = document.getElementById('total-lucro');
    
    if (!transacoesList) return;
    
    const receitas = vendas.reduce((sum, v) => sum + v.valor, 0);
    const custosTotal = custos.reduce((sum, c) => sum + c.valor, 0);
    const lucro = receitas - custosTotal;
    
    totalReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
    totalCustosEl.textContent = `R$ ${custosTotal.toFixed(2)}`;
    totalLucro.textContent = `R$ ${lucro.toFixed(2)}`;
    
    const transacoes = [
        ...vendas.map(v => ({...v, tipo: 'RECEITA', valor: v.valor})),
        ...custos.map(c => ({...c, tipo: 'CUSTO', valor: -c.valor}))
    ].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    transacoesList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>
                ${transacoes.map(t => `
                    <tr>
                        <td>${t.data}</td>
                        <td><span class="status-badge ${t.tipo === 'RECEITA' ? 'ativo' : 'inativo'}">${t.tipo}</span></td>
                        <td>${t.categoria || t.tipo}</td>
                        <td style="color: ${t.valor > 0 ? '#10B981' : '#EF4444'}">R$ ${Math.abs(t.valor).toFixed(2)}</td>
                        <td>${t.descricao}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ===== RELATÓRIOS =====
function gerarRelatorioFinanceiro() {
    const receitas = vendas.reduce((sum, v) => sum + v.valor, 0);
    const custosTotal = custos.reduce((sum, c) => sum + c.valor, 0);
    const lucro = receitas - custosTotal;
    
    const relatorio = `
📊 RELATÓRIO FINANCEIRO

💰 Total de Receitas: R$ ${receitas.toFixed(2)}
💸 Total de Custos: R$ ${custosTotal.toFixed(2)}
📈 Lucro Líquido: R$ ${lucro.toFixed(2)}

📋 Transações:
- Vendas: ${vendas.length}
- Custos: ${custos.length}

📅 Período: Todos os registros
    `;
    
    alert(relatorio);
}

function gerarRelatorioJogos() {
    const jogosOrdenados = jogos.sort((a, b) => b.jogadas - a.jogadas);
    
    let relatorio = '🎮 JOGOS MAIS JOGADOS\n\n';
    jogosOrdenados.forEach((jogo, index) => {
        relatorio += `${index + 1}. ${jogo.nome} (${jogo.categoria}): ${jogo.jogadas} jogadas\n`;
    });
    
    alert(relatorio);
}

function gerarRelatorioVendas() {
    const itensCount = {};
    pedidos.forEach(pedido => {
        pedido.itens.forEach(item => {
            const nomeItem = item.split(' (')[0]; // Remove quantidade
            itensCount[nomeItem] = (itensCount[nomeItem] || 0) + 1;
        });
    });
    
    const itensOrdenados = Object.entries(itensCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    let relatorio = '🍕 TOP 10 ITENS MAIS VENDIDOS\n\n';
    itensOrdenados.forEach(([item, quantidade], index) => {
        relatorio += `${index + 1}. ${item}: ${quantidade} vendas\n`;
    });
    
    alert(relatorio);
}

function gerarRelatorioSatisfacao() {
    if (feedbacks.length === 0) {
        alert('📊 RELATÓRIO DE SATISFAÇÃO\n\nNenhum feedback disponível ainda.');
        return;
    }
    
    const media = feedbacks.reduce((sum, f) => sum + f.avaliacao, 0) / feedbacks.length;
    
    let relatorio = `⭐ RELATÓRIO DE SATISFAÇÃO\n\n`;
    relatorio += `Avaliação Média: ${media.toFixed(1)}/5.0\n`;
    relatorio += `Total de Feedbacks: ${feedbacks.length}\n\n`;
    relatorio += `Distribuição:\n`;
    
    for (let i = 5; i >= 1; i--) {
        const count = feedbacks.filter(f => f.avaliacao === i).length;
        const percentual = (count / feedbacks.length) * 100;
        relatorio += `${'★'.repeat(i)}: ${count} (${percentual.toFixed(1)}%)\n`;
    }
    
    alert(relatorio);
}

// ===== MODAL SYSTEM =====
function openModal(title, content, confirmCallback) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
    
    currentModal = confirmCallback;
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    currentModal = null;
}

function confirmModal() {
    if (currentModal) {
        currentModal();
    }
    closeModal();
}

// ===== CRUD FUNCTIONS =====
function adicionarFuncionario() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="func-nome" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="func-email" required>
            </div>
            <div class="form-group">
                <label>Cargo:</label>
                <select id="func-cargo">
                    <option value="Atendente">Atendente</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Técnico">Técnico</option>
                </select>
            </div>
            <div class="form-group">
                <label>Salário:</label>
                <input type="number" id="func-salario" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Telefone:</label>
                <input type="tel" id="func-telefone">
            </div>
        </div>
    `;
    
    openModal('Adicionar Funcionário', content, () => {
        const nome = document.getElementById('func-nome').value;
        const email = document.getElementById('func-email').value;
        const cargo = document.getElementById('func-cargo').value;
        const salario = parseFloat(document.getElementById('func-salario').value);
        const telefone = document.getElementById('func-telefone').value;
        
        if (nome && email && salario) {
            const novoId = Math.max(...funcionarios.map(f => f.id)) + 1;
            funcionarios.push({
                id: novoId,
                nome,
                email,
                cargo,
                salario,
                telefone,
                status: 'ativo',
                dataAdmissao: new Date().toISOString().split('T')[0]
            });
            
            loadFuncionarios();
            updateDashboard();
            alert('Funcionário adicionado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        funcionarios = funcionarios.filter(f => f.id !== id);
        loadFuncionarios();
        updateDashboard();
        alert('Funcionário excluído com sucesso!');
    }
}

// Carregar dados iniciais com tratamento de erro
setTimeout(() => {
    try {
        loadMenu();
        loadPromocoesCliente();
        loadPremiosCliente();
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showMessage('Erro ao carregar dados. Recarregue a página.', 'error');
    }
}, 100);

// Tratamento de erros globais
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.error);
    showMessage('Ocorreu um erro inesperado. Verifique o console.', 'error');
});

// Melhorar performance com debounce para filtros
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce ao filtro de menu
const debouncedFilterMenu = debounce(filterMenu, 300);

// Atualizar event listeners para usar debounce
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', debouncedFilterMenu);
    }
});
function adicionarItemMenu() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="item-nome" required>
            </div>
            <div class="form-group">
                <label>Categoria:</label>
                <select id="item-categoria">
                    <option value="Pizzas">Pizzas</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Acompanhamentos">Acompanhamentos</option>
                    <option value="Saladas">Saladas</option>
                    <option value="Massas">Massas</option>
                    <option value="Entradas">Entradas</option>
                    <option value="Sobremesas">Sobremesas</option>
                </select>
            </div>
            <div class="form-group">
                <label>Preço:</label>
                <input type="number" id="item-preco" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="item-descricao" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Destaque:</label>
                <input type="checkbox" id="item-destaque">
            </div>
            <div class="form-group">
                <label>Popularidade (1-10):</label>
                <input type="number" id="item-popularidade" min="1" max="10" value="5">
            </div>
        </div>
    `;
    
    openModal('Adicionar Item ao Menu', content, () => {
        const nome = document.getElementById('item-nome').value;
        const categoria = document.getElementById('item-categoria').value;
        const preco = parseFloat(document.getElementById('item-preco').value);
        const descricao = document.getElementById('item-descricao').value;
        const destaque = document.getElementById('item-destaque').checked;
        const popularidade = parseInt(document.getElementById('item-popularidade').value);
        
        if (nome && categoria && preco) {
            menu.push({
                nome,
                categoria,
                preco,
                descricao,
                destaque,
                popularidade
            });
            
            loadMenuAdmin();
            loadMenu();
            alert('Item adicionado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function adicionarPromocao() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="promo-nome" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="promo-descricao" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Preço Original:</label>
                <input type="number" id="promo-original" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Preço Promocional:</label>
                <input type="number" id="promo-promocional" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Validade:</label>
                <input type="date" id="promo-validade" required>
            </div>
            <div class="form-group">
                <label>Ativa:</label>
                <input type="checkbox" id="promo-ativa" checked>
            </div>
        </div>
    `;
    
    openModal('Adicionar Promoção', content, () => {
        const nome = document.getElementById('promo-nome').value;
        const descricao = document.getElementById('promo-descricao').value;
        const precoOriginal = parseFloat(document.getElementById('promo-original').value);
        const precoPromocional = parseFloat(document.getElementById('promo-promocional').value);
        const validade = document.getElementById('promo-validade').value;
        const ativa = document.getElementById('promo-ativa').checked;
        
        if (nome && precoOriginal && precoPromocional && validade) {
            const novoId = Math.max(...promocoes.map(p => p.id)) + 1;
            promocoes.push({
                id: novoId,
                nome,
                descricao,
                precoOriginal,
                precoPromocional,
                validade,
                ativa
            });
            
            loadPromocoesAdmin();
            loadPromocoesCliente();
            alert('Promoção adicionada com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function adicionarPremio() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="premio-nome" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="premio-descricao" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Pontos Necessários:</label>
                <input type="number" id="premio-pontos" required>
            </div>
            <div class="form-group">
                <label>Disponível:</label>
                <input type="checkbox" id="premio-disponivel" checked>
            </div>
        </div>
    `;
    
    openModal('Adicionar Prêmio', content, () => {
        const nome = document.getElementById('premio-nome').value;
        const descricao = document.getElementById('premio-descricao').value;
        const pontos = parseInt(document.getElementById('premio-pontos').value);
        const disponivel = document.getElementById('premio-disponivel').checked;
        
        if (nome && pontos >= 0) {
            const novoId = Math.max(...premios.map(p => p.id)) + 1;
            premios.push({
                id: novoId,
                nome,
                descricao,
                pontos,
                disponivel
            });
            
            loadPremiosAdmin();
            loadPremiosCliente();
            alert('Prêmio adicionado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function adicionarJogo() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="jogo-nome" required>
            </div>
            <div class="form-group">
                <label>Categoria:</label>
                <input type="text" id="jogo-categoria" required>
            </div>
            <div class="form-group">
                <label>Jogadas:</label>
                <input type="number" id="jogo-jogadas" value="0" required>
            </div>
            <div class="form-group">
                <label>Popularidade (1-10):</label>
                <input type="number" id="jogo-popularidade" min="1" max="10" value="5">
            </div>
        </div>
    `;
    
    openModal('Adicionar Jogo', content, () => {
        const nome = document.getElementById('jogo-nome').value;
        const categoria = document.getElementById('jogo-categoria').value;
        const jogadas = parseInt(document.getElementById('jogo-jogadas').value);
        const popularidade = parseInt(document.getElementById('jogo-popularidade').value);
        
        if (nome && categoria && jogadas >= 0) {
            jogos.push({
                nome,
                categoria,
                jogadas,
                popularidade
            });
            
            loadJogosAdmin();
            updateDashboard();
            alert('Jogo adicionado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}
function editarFuncionario(id) {
    const funcionario = funcionarios.find(f => f.id === id);
    if (!funcionario) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="func-nome" value="${funcionario.nome}" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="func-email" value="${funcionario.email}" required>
            </div>
            <div class="form-group">
                <label>Cargo:</label>
                <select id="func-cargo">
                    <option value="Atendente" ${funcionario.cargo === 'Atendente' ? 'selected' : ''}>Atendente</option>
                    <option value="Gerente" ${funcionario.cargo === 'Gerente' ? 'selected' : ''}>Gerente</option>
                    <option value="Técnico" ${funcionario.cargo === 'Técnico' ? 'selected' : ''}>Técnico</option>
                </select>
            </div>
            <div class="form-group">
                <label>Salário:</label>
                <input type="number" id="func-salario" step="0.01" value="${funcionario.salario}" required>
            </div>
            <div class="form-group">
                <label>Telefone:</label>
                <input type="tel" id="func-telefone" value="${funcionario.telefone}">
            </div>
            <div class="form-group">
                <label>Status:</label>
                <select id="func-status">
                    <option value="ativo" ${funcionario.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                    <option value="inativo" ${funcionario.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                </select>
            </div>
        </div>
    `;
    
    openModal('Editar Funcionário', content, () => {
        const nome = document.getElementById('func-nome').value;
        const email = document.getElementById('func-email').value;
        const cargo = document.getElementById('func-cargo').value;
        const salario = parseFloat(document.getElementById('func-salario').value);
        const telefone = document.getElementById('func-telefone').value;
        const status = document.getElementById('func-status').value;
        
        if (nome && email && salario) {
            funcionario.nome = nome;
            funcionario.email = email;
            funcionario.cargo = cargo;
            funcionario.salario = salario;
            funcionario.telefone = telefone;
            funcionario.status = status;
            
            loadFuncionarios();
            updateDashboard();
            alert('Funcionário atualizado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function editarItemMenu(index) {
    const item = menu[index];
    if (!item) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="item-nome" value="${item.nome}" required>
            </div>
            <div class="form-group">
                <label>Categoria:</label>
                <select id="item-categoria">
                    <option value="Pizzas" ${item.categoria === 'Pizzas' ? 'selected' : ''}>Pizzas</option>
                    <option value="Burgers" ${item.categoria === 'Burgers' ? 'selected' : ''}>Burgers</option>
                    <option value="Bebidas" ${item.categoria === 'Bebidas' ? 'selected' : ''}>Bebidas</option>
                    <option value="Acompanhamentos" ${item.categoria === 'Acompanhamentos' ? 'selected' : ''}>Acompanhamentos</option>
                    <option value="Saladas" ${item.categoria === 'Saladas' ? 'selected' : ''}>Saladas</option>
                    <option value="Massas" ${item.categoria === 'Massas' ? 'selected' : ''}>Massas</option>
                    <option value="Entradas" ${item.categoria === 'Entradas' ? 'selected' : ''}>Entradas</option>
                    <option value="Sobremesas" ${item.categoria === 'Sobremesas' ? 'selected' : ''}>Sobremesas</option>
                </select>
            </div>
            <div class="form-group">
                <label>Preço:</label>
                <input type="number" id="item-preco" step="0.01" value="${item.preco}" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="item-descricao" rows="3">${item.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>Destaque:</label>
                <input type="checkbox" id="item-destaque" ${item.destaque ? 'checked' : ''}>
            </div>
            <div class="form-group">
                <label>Popularidade (1-10):</label>
                <input type="number" id="item-popularidade" min="1" max="10" value="${item.popularidade}">
            </div>
        </div>
    `;
    
    openModal('Editar Item do Menu', content, () => {
        const nome = document.getElementById('item-nome').value;
        const categoria = document.getElementById('item-categoria').value;
        const preco = parseFloat(document.getElementById('item-preco').value);
        const descricao = document.getElementById('item-descricao').value;
        const destaque = document.getElementById('item-destaque').checked;
        const popularidade = parseInt(document.getElementById('item-popularidade').value);
        
        if (nome && categoria && preco) {
            item.nome = nome;
            item.categoria = categoria;
            item.preco = preco;
            item.descricao = descricao;
            item.destaque = destaque;
            item.popularidade = popularidade;
            
            loadMenuAdmin();
            loadMenu();
            alert('Item atualizado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function excluirItemMenu(index) {
    if (confirm('Tem certeza que deseja excluir este item do menu?')) {
        menu.splice(index, 1);
        loadMenuAdmin();
        loadMenu();
        alert('Item excluído com sucesso!');
    }
}

function editarJogo(index) {
    const jogo = jogos[index];
    if (!jogo) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="jogo-nome" value="${jogo.nome}" required>
            </div>
            <div class="form-group">
                <label>Categoria:</label>
                <input type="text" id="jogo-categoria" value="${jogo.categoria}" required>
            </div>
            <div class="form-group">
                <label>Jogadas:</label>
                <input type="number" id="jogo-jogadas" value="${jogo.jogadas}" required>
            </div>
            <div class="form-group">
                <label>Popularidade (1-10):</label>
                <input type="number" id="jogo-popularidade" min="1" max="10" value="${jogo.popularidade}">
            </div>
        </div>
    `;
    
    openModal('Editar Jogo', content, () => {
        const nome = document.getElementById('jogo-nome').value;
        const categoria = document.getElementById('jogo-categoria').value;
        const jogadas = parseInt(document.getElementById('jogo-jogadas').value);
        const popularidade = parseInt(document.getElementById('jogo-popularidade').value);
        
        if (nome && categoria && jogadas >= 0) {
            jogo.nome = nome;
            jogo.categoria = categoria;
            jogo.jogadas = jogadas;
            jogo.popularidade = popularidade;
            
            loadJogosAdmin();
            alert('Jogo atualizado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function excluirJogo(index) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        jogos.splice(index, 1);
        loadJogosAdmin();
        alert('Jogo excluído com sucesso!');
    }
}

function editarDispositivo(id) {
    const dispositivo = dispositivos.find(d => d.id === id);
    if (!dispositivo) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Tipo:</label>
                <input type="text" id="disp-tipo" value="${dispositivo.tipo}" required>
            </div>
            <div class="form-group">
                <label>Quantidade:</label>
                <input type="number" id="disp-quantidade" value="${dispositivo.quantidade}" required>
            </div>
            <div class="form-group">
                <label>Status:</label>
                <select id="disp-status">
                    <option value="disponivel" ${dispositivo.status === 'disponivel' ? 'selected' : ''}>Disponível</option>
                    <option value="manutencao" ${dispositivo.status === 'manutencao' ? 'selected' : ''}>Manutenção</option>
                </select>
            </div>
            <div class="form-group">
                <label>Dias em Manutenção:</label>
                <input type="number" id="disp-manutencao" value="${dispositivo.manutencao}">
            </div>
        </div>
    `;
    
    openModal('Editar Dispositivo', content, () => {
        const tipo = document.getElementById('disp-tipo').value;
        const quantidade = parseInt(document.getElementById('disp-quantidade').value);
        const status = document.getElementById('disp-status').value;
        const manutencao = parseInt(document.getElementById('disp-manutencao').value) || 0;
        
        if (tipo && quantidade >= 0) {
            dispositivo.tipo = tipo;
            dispositivo.quantidade = quantidade;
            dispositivo.status = status;
            dispositivo.manutencao = manutencao;
            
            loadDispositivosAdmin();
            alert('Dispositivo atualizado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function editarPromocao(id) {
    const promocao = promocoes.find(p => p.id === id);
    if (!promocao) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="promo-nome" value="${promocao.nome}" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="promo-descricao" rows="3">${promocao.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>Preço Original:</label>
                <input type="number" id="promo-original" step="0.01" value="${promocao.precoOriginal}" required>
            </div>
            <div class="form-group">
                <label>Preço Promocional:</label>
                <input type="number" id="promo-promocional" step="0.01" value="${promocao.precoPromocional}" required>
            </div>
            <div class="form-group">
                <label>Validade:</label>
                <input type="date" id="promo-validade" value="${promocao.validade}" required>
            </div>
            <div class="form-group">
                <label>Ativa:</label>
                <input type="checkbox" id="promo-ativa" ${promocao.ativa ? 'checked' : ''}>
            </div>
        </div>
    `;
    
    openModal('Editar Promoção', content, () => {
        const nome = document.getElementById('promo-nome').value;
        const descricao = document.getElementById('promo-descricao').value;
        const precoOriginal = parseFloat(document.getElementById('promo-original').value);
        const precoPromocional = parseFloat(document.getElementById('promo-promocional').value);
        const validade = document.getElementById('promo-validade').value;
        const ativa = document.getElementById('promo-ativa').checked;
        
        if (nome && precoOriginal && precoPromocional && validade) {
            promocao.nome = nome;
            promocao.descricao = descricao;
            promocao.precoOriginal = precoOriginal;
            promocao.precoPromocional = precoPromocional;
            promocao.validade = validade;
            promocao.ativa = ativa;
            
            loadPromocoesAdmin();
            loadPromocoesCliente();
            alert('Promoção atualizada com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function excluirPromocao(id) {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
        promocoes = promocoes.filter(p => p.id !== id);
        loadPromocoesAdmin();
        loadPromocoesCliente();
        alert('Promoção excluída com sucesso!');
    }
}

function editarPremio(id) {
    const premio = premios.find(p => p.id === id);
    if (!premio) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="premio-nome" value="${premio.nome}" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="premio-descricao" rows="3">${premio.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>Pontos Necessários:</label>
                <input type="number" id="premio-pontos" value="${premio.pontos}" required>
            </div>
            <div class="form-group">
                <label>Disponível:</label>
                <input type="checkbox" id="premio-disponivel" ${premio.disponivel ? 'checked' : ''}>
            </div>
        </div>
    `;
    
    openModal('Editar Prêmio', content, () => {
        const nome = document.getElementById('premio-nome').value;
        const descricao = document.getElementById('premio-descricao').value;
        const pontos = parseInt(document.getElementById('premio-pontos').value);
        const disponivel = document.getElementById('premio-disponivel').checked;
        
        if (nome && pontos >= 0) {
            premio.nome = nome;
            premio.descricao = descricao;
            premio.pontos = pontos;
            premio.disponivel = disponivel;
            
            loadPremiosAdmin();
            loadPremiosCliente();
            alert('Prêmio atualizado com sucesso!');
        } else {
            alert('Preencha todos os campos obrigatórios!');
        }
    });
}

function excluirPremio(id) {
    if (confirm('Tem certeza que deseja excluir este prêmio?')) {
        premios = premios.filter(p => p.id !== id);
        loadPremiosAdmin();
        loadPremiosCliente();
        alert('Prêmio excluído com sucesso!');
    }
}

// ===== STATUS E ATUALIZAÇÕES =====
function updateStatus() {
    const mesasOcupadas = mesas.filter(m => m.status === 'ocupada').length;
    const vendasHoje = vendas.filter(v => v.data === new Date().toISOString().split('T')[0])
        .reduce((sum, v) => sum + v.valor, 0);
    const mediaAvaliacao = feedbacks.length > 0 ? 
        feedbacks.reduce((sum, f) => sum + f.avaliacao, 0) / feedbacks.length : 5.0;
    
    document.getElementById('mesas-ocupadas').textContent = `${mesasOcupadas}/20`;
    document.getElementById('vendas-hoje').textContent = `R$ ${vendasHoje.toFixed(2)}`;
    document.getElementById('avaliacao').textContent = `${mediaAvaliacao.toFixed(1)}/5.0`;
    
    // Atualizar também no admin se existir
    const mesasAtivas = document.getElementById('mesas-ativas');
    if (mesasAtivas) {
        mesasAtivas.textContent = `${mesasOcupadas}/20`;
    }
}

// Atualizar status periodicamente
setInterval(updateStatus, 5000);

// Validações e melhorias de segurança
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>"'&]/g, function(match) {
        const map = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
        };
        return map[match];
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}$/;
    return re.test(phone);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Melhorar função de login com validação
function loginMesa() {
    const codigo = document.getElementById('mesa-codigo').value.trim().toUpperCase();
    if (!codigo) {
        showMessage('Por favor, digite o código da mesa.', 'error');
        return;
    }

    if (codigo.length !== 4) {
        showMessage('O código deve ter 4 caracteres.', 'error');
        return;
    }

    const mesa = mesas.find(m => m.codigo === codigo && m.status === 'ocupada');
    if (mesa) {
        mesaAtual = mesa;
        document.getElementById('mesa-numero').textContent = mesa.id;
        document.getElementById('mesa-info').classList.remove('hidden');
        
        if (mesa.startTime) {
            updateTimer();
        }
        
        showMessage(`Bem-vindo à Mesa ${mesa.id}!`, 'success');
        updateCarrinho();
        loadPremiosCliente();
    } else {
        showMessage('Código inválido ou mesa não está ocupada.', 'error');
    }
}

// Melhorar geração de código com validação
function gerarCodigo() {
    const mesaId = parseInt(document.getElementById('mesa-select').value);
    const tempo = parseInt(document.getElementById('tempo-input').value);
    const cliente = sanitizeInput(document.getElementById('cliente-input').value.trim());
    
    if (!mesaId || !tempo || tempo <= 0) {
        showMessage('Selecione uma mesa e informe um tempo válido.', 'error');
        return;
    }
    
    if (tempo > 480) { // Máximo 8 horas
        showMessage('Tempo máximo permitido é de 480 minutos (8 horas).', 'error');
        return;
    }
    
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa || mesa.status !== 'livre') {
        showMessage('Mesa não disponível.', 'error');
        return;
    }
    
    const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    mesa.status = 'ocupada';
    mesa.codigo = codigo;
    mesa.cliente = cliente || `Cliente Mesa ${mesaId}`;
    mesa.tempoContratado = tempo;
    mesa.startTime = Date.now();
    mesa.totalGasto = 0;
    
    showMessage(`Mesa ${mesaId} ocupada! Código: ${codigo}`, 'success');
    
    loadMesas();
    loadMesasSelect();
    updateStatus();
    
    document.getElementById('mesa-select').value = '';
    document.getElementById('tempo-input').value = '';
    document.getElementById('cliente-input').value = '';
}

// Melhorar validação de funcionário
function adicionarFuncionario() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="func-nome" required maxlength="100">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="func-email" required maxlength="100">
            </div>
            <div class="form-group">
                <label>Cargo:</label>
                <select id="func-cargo">
                    <option value="Atendente">Atendente</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Técnico">Técnico</option>
                </select>
            </div>
            <div class="form-group">
                <label>Salário:</label>
                <input type="number" id="func-salario" step="0.01" min="0" max="50000" required>
            </div>
            <div class="form-group">
                <label>Telefone:</label>
                <input type="tel" id="func-telefone" placeholder="(11) 99999-9999" maxlength="15">
            </div>
        </div>
    `;
    
    openModal('Adicionar Funcionário', content, () => {
        const nome = sanitizeInput(document.getElementById('func-nome').value.trim());
        const email = document.getElementById('func-email').value.trim();
        const cargo = document.getElementById('func-cargo').value;
        const salario = parseFloat(document.getElementById('func-salario').value);
        const telefone = document.getElementById('func-telefone').value.trim();
        
        if (!nome || !email || !salario) {
            showMessage('Preencha todos os campos obrigatórios!', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage('Email inválido!', 'error');
            return;
        }
        
        if (telefone && !validatePhone(telefone)) {
            showMessage('Telefone deve estar no formato (11) 99999-9999', 'warning');
        }
        
        // Verificar se email já existe
        if (funcionarios.some(f => f.email === email)) {
            showMessage('Email já cadastrado!', 'error');
            return;
        }
        
        const novoId = Math.max(...funcionarios.map(f => f.id), 0) + 1;
        funcionarios.push({
            id: novoId,
            nome,
            email,
            cargo,
            salario,
            telefone,
            status: 'ativo',
            dataAdmissao: new Date().toISOString().split('T')[0]
        });
        
        loadFuncionarios();
        updateDashboard();
        showMessage('Funcionário adicionado com sucesso!', 'success');
    });
}