// main.js — versão simples e funcional com localStorage

// Entrar (na página inicial)
function entrar() {
  const nome = document.getElementById('nomeUsuario').value.trim();
  if (nome === '') {
    alert('Digite seu nome!');
    return;
  }
  // Salva o nome na URL e vai para a página de funcionário
  window.location.href = 'funcionario.html?nome=' + encodeURIComponent(nome);
}

// Mostrar mensagem de boas-vindas
function mostrarBoasVindas() {
  const params = new URLSearchParams(window.location.search);
  const nome = params.get('nome');

  if (!nome) {
    alert('Acesso negado! Volte à página inicial.');
    window.location.href = 'index.html';
    return;
  }

  const titulo = document.getElementById('bemvindo');
  if (titulo) titulo.innerHTML = `Olá, <strong>${nome}</strong>! Bem-vindo(a) de volta.`;
}

// Atualiza o texto do banco de horas
function atualizarBancoHoras() {
  const horas = localStorage.getItem('bancoDeHoras') || 0;
  const el = document.getElementById('bancoHoras');
  if (el) el.innerText = `${horas} horas registradas.`;
}

// Adiciona uma hora ao banco
function adicionarHora() {
  let horas = parseInt(localStorage.getItem('bancoDeHoras') || 0);
  horas++;
  localStorage.setItem('bancoDeHoras', horas);
  atualizarBancoHoras();
}

// Zera o banco de horas
function zerarHoras() {
  localStorage.setItem('bancoDeHoras', 0);
  atualizarBancoHoras();
}

// Sair
function sair() {
  alert('Você saiu.');
  window.location.href = 'index.html';
}
