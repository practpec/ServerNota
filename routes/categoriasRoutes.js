const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Definir rutas para categorías
router.get('/mostrarcat/:id_usuario', categoriasController.obtenerCategorias);
router.post('/categorias', categoriasController.agregarCategoria);
router.put('/categorias/:id', categoriasController.modificarCategoria);
router.delete('/categorias/:id', categoriasController.eliminarCategoria);

module.exports = router;

