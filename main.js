/* main.js - Lógica central do ConectaHoras (VERSÃO COM MENU DINÂMICO) */

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
    // Sempre redireciona para a página inicial após o logout
    window.location.href = 'main.html';
}

// --- A NOVA FUNÇÃO DE MENU DINÂMICO ---
function showMenuUser() {
    var navContainer = document.querySelector('.topbar nav');
    var userMenuContainer = document.getElementById('menuUser');
    var u = getSessionUser();

    if (u) { // Se TEM um usuário logado
        userMenuContainer.innerHTML = 'Logado: <strong>' + u.nome + '</strong> <button onclick="logout()" class="btn secondary">Sair</button>';
        
        // Constrói o menu com base no tipo de usuário
        if (u.tipo === 'funcionario') {
            navContainer.innerHTML = '<a href="main.html">Início</a>' +
                                     '<a href="funcionario.html">Área do Funcionário</a>';
        } else if (u.tipo === 'empregador') {
            navContainer.innerHTML = '<a href="main.html">Início</a>' +
                                     '<a href="empresa.html">Área do Empregador</a>';
        }

    } else { // Se NÃO TEM ninguém logado
        userMenuContainer.innerHTML = '<a href="login.html" class="btn">Login / Cadastro</a>';
        navContainer.innerHTML = '<a href="main.html">Início</a>' +
                                 '<a href="login.html">Área do Funcionário</a>' +
                                 '<a href="login.html">Área do Empregador</a>';
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

function renderMinhasHoras() { /* ... (código sem alteração) ... */ }
function renderVagasList(vagas, containerId, allowApply) { /* ... (código sem alteração) ... */ }
function renderVagasComCandidatos(empId, containerId) { /* ... (código sem alteração) ... */ }
