const db = require('../config/database');

exports.obtenerCategorias = (req, res) => {
  const idUsuario = req.params.id_usuario;

  const query = 'SELECT * FROM categorias WHERE id_usuario = ?';

  db.query(query, idUsuario, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
};

exports.agregarCategoria = (req, res) => {
  const { nombre, id_usuario } = req.body;

  db.query('INSERT INTO categorias SET ?', { nombre, id_usuario }, (error, result) => {
    if (error) {
      console.error('Error al agregar la categoría:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    res.status(201).json({ mensaje: 'Categoría agregada con éxito' });
  });
};

exports.modificarCategoria = (req, res) => {
  const categoryId = req.params.id;
  const sql = 'UPDATE categorias SET nombre = ? WHERE id = ?';
  db.query(sql, [req.body.nombre, categoryId], (err, result) => {
    if (err) {
      console.error('Error al actualizar la categoría:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    console.log('Categoría actualizada con éxito');
    res.json({ mensaje: 'Categoría actualizada con éxito' });
  });
};

exports.eliminarCategoria = (req, res) => {
  const categoriaId = req.params.id;
  const deleteTasksQuery = 'DELETE FROM tareas WHERE id_categoria = ?';
  db.query(deleteTasksQuery, [categoriaId], (error, results) => {
    if (error) {
      console.error('Error al eliminar las tareas:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
    const deleteCategoryQuery = 'DELETE FROM categorias WHERE id = ?';
    db.query(deleteCategoryQuery, [categoriaId], (error, results) => {
      if (error) {
        console.error('Error al eliminar la categoría:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      res.status(204).send();
    });
  });
};
