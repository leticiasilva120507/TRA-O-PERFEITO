const comentariosModel = require('../models/comentariosModel');

const comentariosController = {
  async listarPorPublicacao(req, res) {
    try {
      const { idPublicacao } = req.params;
      const comentarios = await comentariosModel.buscarPorPublicacao(idPublicacao);
      res.json(comentarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar comentários' });
    }
  },

  async adicionarComentario(req, res) {
    try {
      const { id_publicacao, id_usuario, texto } = req.body;
      await comentariosModel.inserir({ id_publicacao, id_usuario, texto });

      // Após inserir, retorna lista atualizada
      const comentarios = await comentariosModel.buscarPorPublicacao(id_publicacao);
      res.json(comentarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao inserir comentário' });
    }
  }
};

module.exports = comentariosController;
