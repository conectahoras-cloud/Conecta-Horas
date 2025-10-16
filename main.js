/* main.js - Lógica SUPER SIMPLIFICADA, 100% fiel aos PDFs */

// Variável global para guardar o nome do usuário logado [Conceito dos PDFs]
var nomeUsuarioLogado = null;

// As vagas agora são "fictícias" e ficam aqui.
var vagas = [
    { titulo: 'Desenvolvedor Front-End Jr.', empresa: 'Tech Inova', descricao: 'Trabalhar com HTML, CSS e JavaScript.' },
    { titulo: 'Designer Gráfico', empresa: 'Agência Criativa', descricao: 'Criar artes para mídias sociais.' }
];

// --- FUNÇÕES PRINCIPAIS DO SITE ---

// Função chamada pelo botão "Entrar" na página inicial.
function entrar() {
    var nomeInput = document.getElementById('nomeUsuario');
    var nomeDigitado = nomeInput.value;

    if (nomeDigitado === '') {
        alert('Por favor, digite seu nome!');
        return;
    }

    // Guarda o nome na nossa variável global
    nomeUsuarioLogado = nomeDigitado;
    // Redireciona para a página do funcionário
    window.location.href = 'funcionario.html';
}

// Função para sair (logout).
function sair() {
    nomeUsuarioLogado = null; // Limpa a variável
    alert('Você saiu.');
    window.location.href = 'index.html';
}

// Função para mostrar a mensagem de boas-vindas.
function mostrarBoasVindas() {
    // Para esta função funcionar na outra página, precisamos de um truque.
    // Vamos passar o nome pela URL.
    var urlParams = new URLSearchParams(window.location.search);
    var nome = urlParams.get('nome');
    
    var el = document.getElementById('bemvindo');
    
    if (!nome) {
        // Se não tiver nome, protege a página.
        alert('Acesso negado. Por favor, entre com seu nome.');
        window.location.href = 'index.html';
        return;
    }
    
    el.innerHTML = 'Olá, <strong>' + nome + '</strong>! Bem-vindo(a) à sua área.';
}

// Função para "desenhar" a lista de vagas na tela.
function renderVagasList(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    var html = '';
    for (var i = 0; i < vagas.length; i++) {
        var v = vagas[i];
        html += '<div class="vaga">';
        html += '<h4>' + v.titulo + '</h4>';
        html += '<p><strong>Empresa:</strong> ' + v.empresa + '</p>';
        html += '<p>' + v.descricao + '</p>';
        html += '<button class="btn" onclick="candidatarSe(\'' + v.titulo + '\')">Candidatar-se</button>';
        html += '</div>';
    }
    el.innerHTML = html;
}

// Função chamada pelo botão "Candidatar-se".
function candidatarSe(tituloVaga) {
    // Como a variável global se perde ao mudar de página, pegamos o nome da URL de novo.
    var urlParams = new URLSearchParams(window.location.search);
    var nome = urlParams.get('nome');
    
    alert(nome + ', sua candidatura para a vaga "' + tituloVaga + '" foi enviada com sucesso!');
}
