const pool = require('../../config/pool_conexoes');

const comentariosModel = {
  async buscarPorPublicacao(idPublicacao) {
    const [rows] = await pool.query(
      `SELECT c.ID_COMENTARIO, c.ID_USUARIO, u.NOME_USUARIO, c.CONTEUDO_COMENTARIO, c.DATA_COMENTARIO, u.FOTO_PERFIL_PASTA_USUARIO
       FROM COMENTARIOS c
       LEFT JOIN USUARIOS u ON u.ID_USUARIO = c.ID_USUARIO
       WHERE c.ID_PUBLICACAO = ?
       ORDER BY c.DATA_COMENTARIO DESC`,
      [idPublicacao]
    );
    return rows;
  },

  async inserir({ id_publicacao, id_usuario, texto }) {
    const [result] = await pool.query(
      `INSERT INTO COMENTARIOS (ID_PUBLICACAO, ID_USUARIO, CONTEUDO_COMENTARIO, DATA_COMENTARIO)
       VALUES (?, ?, ?, NOW())`,
      [id_publicacao, id_usuario, texto]
    );
    return result.insertId;
  }
};

module.exports = comentariosModel;
