const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');

// Definir rutas para tareas
router.get('/tareas/:id_usuario', tareasController.mostrarTareas);
router.post('/tareas', tareasController.agregarTarea);
router.put('/tareas/:id', tareasController.modificarTarea);
router.put('/tareas/cambiar-estado/:id', tareasController.cambiarEstadoTarea);
router.delete('/tareas/:id', tareasController.eliminarTarea);

module.exports = router;
