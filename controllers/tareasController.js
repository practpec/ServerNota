const db = require('../config/database');

exports.mostrarTareas = (req, res) => {
  const idUsuario = req.params.id_usuario;

  const query = 'SELECT t.id, t.titulo, t.descripcion, t.fecha_creacion, t.fecha_vencimiento, t.estado, ' +
                '(SELECT nombre FROM categorias c WHERE c.id = t.id_categoria) AS categoria ' +
                'FROM tareas t ' +
                'WHERE t.id_usuario = ?';

  db.query(query, idUsuario, (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.status(results.length > 0 ? 200 : 404).json(results);
  });
};

exports.agregarTarea = (req, res) => {
  const tareaData = req.body;

  db.query('INSERT INTO tareas SET ?', tareaData, (error, result) => {
    if (error) {
      console.error('Error al crear la tarea:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    console.log('Tarea creada con éxito');
    res.status(201).json({ mensaje: 'Tarea creada con éxito', tareaId: result.insertId });
  });
};

exports.modificarTarea = (req, res) => {
  const tareaId = req.params.id;
  const { titulo, descripcion, fecha_vencimiento, id_categoria, estado } = req.body;

  const camposActualizados = { titulo, descripcion, fecha_vencimiento, id_categoria, estado };

  const query = 'UPDATE tareas SET ? WHERE id = ?';
  db.query(query, [camposActualizados, tareaId], (error, result) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json({ mensaje: 'Tarea actualizada con éxito' });
  });
};

exports.cambiarEstadoTarea = (req, res) => {
  const tareaId = req.params.id;

  db.query('UPDATE tareas SET estado = CASE WHEN estado = "pendiente" THEN "completada" ELSE "pendiente" END WHERE id = ?', tareaId, (error, result) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json({ mensaje: 'Estado de la tarea actualizado con éxito'});
  });
};

exports.eliminarTarea = (req, res) => {
  const tareaId = req.params.id;
  db.query('DELETE FROM tareas WHERE id = ?', tareaId, (error, result) => {
    if (error) {
      console.error('Error al eliminar la tarea:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    res.status(204).send();
  });
};
