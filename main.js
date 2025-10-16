/* main.js — versão simples com localStorage para salvar banco de horas */

// Variável global para guardar o nome
var nomeUsuarioLogado = null;

// Entrar
function entrar() {
  var nome = document.getElementById('nomeUsuario').value;
  if (nome === '') {
    alert('Digite seu nome!');
    return;
  }
  nomeUsuarioLogado = nome;
  window.location.href = 'funcionario.html?nome=' + nome;
}

// Mostrar mensagem e horas
function mostrarBoasVindas() {
  var params = new URLSearchParams(window.location.search);
  var nome = params.get('nome');
  if (!nome) {
    alert('Acesso negado. Volte à página inicial.');
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('bemvindo').innerHTML = 'Olá, <strong>' + nome + '</strong>!';

  var horas = localStorage.getItem('bancoDeHoras') || 0;
  document.getElementById('bancoHoras').innerText = horas + ' horas registradas.';
}

// Adicionar hora
function adicionarHora() {
  var horas = parseInt(localStorage.getItem('bancoDeHoras') || 0);
  horas++;
  localStorage.setItem('bancoDeHoras', horas);
  document.getElementById('bancoHoras').innerText = horas + ' horas registradas.';
}

// Zerar horas
function zerarHoras() {
  localStorage.setItem('bancoDeHoras', 0);
  document.getElementById('bancoHoras').innerText = '0 horas registradas.';
}

// Sair
function sair() {
  alert('Você saiu.');
  window.location.href = 'index.html';
}
