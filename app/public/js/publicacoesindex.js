let touchStartX = 0;
let touchEndX = 0;

function mostrarControles(section) {
  section.classList.add('ativo');
}

function esconderControles(section) {
  section.classList.remove('ativo');
}

function updateCarrossel(carrossel, novoIndice) {
  const imgs = carrossel.querySelectorAll('.publicacao-img');
  const indicadores = carrossel.querySelectorAll('.indicador');
  const container = carrossel.querySelector('.container-imgs');
  const total = imgs.length;

  novoIndice = Math.max(0, Math.min(novoIndice, total - 1));
  container.style.transform = `translateX(-${novoIndice * 100}%)`;

  indicadores.forEach((el, idx) => el.classList.toggle('ativo', idx === novoIndice));
  carrossel.dataset.idx = novoIndice;

  const setaEsq = carrossel.querySelector('.seta-carrossel.esquerda');
  const setaDir = carrossel.querySelector('.seta-carrossel.direita');

  if (setaEsq) setaEsq.classList.toggle('inativa', novoIndice === 0);
  if (setaDir) setaDir.classList.toggle('inativa', novoIndice === total - 1);

  
}


function nextImg(btn) {
  const carrossel = btn.closest('.carrossel-imagens-explorar');
  const idx = parseInt(carrossel.dataset.idx || '0');
  updateCarrossel(carrossel, idx + 1);
}

function prevImg(btn) {
  const carrossel = btn.closest('.carrossel-imagens-explorar');
  const idx = parseInt(carrossel.dataset.idx || '0');
  updateCarrossel(carrossel, idx - 1);
}

function startSwipe(e, container) {
  touchStartX = e.touches[0].clientX;
}

function swipeMove(e) {
  touchEndX = e.touches[0].clientX;
}

function endSwipe(e, container) {
  const carrossel = container.closest('.carrossel-imagens-explorar');
  const idx = parseInt(carrossel.dataset.idx || '0');

  if (touchStartX - touchEndX > 50) {
    updateCarrossel(carrossel, idx + 1);
  } else if (touchEndX - touchStartX > 50) {
    updateCarrossel(carrossel, idx - 1);
  }
}

// --- COMENTÁRIOS PUBLICAÇÃO ---
// Supondo que existe um elemento com id="comentarios-lista" para listar comentários
// e um textarea com id="ad-comentario" e botão com classe .enviar-comentario

function carregarComentarios(idPublicacao) {
  fetch(`/comentarios/${idPublicacao}`)
    .then(res => res.json())
    .then(comentarios => {
      const lista = document.getElementById('comentarios-lista');
      if (!lista) return;
      lista.innerHTML = '';
      comentarios.forEach(c => {
        lista.innerHTML += `
          <section class="comentario">
            <section class="comentario-info">
              <img src="/imagens/fotoperfil1.jpeg" class="foto-de-perfil" >
              <a href="/perfil/${c.ID_USUARIO}"><p class="nome-comentario">${c.NOME_USUARIO || 'Usuário'}</p></a>
            </section>
            <section class="escrita-comentario">
              <p>${c.CONTEUDO_COMENTARIO}</p>
            </section>
          </section>
        `;
      });
    });
}

function enviarComentario(idPublicacao, idUsuario) {
  const textarea = document.getElementById('ad-comentario');
  const texto = textarea.value.trim();
  if (!texto) return;
  fetch(`/comentarios/${idPublicacao}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto, id_usuario: idUsuario })
  })
    .then(res => res.json())
    .then(comentarios => {
      console.log('Resposta do backend ao enviar comentário:', comentarios);
      textarea.value = '';
      const lista = document.getElementById('comentarios-lista');
      if (!lista) return;
      lista.innerHTML = '';
      if (!Array.isArray(comentarios) || comentarios.length === 0) {
        lista.innerHTML = '<p style="color:red">Nenhum comentário retornado ou erro na resposta.</p>';
        return;
      }
      comentarios.forEach(c => {
        lista.innerHTML += `
          <section class="comentario">
            <section class="comentario-info">
              <img src="/imagens/fotoperfil1.jpeg" class="foto-de-perfil" >
              <a href="/perfil/${c.ID_USUARIO}"><p class="nome-comentario">${c.NOME_USUARIO || 'Usuário'}</p></a>
            </section>
            <section class="escrita-comentario">
              <p>${c.CONTEUDO_COMENTARIO}</p>
            </section>
          </section>
        `;
      });
    })
    .catch(err => {
      console.error('Erro ao enviar comentário:', err);
      const lista = document.getElementById('comentarios-lista');
      if (lista) lista.innerHTML = '<p style="color:red">Erro ao carregar comentários.</p>';
    });
}

// Exemplo de uso (adicione no onload da página de publicação):
// const idPublicacao = ...; // Pegue do backend
// const idUsuario = ...; // Pegue do backend
// const nomeUsuario = ...; // Pegue do backend
// carregarComentarios(idPublicacao);
// document.querySelector('.enviar-comentario').onclick = () => enviarComentario(idPublicacao, idUsuario, nomeUsuario);