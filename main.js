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
    window.location.href = 'index.html'; // CORRIGIDO
}

// --- A FUNÇÃO DE MENU DINÂMICO ---
function showMenuUser() {
    var navContainer = document.querySelector('.topbar nav');
    var userMenuContainer = document.getElementById('menuUser');
    var u = getSessionUser();

    if (!navContainer || !userMenuContainer) return;

    if (u) {
        userMenuContainer.innerHTML = 'Logado: <strong>' + u.nome + '</strong> <button onclick="logout()" class="btn secondary">Sair</button>';
        if (u.tipo === 'funcionario') {
            navContainer.innerHTML = '<a href="index.html">Início</a><a href="funcionario.html">Minha Área</a>';
        } else if (u.tipo === 'empregador') {
            navContainer.innerHTML = '<a href="index.html">Início</a><a href="empresa.html">Minha Área</a>';
        }
    } else {
        userMenuContainer.innerHTML = '<a href="login.html" class="btn">Login</a>';
        navContainer.innerHTML = '<a href="index.html">Início</a><a href="cadastro.html">Cadastre-se</a>';
    }
}

// --- Demais funções (sem alteração) ---
function publicarVaga(titulo, descricao, salario, carga) { /* ... */ }
function candidatarSe(vagaId) { /* ... */ }
function registrarHoras() { /* ... */ }
function renderMinhasHoras() { /* ... */ }
function renderVagasList(vagas, containerId, allowApply) { /* ... */ }
function renderVagasComCandidatos(empId, containerId) { /* ... */ }
