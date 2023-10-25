const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Definir rutas para usuarios
router.post('/usuarios', usuariosController.agregarUsuario);
router.post('/autenticacion', usuariosController.validarUsuario);
router.get('/verificacion', usuariosController.verificar);

module.exports = router;
