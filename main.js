// main.js — lógica principal do ConectaHoras
var vagas = [
  { titulo: 'Desenvolvedor Front-End Jr.', empresa: 'Tech Inova', descricao: 'Trabalhar com HTML, CSS e JavaScript.' },
  { titulo: 'Designer Gráfico', empresa: 'Agência Criativa', descricao: 'Criar artes para mídias sociais.' }
];

function entrar(tipoUsuario) {
  var nome = document.getElementById('nomeUsuario').value;
  if (nome.trim() === '') {
    alert('Por favor, digite seu nome!');
    return;
  }
  localStorage.setItem('nomeUsuario', nome);
  localStorage.setItem('tipoUsuario', tipoUsuario);

  if (tipoUsuario === 'funcionario') window.location.href = 'funcionario.html';
  else window.location.href = 'empregador.html';
}

function mostrarBoasVindas() {
  var nome = localStorage.getItem('nomeUsuario');
  if (!nome) {
    alert('Acesso negado. Faça login primeiro.');
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('bemvindo').innerHTML = 'Olá, <strong>' + nome + '</strong>!';
}

function sair() {
  localStorage.clear();
  window.location.href = 'index.html';
}

function adicionarHora() {
  var horas = document.getElementById('horas');
  var atual = parseInt(horas.innerText);
  horas.innerText = atual + 1;
}

function renderVagasList(containerId) {
  var el = document.getElementById(containerId);
  var html = '';
  vagas.forEach(v => {
    html += '<div class="vaga">';
    html += '<h4>' + v.titulo + '</h4>';
    html += '<p><strong>Empresa:</strong> ' + v.empresa + '</p>';
    html += '<p>' + v.descricao + '</p>';
    html += '<button class="btn" onclick="candidatarSe(\'' + v.titulo + '\')">Candidatar-se</button>';
    html += '</div>';
  });
  el.innerHTML = html;
}

function candidatarSe(titulo) {
  var nome = localStorage.getItem('nomeUsuario') || 'Usuário';
  alert(nome + ', sua candidatura para a vaga "' + titulo + '" foi enviada com sucesso!');
}

var vagasEmpregador = [];

function cadastrarVaga() {
  var titulo = document.getElementById('tituloVaga').value;
  var empresa = document.getElementById('empresaVaga').value;
  var desc = document.getElementById('descricaoVaga').value;

  if (!titulo || !empresa || !desc) {
    alert('Preencha todos os campos!');
    return;
  }
  vagasEmpregador.push({ titulo, empresa, descricao: desc });
  renderVagasEmpregador('listaVagasEmpregador');
  document.getElementById('tituloVaga').value = '';
  document.getElementById('empresaVaga').value = '';
  document.getElementById('descricaoVaga').value = '';
}

function renderVagasEmpregador(containerId) {
  var el = document.getElementById(containerId);
  var html = '';
  vagasEmpregador.forEach(v => {
    html += '<div class="vaga">';
    html += '<h4>' + v.titulo + '</h4>';
    html += '<p><strong>Empresa:</strong> ' + v.empresa + '</p>';
    html += '<p>' + v.descricao + '</p>';
    html += '</div>';
  });
  el.innerHTML = html;
}
