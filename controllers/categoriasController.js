const pool = require('../config/database');

exports.obtenerCategorias = (req, res) => {
  const idUsuario = req.params.id_usuario;
  const query = 'SELECT * FROM categorias WHERE id_usuario = ?';

  pool.execute(query, [idUsuario])
    .then(([results]) => {
      res.json(results);
    })
    .catch((error) => {
      console.error('Error en la consulta:', error);
      res.status(500).send('Error en el servidor');
    });
};

exports.agregarCategoria = (req, res) => {
  const { nombre, id_usuario } = req.body;
  const query = 'INSERT INTO categorias (nombre, id_usuario) VALUES (?, ?)';

  pool.execute(query, [nombre, id_usuario])
    .then(() => {
      res.status(201).json({ mensaje: 'Categoría agregada con éxito' });
    })
    .catch((error) => {
      console.error('Error al agregar la categoría:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};

exports.modificarCategoria = (req, res) => {
  const categoryId = req.params.id;
  const nombre = req.body.nombre;
  const query = 'UPDATE categorias SET nombre = ? WHERE id = ?';

  pool.execute(query, [nombre, categoryId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).json({ mensaje: 'Categoría no encontrada' });
      } else {
        console.log('Categoría actualizada con éxito');
        res.json({ mensaje: 'Categoría actualizada con éxito' });
      }
    })
    .catch((error) => {
      console.error('Error al actualizar la categoría:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};

exports.eliminarCategoria = (req, res) => {
  const categoriaId = req.params.id;
  const deleteTasksQuery = 'DELETE FROM tareas WHERE id_categoria = ?';
  const deleteCategoryQuery = 'DELETE FROM categorias WHERE id = ?';

  pool.execute(deleteTasksQuery, [categoriaId])
    .then(() => {
      return pool.execute(deleteCategoryQuery, [categoriaId]);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.error('Error al eliminar la categoría:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    });
};
