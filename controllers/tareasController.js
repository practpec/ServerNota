const pool = require('../config/index');

exports.mostrarTareas = (req, res) => {
  const idUsuario = req.params.id_usuario;
  const query = `SELECT t.id, t.titulo, t.descripcion, t.fecha_creacion, t.fecha_vencimiento, t.estado, 
                (SELECT nombre FROM categorias c WHERE c.id = t.id_categoria) AS categoria
                FROM tareas t 
                WHERE t.id_usuario = ?`;

  pool.execute(query, [idUsuario])
    .then(([results]) => {
      res.status(results.length > 0 ? 200 : 404).json(results);
    })
    .catch((error) => {
      console.error('Error en la consulta:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};

exports.agregarTarea = (req, res) => {
  const tareaData = req.body;
  const query = 'INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, estado, id_usuario, id_categoria) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [
    tareaData.titulo,
    tareaData.descripcion,
    tareaData.fecha_vencimiento,
    tareaData.estado,
    tareaData.id_usuario,
    tareaData.id_categoria
  ];

  pool.execute(query, values)
    .then(([result]) => {
      console.log('Tarea creada con éxito');
      res.status(201).json({ mensaje: 'Tarea creada con éxito', tareaId: result.insertId });
    })
    .catch((error) => {
      console.error('Error al crear la tarea:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};

exports.modificarTarea = (req, res) => {
  const tareaId = req.params.id;
  const { titulo, descripcion, fecha_vencimiento, id_categoria, estado } = req.body;

  const query = 'UPDATE tareas SET titulo = ?, descripcion = ?, fecha_vencimiento = ?, id_categoria = ?, estado = ? WHERE id = ?';

  const values = [titulo, descripcion, fecha_vencimiento, id_categoria, estado, tareaId];

  pool.execute(query, values)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).json({ mensaje: 'Tarea no encontrada' });
      } else {
        res.status(200).json({ mensaje: 'Tarea actualizada con éxito' });
      }
    })
    .catch((error) => {
      console.error('Error al actualizar la tarea:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};


exports.cambiarEstadoTarea = (req, res) => {
  const tareaId = req.params.id;
  const query = 'UPDATE tareas SET estado = CASE WHEN estado = "pendiente" THEN "completada" ELSE "pendiente" END WHERE id = ?';

  pool.execute(query, [tareaId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).json({ mensaje: 'Tarea no encontrada' });
      } else {
        res.status(200).json({ mensaje: 'Estado de la tarea actualizado con éxito' });
      }
    })
    .catch((error) => {
      console.error('Error al cambiar el estado de la tarea:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};

exports.eliminarTarea = (req, res) => {
  const tareaId = req.params.id;
  const deleteQuery = 'DELETE FROM tareas WHERE id = ?';

  pool.execute(deleteQuery, [tareaId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).json({ mensaje: 'Tarea no encontrada' });
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.error('Error al eliminar la tarea:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};
