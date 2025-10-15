/* main.js - Lógica central do ConectaHoras (VERSÃO PROFISSIONAL) */

// --- Helpers de storage ---
function loadData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function getSessionUser() { return JSON.parse(sessionStorage.getItem('ch_session')) || null; }
function setSessionUser(user) { sessionStorage.setItem('ch_session', JSON.stringify(user)); }
function clearSessionUser() { sessionStorage.removeItem('ch_session'); }

// --- FUNÇÃO DE NOTIFICAÇÕES ELEGANTES ---
function showNotification(message, type) {
    var container = document.getElementById('notification-container');
    if (!container) { // Se o container não existir, cria ele
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    var notification = document.createElement('div');
    notification.className = 'notification ' + type; // success ou error
    notification.innerText = message;
    container.appendChild(notification);
    // Remove a notificação depois de 4 segundos
    setTimeout(function() {
        notification.remove();
    }, 4000);
}

// --- Funções de usuário (com notificações e validação melhorada) ---
function registerUser(nome, email, senha, tipo) {
    var users = loadData('ch_users');
    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase()) {
            showNotification('Este email já está em uso.', 'error');
            return false;
        }
    }
    var u = { 
        id: 'u_' + new Date().getTime(), // ID único baseado no tempo
        nome: nome, 
        email: email, 
        senha: senha, // Em um projeto real, a senha seria criptografada!
        tipo: tipo 
    };
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
    // Redireciona para a página de login se estiver em uma área restrita
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
        el.innerHTML = '<a href="login.html" class="btn">
