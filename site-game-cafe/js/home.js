// Atualizar status na página inicial
function updateStatus() {
    const mesasOcupadas = mesas.filter(m => m.status === 'ocupada').length;
    const vendasHoje = vendas.filter(v => v.data === new Date().toISOString().split('T')[0])
        .reduce((sum, v) => sum + v.valor, 0);
    const mediaAvaliacao = feedbacks.length > 0 ? 
        feedbacks.reduce((sum, f) => sum + f.avaliacao, 0) / feedbacks.length : 5.0;
    
    const mesasEl = document.getElementById('mesas-ocupadas');
    const vendasEl = document.getElementById('vendas-hoje');
    const avaliacaoEl = document.getElementById('avaliacao');
    
    if (mesasEl) mesasEl.textContent = `${mesasOcupadas}/20`;
    if (vendasEl) vendasEl.textContent = `R$ ${vendasHoje.toFixed(2)}`;
    if (avaliacaoEl) avaliacaoEl.textContent = `${mediaAvaliacao.toFixed(1)}/5.0`;
}

// Atualizar status periodicamente
setInterval(updateStatus, 5000);

// Atualizar status inicial
setTimeout(updateStatus, 100);