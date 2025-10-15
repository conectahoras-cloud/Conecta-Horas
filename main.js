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
    window.location.href = 'index.html';
}

// --- A FUNÇÃO DE MENU DINÂMICO ---
function showMenuUser() {
    var navContainer = document.querySelector('.topbar nav');
    var userMenuContainer = document.getElementById('menuUser');
    var u = getSessionUser();

    if (!navContainer || !userMenuContainer) return;

    if (u) { // Se TEM um usuário logado
        userMenuContainer.innerHTML = 'Logado: <strong>' + u.nome + '</strong> <button onclick="logout()" class="btn secondary">Sair</button>';
        
        if (u.tipo === 'funcionario') {
            navContainer.innerHTML = '<a href="index.html">Início</a>' +
                                     '<a href="funcionario.html">Minha Área</a>';
        } else if (u.tipo === 'empregador') {
            navContainer.innerHTML = '<a href="index.html">Início</a>' +
                                     '<a href="empresa.html">Minha Área</a>';
        }

    } else { // Se NÃO TEM ninguém logado
        userMenuContainer.innerHTML = '<a href="login.html" class="btn">Login</a>';
        navContainer.innerHTML = '<a href="index.html">Início</a>' +
                                 '<a href="cadastro.html">Cadastre-se</a>';
    }
}

// --- Funções de Vagas ---
function publicarVaga(titulo, descricao, salario, carga) {
    var u = getSessionUser();
    if (!u || u.tipo !== 'empregador') { 
        showNotification('Acesso negado.', 'error');
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

// --- Funções do Banco de Horas ---
function registrarHoras() {
    var u = getSessionUser();
    if (!u || u.tipo !== 'funcionario') {
        showNotification('Acesso negado.', 'error');
        return;
    }
    var data = document.getElementById('horaData').value;
    var horas = document.getElementById('horaQuantidade').value;
    if (!data || !horas || horas <= 0) {
        showNotification('Preencha a data e uma quantidade de horas válida.', 'error');
        return;
    }
    var horasDb = loadData('ch_horas');
    var registro = { id: 'h_' + new Date().getTime(), userId: u.id, data: data, horas: parseFloat(horas) };
    horasDb.push(registro);
    saveData('ch_horas', horasDb);
    showNotification('Horas registradas com sucesso!', 'success');
    renderMinhasHoras();
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

// --- Funções de renderização de listas ---
function renderVagasList(vagas, containerId, allowApply) {
    var el = document.getElementById(containerId);
    if (!el) return;
    if (!vagas || vagas.length === 0) { 
        el.innerHTML = '<p class="small" style="text-align: center;">Nenhuma vaga encontrada no momento.</p>'; 
        return; 
    }
    var html = '';
    for (var i = 0; i < vagas.length; i++) {
        var v = vagas[i];
        html += '<div class="vaga">';
        html += '<h4>' + v.titulo + '</h4>';
        html += '<p><strong>Empresa:</strong> ' + (v.empregadorNome || 'N/A') + '</p>';
        html += '<p>' + v.descricao + '</p>';
        html += '<p class="small">Salário: ' + (v.salario || 'A combinar') + ' · Carga Horária: ' + (v.carga || 'Não informada') + '</p>';
        if (allowApply) {
            var u = getSessionUser();
            // Só mostra o botão de candidatar se o usuário for um funcionário
            if (u && u.tipo === 'funcionario') {
                html += '<button class="btn" onclick="candidatarSe(\'' + v.id + '\')">Candidatar-se</button>';
            }
        }
        html += '</div>';
    }
    el.innerHTML = html;
}

function renderVagasComCandidatos(empId, containerId) {
    var todasVagas = loadData('ch_vagas');
    var minhasVagas = [];
    for (var i = 0; i < todasVagas.length; i++) { if (todasVagas[i].empregadorId === empId) { minhasVagas.push(todasVagas[i]); } }
    var el = document.getElementById(containerId);
    if (!el) return;
    if (minhasVagas.length === 0) { el.innerHTML = '<div class="small">Você não publicou vagas ainda.</div>'; return; }
    var users = loadData('ch_users');
    var html = '';
    for (var i = 0; i < minhasVagas.length; i++) {
        var v = minhasVagas[i];
        html += '<div class="vaga">';
        html += '<h4>' + v.titulo + '</h4>';
        html += '<p class="small">Candidatos inscritos: ' + v.candidatos.length + '</p>';
        if (v.candidatos.length > 0) {
            html += '<ul>';
            for (var j = 0; j < v.candidatos.length; j++) {
                var candidatoId = v.candidatos[j];
                var candidatoNome = 'Usuário não encontrado';
                for (var k = 0; k < users.length; k++) { if (users[k].id === candidatoId) { candidatoNome = users[k].nome; break; } }
                html += '<li>' + candidatoNome + '</li>';
            }
            html += '</ul>';
        }
        html += '</div>';
    }
    el.innerHTML = html;
}
