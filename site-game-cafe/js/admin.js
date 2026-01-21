// Variáveis específicas do admin
let currentModal = null;

// Dashboard
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

// Modal System
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
    if (currentModal) currentModal();
    closeModal();
}

// Funcionários
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
            status: 'ativo'
        });
        
        loadFuncionarios();
        updateDashboard();
        showMessage('Funcionário adicionado com sucesso!', 'success');
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
        </div>
    `;
    
    openModal('Editar Funcionário', content, () => {
        funcionario.nome = sanitizeInput(document.getElementById('func-nome').value.trim());
        funcionario.email = document.getElementById('func-email').value.trim();
        funcionario.cargo = document.getElementById('func-cargo').value;
        funcionario.salario = parseFloat(document.getElementById('func-salario').value);
        funcionario.telefone = document.getElementById('func-telefone').value.trim();
        
        loadFuncionarios();
        showMessage('Funcionário atualizado com sucesso!', 'success');
    });
}

function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        funcionarios = funcionarios.filter(f => f.id !== id);
        loadFuncionarios();
        updateDashboard();
        showMessage('Funcionário excluído com sucesso!', 'success');
    }
}

// Menu Admin
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
        const nome = sanitizeInput(document.getElementById('item-nome').value.trim());
        const categoria = document.getElementById('item-categoria').value;
        const preco = parseFloat(document.getElementById('item-preco').value);
        const descricao = sanitizeInput(document.getElementById('item-descricao').value.trim());
        const destaque = document.getElementById('item-destaque').checked;
        const popularidade = parseInt(document.getElementById('item-popularidade').value);
        
        if (nome && categoria && preco) {
            menu.push({nome, categoria, preco, descricao, destaque, popularidade});
            loadMenuAdmin();
            showMessage('Item adicionado com sucesso!', 'success');
        } else {
            showMessage('Preencha todos os campos obrigatórios!', 'error');
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
        item.nome = sanitizeInput(document.getElementById('item-nome').value.trim());
        item.categoria = document.getElementById('item-categoria').value;
        item.preco = parseFloat(document.getElementById('item-preco').value);
        item.descricao = sanitizeInput(document.getElementById('item-descricao').value.trim());
        item.destaque = document.getElementById('item-destaque').checked;
        item.popularidade = parseInt(document.getElementById('item-popularidade').value);
        
        loadMenuAdmin();
        showMessage('Item atualizado com sucesso!', 'success');
    });
}

function excluirItemMenu(index) {
    if (confirm('Tem certeza que deseja excluir este item do menu?')) {
        menu.splice(index, 1);
        loadMenuAdmin();
        showMessage('Item excluído com sucesso!', 'success');
    }
}

// Relatórios
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
    if (jogos.length === 0) {
        alert('Nenhum jogo cadastrado ainda.');
        return;
    }
    
    const jogosOrdenados = jogos.sort((a, b) => b.jogadas - a.jogadas);
    
    let relatorio = '🎮 JOGOS MAIS JOGADOS\n\n';
    jogosOrdenados.forEach((jogo, index) => {
        relatorio += `${index + 1}. ${jogo.nome} (${jogo.categoria}): ${jogo.jogadas} jogadas\n`;
    });
    
    alert(relatorio);
}

function gerarRelatorioVendas() {
    if (pedidos.length === 0) {
        alert('Nenhum pedido registrado ainda.');
        return;
    }
    
    const itensCount = {};
    pedidos.forEach(pedido => {
        pedido.itens.forEach(item => {
            const nomeItem = item.split(' (')[0];
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateDashboard();
        loadFuncionarios();
        loadMenuAdmin();
        loadJogos();
        loadDispositivos();
        loadPromocoesAdmin();
        loadPremiosAdmin();
        loadFinanceiro();
    }, 100);
});

// Jogos
function loadJogos() {
    const jogosList = document.getElementById('jogos-list');
    if (!jogosList) return;
    
    jogosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Console</th>
                    <th>Jogadas</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${jogos.map(jogo => `
                    <tr>
                        <td>${jogo.nome}</td>
                        <td>${jogo.categoria}</td>
                        <td>${jogo.console}</td>
                        <td>${jogo.jogadas}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-edit btn-small" onclick="editarJogo(${jogo.id})">Editar</button>
                                <button class="btn btn-delete btn-small" onclick="excluirJogo(${jogo.id})">Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
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
                <select id="jogo-categoria">
                    <option value="Ação">Ação</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Corrida">Corrida</option>
                    <option value="MOBA">MOBA</option>
                    <option value="RPG">RPG</option>
                </select>
            </div>
            <div class="form-group">
                <label>Console:</label>
                <select id="jogo-console">
                    <option value="PS5">PS5</option>
                    <option value="Xbox Series X">Xbox Series X</option>
                    <option value="PC Gamer">PC Gamer</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                </select>
            </div>
        </div>
    `;
    
    openModal('Adicionar Jogo', content, () => {
        const nome = sanitizeInput(document.getElementById('jogo-nome').value.trim());
        const categoria = document.getElementById('jogo-categoria').value;
        const console = document.getElementById('jogo-console').value;
        
        if (nome) {
            const novoId = Math.max(...jogos.map(j => j.id), 0) + 1;
            jogos.push({id: novoId, nome, categoria, console, jogadas: 0});
            loadJogos();
            showMessage('Jogo adicionado com sucesso!', 'success');
        }
    });
}

function editarJogo(id) {
    const jogo = jogos.find(j => j.id === id);
    if (!jogo) return;
    
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="jogo-nome" value="${jogo.nome}" required>
            </div>
            <div class="form-group">
                <label>Categoria:</label>
                <select id="jogo-categoria">
                    <option value="Ação" ${jogo.categoria === 'Ação' ? 'selected' : ''}>Ação</option>
                    <option value="Esportes" ${jogo.categoria === 'Esportes' ? 'selected' : ''}>Esportes</option>
                    <option value="Corrida" ${jogo.categoria === 'Corrida' ? 'selected' : ''}>Corrida</option>
                    <option value="MOBA" ${jogo.categoria === 'MOBA' ? 'selected' : ''}>MOBA</option>
                    <option value="RPG" ${jogo.categoria === 'RPG' ? 'selected' : ''}>RPG</option>
                </select>
            </div>
            <div class="form-group">
                <label>Console:</label>
                <select id="jogo-console">
                    <option value="PS5" ${jogo.console === 'PS5' ? 'selected' : ''}>PS5</option>
                    <option value="Xbox Series X" ${jogo.console === 'Xbox Series X' ? 'selected' : ''}>Xbox Series X</option>
                    <option value="PC Gamer" ${jogo.console === 'PC Gamer' ? 'selected' : ''}>PC Gamer</option>
                    <option value="Nintendo Switch" ${jogo.console === 'Nintendo Switch' ? 'selected' : ''}>Nintendo Switch</option>
                </select>
            </div>
        </div>
    `;
    
    openModal('Editar Jogo', content, () => {
        jogo.nome = sanitizeInput(document.getElementById('jogo-nome').value.trim());
        jogo.categoria = document.getElementById('jogo-categoria').value;
        jogo.console = document.getElementById('jogo-console').value;
        
        loadJogos();
        showMessage('Jogo atualizado com sucesso!', 'success');
    });
}

