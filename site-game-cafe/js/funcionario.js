// Carregar mesas
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
    const cliente = sanitizeInput(document.getElementById('cliente-input').value.trim());
    
    if (!mesaId || !tempo || tempo <= 0) {
        showMessage('Selecione uma mesa e informe um tempo válido.', 'error');
        return;
    }
    
    if (tempo > 480) {
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
    
    document.getElementById('mesa-select').value = '';
    document.getElementById('tempo-input').value = '';
    document.getElementById('cliente-input').value = '';
}

function liberarMesa(mesaId) {
    if (confirm(`Confirma a liberação da Mesa ${mesaId}?`)) {
        const mesa = mesas.find(m => m.id === mesaId);
        if (mesa) {
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
            showMessage(`Mesa ${mesaId} liberada com sucesso!`, 'success');
        }
    }
}

function ocuparMesa(mesaId) {
    document.getElementById('mesa-select').value = mesaId;
    showTab('gerar-codigo');
}

// Carregar pedidos
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
        showMessage(`Pedido #${pedidoId} atualizado para: ${novoStatus.toUpperCase()}`, 'success');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadMesas();
        loadPedidos();
        loadMesasSelect();
    }, 100);
});