// main.js — Lógica principal do ConectaHoras
var vagas = [
  { titulo: 'Desenvolvedor Front-End Jr.', empresa: 'Tech Inova', descricao: 'Trabalhar com HTML, CSS e JavaScript.' },
  { titulo: 'Designer Gráfico', empresa: 'Agência Criativa', descricao: 'Criar artes para mídias sociais.' }
];

function entrar(tipo) {
  var nome = document.getElementById('nomeUsuario').value;
  if (nome === '') {
    alert('Por favor, digite seu nome!');
    return;
  }
  localStorage.setItem('nomeUsuario', nome);
  localStorage.setItem('tipoUsuario', tipo);
  if (tipo === 'funcionario') {
    window.location.href = 'funcionario.html';
  } else {
    window.location.href = 'empregador.html';
  }
}

function sair() {
  localStorage.clear();
  window.location.href = 'index.html';
}

function iniciarFuncionario() {
  var nome = localStorage.getItem('nomeUsuario');
  if (!nome) {
    alert('Por favor, faça login primeiro!');
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('bemvindo').innerHTML = 'Olá, ' + nome + '!';
  renderVagas('listaVagas');
}

function iniciarEmpregador() {
  var nome = localStorage.getItem('nomeUsuario');
  if (!nome) {
    alert('Por favor, faça login primeiro!');
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('bemvindo').innerHTML = 'Bem-vindo(a), ' + nome + '!';
  renderVagasEmpregador();
}

function registrarHora() {
  var el = document.getElementById('horas');
  var atual = parseInt(el.textContent);
  el.textContent = atual + 1;
}

function renderVagas(containerId) {
  var el = document.getElementById(containerId);
  var html = '';
  for (var i = 0; i < vagas.length; i++) {
    var v = vagas[i];
    html += '<div class="vaga">';
    html += '<h3>' + v.titulo + '</h3>';
    html += '<p><strong>Empresa:</strong> ' + v.empresa + '</p>';
    html += '<p>' + v.descricao + '</p>';
    html += '<button class="btn" onclick="alert(\'Candidatura enviada!\')">Candidatar-se</button>';
    html += '</div>';
  }
  el.innerHTML = html;
}

function cadastrarVaga() {
  var titulo = document.getElementById('tituloVaga').value;
  var empresa = document.getElementById('empresaVaga').value;
  var descricao = document.getElementById('descricaoVaga').value;
  if (titulo === '' || empresa === '' || descricao === '') {
    alert('Preencha todos os campos!');
    return;
  }
  vagas.push({ titulo: titulo, empresa: empresa, descricao: descricao });
  renderVagasEmpregador();
  document.getElementById('tituloVaga').value = '';
  document.getElementById('empresaVaga').value = '';
  document.getElementById('descricaoVaga').value = '';
}

function renderVagasEmpregador() {
  var el = document.getElementById('listaVagasEmpregador');
  var html = '';
  for (var i = 0; i < vagas.length; i++) {
    var v = vagas[i];
    html += '<div class="vaga">';
    html += '<h3>' + v.titulo + '</h3>';
    html += '<p><strong>Empresa:</strong> ' + v.empresa + '</p>';
    html += '<p>' + v.descricao + '</p>';
    html += '</div>';
  }
  el.innerHTML = html;
}