function excluirJogo(id) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        jogos = jogos.filter(j => j.id !== id);
        loadJogos();
        showMessage('Jogo excluído com sucesso!', 'success');
    }
}

// Dispositivos
function loadDispositivos() {
    const dispositivosList = document.getElementById('dispositivos-list');
    if (!dispositivosList) return;
    
    dispositivosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Modelo</th>
                    <th>Status</th>
                    <th>Mesa</th>
                </tr>
            </thead>
            <tbody>
                ${dispositivos.map(disp => `
                    <tr>
                        <td>${disp.id}</td>
                        <td>${disp.tipo}</td>
                        <td>${disp.modelo}</td>
                        <td><span class="status-badge ${disp.status}">${disp.status}</span></td>
                        <td>Mesa ${disp.mesa}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Promoções Admin
function loadPromocoesAdmin() {
    const promocoesList = document.getElementById('promocoes-list');
    if (!promocoesList) return;
    
    promocoesList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
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
        </div>
    `;
    
    openModal('Adicionar Promoção', content, () => {
        const nome = sanitizeInput(document.getElementById('promo-nome').value.trim());
        const descricao = sanitizeInput(document.getElementById('promo-descricao').value.trim());
        const precoOriginal = parseFloat(document.getElementById('promo-original').value);
        const precoPromocional = parseFloat(document.getElementById('promo-promocional').value);
        const validade = document.getElementById('promo-validade').value;
        
        if (nome && precoOriginal && precoPromocional && validade) {
            const novoId = Math.max(...promocoes.map(p => p.id), 0) + 1;
            promocoes.push({id: novoId, nome, descricao, precoOriginal, precoPromocional, validade, ativa: true});
            loadPromocoesAdmin();
            showMessage('Promoção adicionada com sucesso!', 'success');
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
        promocao.nome = sanitizeInput(document.getElementById('promo-nome').value.trim());
        promocao.descricao = sanitizeInput(document.getElementById('promo-descricao').value.trim());
        promocao.precoOriginal = parseFloat(document.getElementById('promo-original').value);
        promocao.precoPromocional = parseFloat(document.getElementById('promo-promocional').value);
        promocao.validade = document.getElementById('promo-validade').value;
        promocao.ativa = document.getElementById('promo-ativa').checked;
        
        loadPromocoesAdmin();
        showMessage('Promoção atualizada com sucesso!', 'success');
    });
}

function excluirPromocao(id) {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
        promocoes = promocoes.filter(p => p.id !== id);
        loadPromocoesAdmin();
        showMessage('Promoção excluída com sucesso!', 'success');
    }
}

// Prêmios Admin
function loadPremiosAdmin() {
    const premiosList = document.getElementById('premios-list');
    if (!premiosList) return;
    
    premiosList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Pontos</th>
                    <th>Descrição</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${premios.map(premio => `
                    <tr>
                        <td>${premio.nome}</td>
                        <td>${premio.pontos}</td>
                        <td>${premio.descricao}</td>
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

function adicionarPremio() {
    const content = `
        <div class="form-modal">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="premio-nome" required>
            </div>
            <div class="form-group">
                <label>Pontos Necessários:</label>
                <input type="number" id="premio-pontos" min="1" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="premio-descricao" rows="3"></textarea>
            </div>
        </div>
    `;
    
    openModal('Adicionar Prêmio', content, () => {
        const nome = sanitizeInput(document.getElementById('premio-nome').value.trim());
        const pontos = parseInt(document.getElementById('premio-pontos').value);
        const descricao = sanitizeInput(document.getElementById('premio-descricao').value.trim());
        
        if (nome && pontos) {
            const novoId = Math.max(...premios.map(p => p.id), 0) + 1;
            premios.push({id: novoId, nome, pontos, descricao, disponivel: true});
            loadPremiosAdmin();
            showMessage('Prêmio adicionado com sucesso!', 'success');
        }
    });
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
                <label>Pontos Necessários:</label>
                <input type="number" id="premio-pontos" min="1" value="${premio.pontos}" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="premio-descricao" rows="3">${premio.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>Disponível:</label>
                <input type="checkbox" id="premio-disponivel" ${premio.disponivel ? 'checked' : ''}>
            </div>
        </div>
    `;
    
    openModal('Editar Prêmio', content, () => {
        premio.nome = sanitizeInput(document.getElementById('premio-nome').value.trim());
        premio.pontos = parseInt(document.getElementById('premio-pontos').value);
        premio.descricao = sanitizeInput(document.getElementById('premio-descricao').value.trim());
        premio.disponivel = document.getElementById('premio-disponivel').checked;
        
        loadPremiosAdmin();
        showMessage('Prêmio atualizado com sucesso!', 'success');
    });
}

function excluirPremio(id) {
    if (confirm('Tem certeza que deseja excluir este prêmio?')) {
        premios = premios.filter(p => p.id !== id);
        loadPremiosAdmin();
        showMessage('Prêmio excluído com sucesso!', 'success');
    }
}

// Financeiro
function loadFinanceiro() {
    const totalReceitas = vendas.reduce((sum, v) => sum + v.valor, 0);
    const totalCustos = custos.reduce((sum, c) => sum + c.valor, 0);
    const lucro = totalReceitas - totalCustos;
    
    document.getElementById('total-receitas').textContent = `R$ ${totalReceitas.toFixed(2)}`;
    document.getElementById('total-custos').textContent = `R$ ${totalCustos.toFixed(2)}`;
    document.getElementById('total-lucro').textContent = `R$ ${lucro.toFixed(2)}`;
    
    const transacoesList = document.getElementById('transacoes-list');
    if (!transacoesList) return;
    
    const todasTransacoes = [
        ...vendas.map(v => ({...v, tipo: 'receita'})),
        ...custos.map(c => ({...c, tipo: 'custo'}))
    ].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    transacoesList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                ${todasTransacoes.map(trans => `
                    <tr>
                        <td>${trans.data}</td>
                        <td><span class="status-badge ${trans.tipo === 'receita' ? 'ativo' : 'inativo'}">${trans.tipo.toUpperCase()}</span></td>
                        <td>${trans.descricao}</td>
                        <td class="${trans.tipo === 'receita' ? 'text-green' : 'text-red'}">R$ ${trans.valor.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}