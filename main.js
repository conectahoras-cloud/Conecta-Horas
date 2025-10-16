// Salva e mostra apenas o nome do usuário

function cadastrar(tipo) {
  const nome = document.getElementById('nomeUsuario').value.trim();

  if (nome === '') {
    alert('Digite seu nome!');
    return;
  }

  localStorage.setItem('nomeUsuario', nome);
  localStorage.setItem('tipoUsuario', tipo);

  if (tipo === 'funcionario') {
    window.location.href = 'funcionario.html';
  } else {
    window.location.href = 'empresa.html';
  }
}

function entrar(tipo) {
  const nome = document.getElementById('nomeUsuario').value.trim();

  if (nome === '') {
    alert('Digite seu nome!');
    return;
  }

  localStorage.setItem('nomeUsuario', nome);
  localStorage.setItem('tipoUsuario', tipo);

  if (tipo === 'funcionario') {
    window.location.href = 'funcionario.html';
  } else {
    window.location.href = 'empresa.html';
  }
}

function mostrarBoasVindas() {
  const nome = localStorage.getItem('nomeUsuario');
  const tipo = localStorage.getItem('tipoUsuario');

  if (!nome || !tipo) {
    alert('Acesso negado! Volte à página de login.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('bemvindo').innerHTML = `Olá, <strong>${nome}</strong>!`;
}

function sair() {
  localStorage.removeItem('nomeUsuario');
  localStorage.removeItem('tipoUsuario');
  window.location.href = 'index.html';
}
