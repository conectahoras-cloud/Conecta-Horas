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
        // Apenas atualiza o menu se já estiver em uma página pública
        if (typeof showMenuUser === 'function') {
            showMenuUser();
        } else {
             window.location.href = 'main.html';
        }
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
    var vaga = {
        id: 'v_' + new Date().getTime(),
        titulo: titulo,
        descricao: descricao,
        salario: salario,
        carga: carga,
        empregadorId: u.id,
        empregadorNome: u.nome,
        candidatos: []
    };
    vagas.unshift(vaga); // Adiciona a nova vaga no INÍCIO da lista
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
    for(var i = 0; i < vagas.length; i++) {
        if (vagas[i].id === vagaId) {
            vagaEncontrada = vagas[i];
            break;
        }
    }

    if (vagaEncontrada) {
        // Usando indexOf para verificar se o id já existe no array
        if (vagaEncontrada.candidatos.indexOf(u.id) !== -1) {
            showNotification('Você já se candidatou a esta vaga.', 'error');
            return false;
        }
        vagaEncontrada.candidatos.push(u.id);
        saveData('ch_vagas', vagas);
        showNotification('Candidatura enviada!', 'success');
        return true;
    }
    showNotification('Erro: Vaga não encontrada.', 'error');
    return false;
}

// --- Funções de Renderização (Mostrar coisas na tela) ---
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
            html += '<button class="btn" onclick="candidatarSe(\'' + v.id + '\')">Candidatar-se</button>';
        }
        html += '</div>';
    }
    el.innerHTML = html;
}

function renderVagasComCandidatos(emp
