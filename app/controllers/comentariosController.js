const comentariosModel = require("../models/comentariosModel");
const listagensModel = require("../models/listagensModel");
const { body, validationResult } = require("express-validator");
const moment = require("moment");



const comentariosController = {

  regrasValidacaoComentario:[
    body('conteudo')
    .trim()
    .isLength({min: 1, max: 2000})
    .withMessage('O comentário deve ter no mínimo 1 caractere e no máximo 2000')
  ],


  criarComentario: async (req, res) => {
  try {
    console.log("Chegou no criarComentario");
    console.log('Body:', req.body);

    const erros = validationResult(req);
    const { conteudo, idPublicacao } = req.body;
    const idUsuario = req.session.autenticado.id;

    const publicacao = await listagensModel.findIdPublicacao(idPublicacao);
    const comentarios = await comentariosModel.listarComentarios(idPublicacao);

    if (!erros.isEmpty()) {
      return res.render('pages/publicacao', {
        listaErros: erros,
        dadosNotificacao: {
          titulo: 'Erro ao enviar comentário',
          mensagem: 'O comentário deve ter no mínimo 1 caractere e no máximo 2000',
          tipo: 'error'
        },
        publicacao,
        comentarios // ✅ ADICIONADO
      });
    }

    const resultado = await comentariosModel.criarComentario({
      ID_USUARIO: idUsuario,
      ID_PUBLICACAO: idPublicacao,
      CONTEUDO_COMENTARIO: conteudo,
      DATA_COMENTARIO: new Date()
    });

    if (!resultado) {
      return res.render('pages/publicacao', {
        listaErros: erros,
        dadosNotificacao: {
          titulo: 'Erro ao enviar comentário.',
          mensagem: 'Não foi possível salvar seu comentário.',
          tipo: 'error'
        },
        publicacao,
        comentarios // ✅ ADICIONADO
      });
    }

    // Após salvar, recarrega os comentários atualizados
    const comentariosAtualizados = await comentariosModel.listarComentarios(idPublicacao);

    return res.render('pages/publicacao', {
      listaErros: null,
      dadosNotificacao: {
        titulo: 'Comentário enviado!',
        mensagem: "Seu comentário foi salvo",
        tipo: "success"
      },
      publicacao,
      comentarios: comentariosAtualizados // ✅ ADICIONADO
    });

  } catch (erro) {
    console.error("Erro ao criar comentário:", erro);

    const { idPublicacao } = req.body;
    const publicacao = await listagensModel.findIdPublicacao(idPublicacao);
    const comentarios = await comentariosModel.listarComentarios(idPublicacao);

    return res.render('pages/publicacao', {
      listaErros: erro,
      dadosNotificacao: {
        titulo: 'Erro inesperado',
        mensagem: "Seu comentário não foi salvo.",
        tipo: "error"
      },
      publicacao,
      comentarios // ✅ ADICIONADO
    });
  }
  }
};

module.exports = comentariosController;
