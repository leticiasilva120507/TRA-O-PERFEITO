// Rotas básicas para chat
const express = require('express');
const router = express.Router();

// Simulação de armazenamento em memória (troque por banco depois)
let mensagens = [
  // { de: 'Maria Eduarda', para: 'Você', texto: 'Olá, tudo bem?' }
];

// Buscar mensagens entre dois usuários
router.get('/mensagens', (req, res) => {
  const { usuario1, usuario2 } = req.query;
  const filtradas = mensagens.filter(m =>
    (m.de === usuario1 && m.para === usuario2) ||
    (m.de === usuario2 && m.para === usuario1)
  );
  res.json(filtradas);
});

// Enviar mensagem
router.post('/mensagens', (req, res) => {
  const { de, para, texto } = req.body;
  if (!de || !para || !texto) return res.status(400).json({ erro: 'Dados incompletos' });
  const nova = { de, para, texto };
  mensagens.push(nova);
  res.json(nova);
});

module.exports = router;
