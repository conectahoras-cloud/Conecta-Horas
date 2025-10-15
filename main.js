/* main.js - Lógica central do ConectaHoras (VERSÃO PROFISSIONAL) */

// --- Helpers de storage ---
function loadData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function getSessionUser() { return JSON.parse(sessionStorage.getItem('ch_session')) || null; }
function setSessionUser(user) { sessionStorage.setItem('ch_session', JSON.stringify(user)); }
function clearSessionUser() { sessionStorage.removeItem('ch_session'); }

// --- FUNÇÃO DE NOTIFICAÇÕES ---
function showNotification(message, type) {
    var container = document.getElementById('notification-container');
    if (!container) { container = document.createElement('div'); container.id = 'notification-container'; document.body.appendChild(container); }
    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerText = message;
    container.appendChild(notification);
    setTimeout(function() { notification.remove(); }, 4000);
}

// --- Funções de usuário ---
function registerUser(nome, email, senha, tipo) {
    var users = loadData('ch_users');
    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase()) {
            showNotification('Este email já está em uso.', 'error');
            return false;
        }
    }
    var u = { id: 'u_' + new Date().getTime(), nome: nome, email: email, senha: senha, tipo: tipo };
    users.push(u);
    saveData('ch_users', users);
    showNotification('Cadastro efetuado com sucesso! Faça o login.', 'success');
    return true;
}

function loginUser(email, senha) {
    var users = loadData('ch_users');
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        if (u.email.toLowerCase() === email.toLowerCase() && u.senha === senha) {
            setSessionUser(u);
            showNotification('Login bem-sucedido, ' + u.nome + '!', 'success');
            return u;
        }
    }
    showNotification('Email ou senha incorretos.', 'error');
    return null;
}

function logout() {
    clearSessionUser();
    showNotification('Você saiu da sua conta.', 'success');
    if (window.location.pathname.includes('funcionario.html') || window.location.pathname.includes('empresa.html')) {
        window.location.href = 'login.html';
    } else {
        showMenuUser();
    }
}

function showMenuUser() {
    var el = document.getElementById('menuUser');
    if (!el) return;
    var u = getSessionUser();
    if (u) {
        el.innerHTML = 'Logado: <strong>' + u.nome + '</strong> (' + u.tipo + ') <button onclick="logout()" class="btn secondary">Sair</button>';
    } else {
        el.innerHTML = '<a href="login.html" class="btn">Login</a> <a href="cadastro.html" class="btn">Cadastre-se</a>';
    }
}

// --- Funções de Vagas ---
function publicarVaga(titulo, descricao, salario, carga) {
    var u = getSessionUser();
    if (!u || u.tipo !== 'empregador') { 
        showNotification('Acesso negado. Apenas empregadores podem publicar.', 'error');
        return false; 
    }
    var vagas = loadData('ch_vagas');
    var vaga = { id: 'v_' + new Date().getTime(), titulo: titulo, descricao: descricao, salario: salario, carga: carga, empregadorId: u.id, empregadorNome: u.nome, candidatos: [] };
    vagas.unshift(vaga);
    saveData('ch_vagas', vagas);
    showNotification('Vaga publicada com sucesso!', 'success');
    return true;
}

function candidatarSe(vagaId) {
    var u = getSessionUser();
    if (!u || u.tipo !== 'funcionario') { 
        showNotification('Faça login como funcionário para se candidatar.', 'error');
        return false; 
    }
    var vagas = loadData('ch_vagas');
    var vagaEncontrada = null;
    for(var i = 0; i < vagas.length; i++) { if (vagas[i].id === vagaId) { vagaEncontrada = vagas[i]; break; } }
    if (vagaEncontrada) {
        if (vagaEncontrada.candidatos.indexOf(u.id) !== -1) { showNotification('Você já se candidatou a esta vaga.', 'error'); return false; }
        vagaEncontrada.candidatos.push(u.id);
        saveData('ch_vagas', vagas);
        showNotification('Candidatura enviada!', 'success');
        return true;
    }
    showNotification('Erro: Vaga não encontrada.', 'error');
    return false;
}

// --- FUNÇÕES DO BANCO DE HORAS (CORRIGIDAS) ---
function registrarHoras() {
    var u = getSessionUser();
    if (!u || u.tipo !== 'funcionario') {
        showNotification('Acesso negado.', 'error');
        return;
    }
    var data = document.getElementById('horaData').value;
    var horas = document.getElementById('horaQuantidade').value;
    if (!data || !horas || horas <= 0) {
        showNotification('Por favor, preencha a data e uma quantidade de horas válida.', 'error');
        return;
    }
    var horasDb = loadData('ch_horas');
    var registro = {
        id: 'h_' + new Date().getTime(),
        userId: u.id,
        data: data,
        horas: parseFloat(horas)
    };
    horasDb.push(registro);
    saveData('ch_horas', horasDb);
    showNotification('Horas registradas com sucesso!', 'success');
    
    // Limpa os campos do formulário
    document.getElementById('horaData').value = '';
    document.getElementById('horaQuantidade').value = '';

    renderMinhasHoras(); // Atualiza a tabela na tela
}

function renderMinhasHoras() {
    var u = getSessionUser();
    var el = document.getElementById('listaHoras');
    if (!el || !u) return;

    var horasDb = loadData('ch_horas');
    var minhasHoras = [];
    for (var i = 0; i < horasDb.length; i++) {
        if (horasDb[i].userId === u.id) {
            minhasHoras.push(horasDb[i]);
        }
    }

    if (minhasHoras.length === 0) {
        el.innerHTML = '<p class="small">Nenhum registro de horas encontrado.</p>';
        return;
    }

    var totalHoras = 0;
    var html = '<table><thead><tr><th>Data</th><th>Horas Trabalhadas</th></tr></thead><tbody>';
    for (var i = 0; i < minhasHoras.length; i++) {
        html += '<tr><td>' + minhasHoras[i].data + '</td><td>' + minhasHoras[i].horas + '</td></tr>';
        totalHoras += minhasHoras[i].horas;
    }
    html += '</tbody><tfoot><tr><td><strong>Total de Horas</strong></td><td><strong>' + totalHoras + '</strong></td></tr></tfoot></table>';
    el.innerHTML = html;
}

// --- Funções de renderização que já existiam ---
function renderVagasList(vagas, containerId, allowApply) { /* ... (código sem alteração) ... */ }
function renderVagasComCandidatos(empId, containerId) { /* ... (código sem alteração) ... */ }
