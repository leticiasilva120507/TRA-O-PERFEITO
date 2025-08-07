const comentariosModel = require("../models/comentariosModel");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
const { regrasValidacaoCadastro } = require("./usuariosController");


const comentariosController = {

  regrasValidacaoComentario:[
    body('conteudo')
    .trim()
    .isLength({min: 1, max: 2000})
    .withMessage('O comentário deve ter no mínimo 1 caractere e no máximo 2000')
  ],


  criarComentario: async (req, res) =>{
    try{

      console.log("Chegou no criarComentario");
      console.log('Body:', req.body);

      const erros = validationResult(req);
      if(!erros.isEmpty()){
        console.log("Deu erro na validação af");
        return res.status(400).json({erros:erros});
      }

      const { conteudo, idPublicacao } = req.body;
      const idUsuario = req.session.autenticado.id;

     

      const resultado = await comentariosModel.criarComentario({
        ID_USUARIO: idUsuario,
        ID_PUBLICACAO: idPublicacao,
        CONTEUDO_COMENTARIO: conteudo,
        DATA_COMENTARIO: new Date()
      });
      console.log(resultado)

      if (!resultado){
        return res.status(500).json({erro: "Erro ao salvar comentario"})
      }


      return res.render('pages/publicacao/:id',{
        listaErros:null,
        dadosNotificacao:{
          titulo: 'Comentário enviado!',
          mensagem: "Seu comtário foi salvo",
          tipo: "success"
        }
      });

    } catch(erro){
      console.error("Erro ao criar comentario:", erro);
      return res.render('pages/publicacao/:id',{
        listaErros:erros,
        dadosNotificacao:{
          titulo: 'feu erro',
          mensagem: "Seu comtário  n foi salvo",
          tipo: "error"
        }
      });

    }
  }
};

module.exports = comentariosController;
