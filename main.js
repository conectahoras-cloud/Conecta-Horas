/* main.js - Lógica SIMPLIFICADA e focada nos PDFs */

// --- A ÚNICA PARTE "EXTRA": GUARDAR DADOS (localStorage) ---
// Função para carregar dados do localStorage
function loadData(key) {
    var dadosEmTexto = localStorage.getItem(key);
    if (dadosEmTexto) {
        return JSON.parse(dadosEmTexto);
    }
    return []; // Se não houver nada, retorna um vetor vazio
}
// Função para salvar dados no localStorage
function saveData(key, data) {
    var dadosEmTexto = JSON.stringify(data);
    localStorage.setItem(key, dadosEmTexto);
}
// Funções para a memória temporária do login
function getSessionUser() { return JSON.parse(sessionStorage.getItem('ch_session')) || null; }
function setSessionUser(user) { sessionStorage.setItem('ch_session', JSON.stringify(user)); }
function clearSessionUser() { sessionStorage.removeItem('ch_session'); }

// --- Funções de Usuário (usando alert()) ---
function registerUser(nome, email, senha, tipo) {
    var users = loadData('ch_users');
    // Usando um loop 'for' para verificar se o email já existe [Conceito dos PDFs]
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            alert('Este email já está em uso.'); // Usando alert() [Conceito dos PDFs]
            return false;
        }
    }
    var u = { id: 'u_' + new Date().getTime(), nome: nome, email: email, senha: senha, tipo: tipo };
    users.push(u); // Adicionando ao vetor [Conceito dos PDFs]
    saveData('ch_users', users);
    alert('Cadastro efetuado com sucesso! Faça o login.');
    return true;
}

function loginUser(email, senha) {
    var users = loadData('ch_users');
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        if (u.email === email && u.senha === senha) {
            setSessionUser(u);
            alert('Login efetuado: ' + u.nome);
            return u;
        }
    }
    alert('Email ou senha incorretos.');
    return null;
}

function logout() {
    clearSessionUser();
    alert('Você saiu da sessão.');
    window.location.href = 'index.html';
}

// --- Funções de Vagas ---
function publicarVaga(titulo, descricao, salario, carga) {
    var u = getSessionUser();
    // Proteção de página com 'if' [Conceito dos PDFs]
    if (!u || u.tipo !== 'empregador') {
        alert('Acesso negado. Apenas empregadores podem publicar vagas.');
        return false;
    }
    var vagas = loadData('ch_vagas');
    var vaga = { id: 'v_' + new Date().getTime(), titulo: titulo, descricao: descricao, salario: salario, carga: carga, empregadorId: u.id, empregadorNome: u.nome, candidatos: [] };
    vagas.unshift(vaga); // Adiciona a nova vaga no início da lista
    saveData('ch_vagas', vagas);
    alert('Vaga publicada com sucesso!');
    return true;
}

function candidatarSe(vagaId) {
    var u = getSessionUser();
    if (!u || u.tipo !== 'funcionario') {
        alert('Faça login como funcionário para se candidatar.');
        return false;
    }
    var vagas = loadData('ch_vagas');
    for (var i = 0; i < vagas.length; i++) {
        if (vagas[i].id === vagaId) {
            var jaCandidatado = false;
            for (var j = 0; j < vagas[i].candidatos.length; j++) {
                if (vagas[i].candidatos[j] === u.id) {
                    jaCandidatado = true;
                    break;
                }
            }
            if (jaCandidatado) {
                alert('Você já se candidatou a esta vaga.');
                return false;
            }
            vagas[i].candidatos.push(u.id);
            saveData('ch_vagas', vagas);
            alert('Candidatura enviada!');
            return true;
        }
    }
    alert('Vaga não encontrada.');
    return false;
}

// --- Funções do Banco de Horas ---
function registrarHoras() {
    var u = getSessionUser();
    var data = document.getElementById('horaData').value;
    var horas = document.getElementById('horaQuantidade').value;
    if (!data || !horas || horas <= 0) {
        alert('Por favor, preencha a data e uma quantidade de horas válida.');
        return;
    }
    var horasDb = loadData('ch_horas');
    var registro = { id: 'h_' + new Date().getTime(), userId: u.id, data: data, horas: parseFloat(horas) };
    horasDb.push(registro);
    saveData('ch_horas', horasDb);
    alert('Horas registradas com sucesso!');
    renderMinhasHoras();
}

// --- Funções para "Desenhar" na Tela (Renderização) ---
function renderMinhasHoras() {
    var u = getSessionUser();
    var el = document.getElementById('listaHoras');
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

function renderVagasList(vagas, containerId, allowApply) {
    var el = document.getElementById(containerId);
    if (!vagas || vagas.length === 0) {
        el.innerHTML = '<p class="small" style="text-align: center;">Nenhuma vaga encontrada no momento.</p>';
        return;
    }
    var html = '';
    for (var i = 0; i < vagas.length; i++) {
        var v = vagas[i];
        html += '<div class="vaga"><h4>' + v.titulo + '</h4>' +
                '<p><strong>Empresa:</strong> ' + (v.empregadorNome || 'N/A') + '</p>' +
                '<p>' + v.descricao + '</p>';
        if (allowApply) {
            var u = getSessionUser();
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
    for (var i = 0; i < todasVagas.length; i++) {
        if (todasVagas[i].empregadorId === empId) {
            minhasVagas.push(todasVagas[i]);
        }
    }
    var el = document.getElementById(containerId);
    if (minhasVagas.length === 0) {
        el.innerHTML = '<div class="small">Você não publicou vagas ainda.</div>';
        return;
    }
    var users = loadData('ch_users');
    var html = '';
    for (var i = 0; i < minhasVagas.length; i++) {
        var v = minhasVagas[i];
        html += '<div class="vaga"><h4>' + v.titulo + '</h4><p class="small">Candidatos: ' + v.candidatos.length + '</p>';
        if (v.candidatos.length > 0) {
            html += '<ul>';
            for (var j = 0; j < v.candidatos.length; j++) {
                var candidatoId = v.candidatos[j];
                var candidatoNome = 'Usuário não encontrado';
                for (var k = 0; k < users.length; k++) {
                    if (users[k].id === candidatoId) {
                        candidatoNome = users[k].nome;
                        break;
                    }
                }
                html += '<li>' + candidatoNome + '</li>';
            }
            html += '</ul>';
        }
        html += '</div>';
    }
    el.innerHTML = html;
}
