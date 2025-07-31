// Rotas para comentários de publicações
const express = require('express');
const router = express.Router();
const comentariosModel = require('../models/comentariosModel');

// Buscar comentários de uma publicação
router.get('/:idPublicacao', async (req, res) => {
  const idPublicacao = req.params.idPublicacao;
  console.log('GET comentarios para idPublicacao:', idPublicacao);
  const comentarios = await comentariosModel.buscarPorPublicacao(idPublicacao);
  console.log('Comentários retornados no GET:', comentarios);
  res.json(comentarios);
});

// Adicionar novo comentário
router.post('/:idPublicacao', async (req, res) => {
  const idPublicacao = req.params.idPublicacao;
  const { texto, id_usuario } = req.body;
  console.log('Tentando inserir comentário:', { id_publicacao: idPublicacao, id_usuario, texto });
  if (!texto || !id_usuario) return res.status(400).json({ erro: 'Dados incompletos' });
  try {
    const result = await comentariosModel.inserir({ id_publicacao: idPublicacao, id_usuario, texto });
    console.log('Resultado do insert:', result);
  } catch (err) {
    console.error('Erro ao inserir comentário:', err);
  }
  // Após inserir, retorna a lista atualizada de comentários
  const comentarios = await comentariosModel.buscarPorPublicacao(idPublicacao);
  console.log('Comentários retornados após inserir:', comentarios);
  res.json(comentarios);
});

module.exports = router;
