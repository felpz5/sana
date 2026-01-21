// Variáveis específicas do cliente
let mesaAtual = { id: 'Cliente', totalGasto: 0 }; // Mesa virtual para cliente
let carrinho = [];
let rating = 5;

// Iniciar experiência (substitui o login da mesa)
function iniciarExperiencia() {
    // Esconder tela de boas-vindas
    document.querySelector('.welcome-screen').classList.add('hidden');
    
    // Mostrar tabs principais
    document.getElementById('main-tabs').classList.remove('hidden');
    
    // Mostrar cardápio por padrão
    showTab('cardapio');
    
    showMessage('Bem-vindo ao P.U.P.! Explore nosso cardápio e aproveite!', 'success');
    updateCarrinho();
    loadPremiosCliente();
}

// Carregar menu e promoções juntos
function loadMenu() {
    loadPromocoes();
    loadMenuRegular();
}

// Carregar promoções
function loadPromocoes() {
    const promocoesGrid = document.getElementById('promocoes-grid');
    if (!promocoesGrid) return;
    
    promocoesGrid.innerHTML = '';
    
    if (!promocoes || promocoes.length === 0) {
        promocoesGrid.innerHTML = '<p>Nenhuma promoção disponível no momento.</p>';
        return;
    }
    
    promocoes.filter(p => p.ativa).forEach(promocao => {
        const promocaoCard = document.createElement('div');
        promocaoCard.className = 'promocao-card';
        promocaoCard.innerHTML = `
            <h4>🏷️ ${promocao.nome}</h4>
            <p>${promocao.descricao}</p>
            <div class="preco-original">De R$ ${promocao.precoOriginal.toFixed(2)}</div>
            <div class="preco-promocional">R$ ${promocao.precoPromocional.toFixed(2)}</div>
            <div class="validade">Válido até: ${promocao.validade}</div>
            <button class="btn btn-primary" onclick="adicionarPromocaoAoCarrinho('${promocao.nome}', ${promocao.precoPromocional})" style="margin-top: 15px;">
                <i class="fas fa-plus"></i> Adicionar Pacote
            </button>
        `;
        promocoesGrid.appendChild(promocaoCard);
    });
}

// Carregar cardápio regular
function loadMenuRegular() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;
    
    menuGrid.innerHTML = '';
    
    if (!menu || menu.length === 0) {
        menuGrid.innerHTML = '<p>Cardápio não disponível no momento.</p>';
        return;
    }
    
    const categoria = document.getElementById('categoria-filter')?.value || 'todos';
    const busca = document.getElementById('search-input')?.value.toLowerCase() || '';
    
    let menuFiltrado = menu;
    
    if (categoria !== 'todos') {
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
            <button class="btn btn-primary" onclick="adicionarAoCarrinho('${item.nome}')" style="margin-top: 10px;">
                <i class="fas fa-plus"></i> Adicionar
            </button>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Adicionar promoção ao carrinho
function adicionarPromocaoAoCarrinho(nomePromocao, preco) {
    const itemCarrinho = carrinho.find(c => c.nome === nomePromocao);
    if (itemCarrinho) {
        itemCarrinho.quantidade++;
    } else {
        carrinho.push({
            nome: nomePromocao,
            preco: preco,
            categoria: 'Promoção',
            quantidade: 1
        });
    }
    
    updateCarrinho();
    showMessage(`${nomePromocao} adicionado ao carrinho!`, 'success');
}

function filterMenu() {
    loadMenu(); // Carrega tudo novamente
}

// Carrinho
function adicionarAoCarrinho(nomeItem) {
    const item = menu.find(m => m.nome === nomeItem);
    if (item) {
        const itemCarrinho = carrinho.find(c => c.nome === nomeItem);
        if (itemCarrinho) {
            itemCarrinho.quantidade++;
        } else {
            carrinho.push({...item, quantidade: 1});
        }
        
        updateCarrinho();
        showMessage(`${item.nome} adicionado ao carrinho!`, 'success');
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

function removerDoCarrinho(nomeItem) {
    const index = carrinho.findIndex(item => item.nome === nomeItem);
    if (index > -1) {
        carrinho.splice(index, 1);
        updateCarrinho();
    }
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        showMessage('Adicione itens ao carrinho primeiro.', 'error');
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
    
    carrinho = [];
    updateCarrinho();
    
    showMessage(`Pedido #${novoPedido.id} enviado! Total: R$ ${total.toFixed(2)}`, 'success');
    loadPremiosCliente(); // Atualizar pontos
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
    const premio = premios.find(p => p.id === premioId);
    const pontosCliente = Math.floor(mesaAtual.totalGasto / 5);
    
    if (pontosCliente < premio.pontos) {
        showMessage('Pontos insuficientes!', 'error');
        return;
    }
    
    if (confirm(`Deseja resgatar '${premio.nome}' por ${premio.pontos} pontos?`)) {
        showMessage(`Prêmio '${premio.nome}' resgatado com sucesso!`, 'success');
        loadPremiosCliente();
    }
}

// Avaliação
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
    const comentario = document.getElementById('feedback-text').value.trim();
    
    feedbacks.push({
        mesaId: mesaAtual.id,
        avaliacao: rating,
        comentario: comentario,
        timestamp: new Date().toLocaleString()
    });
    
    showMessage('Obrigado por seu feedback!', 'success');
    document.getElementById('feedback-text').value = '';
    setRating(5);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco mais para garantir que os dados do common.js sejam carregados
    setTimeout(() => {
        loadMenu();
        loadPremiosCliente();
        setRating(5);
    }, 200);
});