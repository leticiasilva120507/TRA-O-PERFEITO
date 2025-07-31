// Rotas para comentários de publicações
const express = require('express');
const router = express.Router();
const comentariosController = require('../controllers/comentariosController');

router.get('/:idPublicacao', comentariosController.listarComentarios);
router.post('/:idPublicacao', comentariosController.postarComentario);

module.exports = router;
