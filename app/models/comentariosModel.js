const pool = require('../../config/pool_conexoes');


const comentariosModel = {
  criarComentario: async(dadosForm)=>{
    try{
      const [result] = await pool.query('INSERT INTO COMENTARIOS SET ?', [dadosForm])
      console.log(result);
      return result.insertId;
    }catch(error){
      console.log('Erro ao salvar comentario:', error);
      return null;
    }
  },


listarComentarios: async (idPublicacao) => {
  try {
   const [resultado] = await pool.query(`
  SELECT 
    c.ID_COMENTARIO, 
    c.ID_USUARIO, 
    c.ID_PUBLICACAO,
    c.CONTEUDO_COMENTARIO,
    c.DATA_COMENTARIO,
    u.NOME_USUARIO AS NOME
  FROM COMENTARIOS c
  LEFT JOIN USUARIOS u ON c.ID_USUARIO = u.ID_USUARIO
  WHERE c.ID_PUBLICACAO = ? AND u.STATUS_USUARIO = 'ativo'
  ORDER BY c.DATA_COMENTARIO DESC
`, [idPublicacao]);
    console.log("Comentários encontrados:", resultado);
    return resultado;

  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    return null;
  }
}


};

module.exports = comentariosModel;
