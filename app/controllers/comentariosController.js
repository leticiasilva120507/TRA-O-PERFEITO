const comentariosModel = require('../models/comentariosModel');

const comentariosController = {
  async listarComentarios(req, res) {
    const idPublicacao = req.params.idPublicacao;
    try {
      const comentarios = await comentariosModel.buscarPorPublicacao(idPublicacao);
      res.json(comentarios);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      res.status(500).json({ erro: 'Erro ao buscar comentários' });
    }
  },

  async postarComentario(req, res) {
    const idPublicacao = req.params.idPublicacao;
    const { texto, id_usuario, id_publicacao } = req.body;

    if (!texto || !id_usuario || !id_publicacao) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    if (parseInt(idPublicacao) !== parseInt(id_publicacao)) {
      return res.status(400).json({ erro: 'ID da publicação inconsistente' });
    }

    try {
      await comentariosModel.inserir({ id_publicacao, id_usuario, texto });
      // Após inserir, já retorna a lista atualizada
      const comentariosAtualizados = await comentariosModel.buscarPorPublicacao(idPublicacao);
      res.json(comentariosAtualizados);
    } catch (error) {
      console.error('Erro ao inserir comentário:', error);
      res.status(500).json({ erro: 'Erro ao inserir comentário' });
    }
  }
};

module.exports = comentariosController;
