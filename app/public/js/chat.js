function openChat(contactName) {
    document.querySelector('.chat-container-principal').classList.remove('show-chat-list');
    document.getElementById('chat-with').textContent = contactName;
    carregarMensagens(contactName);
}

function toggleChatList() {
    document.querySelector('.chat-container-principal').classList.toggle('show-chat-list');
}

// Função para buscar mensagens do backend
function carregarMensagens(destinatario) {
    const usuarioLogado = window.usuarioLogado || 'Você'; // Troque por usuário real
    fetch(`/chat/mensagens?usuario1=${encodeURIComponent(usuarioLogado)}&usuario2=${encodeURIComponent(destinatario)}`)
        .then(res => res.json())
        .then(mensagens => {
            const msgArea = document.getElementById('msg-area');
            msgArea.innerHTML = '';
            mensagens.forEach(msg => {
                if (msg.de === usuarioLogado) {
                    msgArea.innerHTML += `<section class="mensagem-env"><section class="balao-msg"><p>${msg.texto}</p></section></section>`;
                } else {
                    msgArea.innerHTML += `<section class="mensagem-rec"><img src='imagens/fotoperfil1.jpeg' class='foto-perfil-con-ant'><section class='balao-msg-rec'><p>${msg.texto}</p></section></section>`;
                }
            });
            msgArea.scrollTop = msgArea.scrollHeight;
        });
}

// Enviar mensagem
document.getElementById('enviar-msg').addEventListener('click', function() {
    const input = document.getElementById('input-msg');
    const texto = input.value.trim();
    if (!texto) return;
    const destinatario = document.getElementById('chat-with').textContent;
    const usuarioLogado = window.usuarioLogado || 'Você'; // Troque por usuário real
    fetch('/chat/mensagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ de: usuarioLogado, para: destinatario, texto })
    })
    .then(res => res.json())
    .then(() => {
        input.value = '';
        carregarMensagens(destinatario);
    });
});

// Carregar mensagens iniciais do chat padrão
window.addEventListener('DOMContentLoaded', function() {
    const contato = document.getElementById('chat-with').textContent;
    carregarMensagens(contato);
});
function toggleChatList() {
const chatContainer = document.querySelector('.chat-container-principal');
chatContainer.classList.toggle('show-chat-list'); // Alterna a classe para mostrar ou esconder
}
