/* main.js - Lógica central do ConectaHoras (VERSÃO FINAL CORRIGIDA) */

// --- Helpers de storage ---
// Lê da memória PERMANENTE (localStorage)
function loadData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
// Salva na memória PERMANENTE (localStorage)
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// Lê da memória TEMPORÁRIA (sessionStorage)
function getSessionUser() { return JSON.parse(sessionStorage.getItem('ch_session')) || null; }
// Salva na memória TEMPORÁRIA (sessionStorage)
function setSessionUser(user) { sessionStorage.setItem('ch_session', JSON.stringify(user)); }
// Limpa a memória TEMPORÁRIA (sessionStorage)
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
    saveData('ch_users', users); // Salva o novo usuário na memória PERMANENTE
    showNotification('Cadastro efetuado com sucesso! Faça o login.', 'success');
    return true;
}

function loginUser(email, senha) {
    var users = loadData('ch_users');
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        if (u.email.toLowerCase() === email.toLowerCase() && u.senha === senha) {
            setSessionUser(u); // Salva o login na memória TEMPORÁRIA
            showNotification('Login bem-sucedido, ' + u.nome + '!', 'success');
            return u;
        }
    }
    showNotification('Email ou senha incorretos.', 'error');
    return null;
}

function logout() {
    clearSessionUser(); // Limpa a memória TEMPORÁRIA
    showNotification('Você saiu da sua conta.', 'success');
    window.location.href = 'index.html';
}

// O resto das funções (showMenuUser, publicarVaga, etc.) continua o mesmo da versão anterior.
// Certifique-se de que seu arquivo main.js contém todas as outras funções necessárias.
// Se tiver dúvida, me peça o arquivo completo novamente.
