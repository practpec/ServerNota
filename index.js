const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});
/*---------Agregar Usuario--------------*/
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;

  db.query('INSERT INTO usuarios SET ?', nuevoUsuario, (error, result) => {
    if (error) {
      console.error('Error al agregar el usuario:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    res.status(201).json({ mensaje: 'Usuario agregado con éxito' });
  });
});
/*-----------------------Validar Usuarios-----------------------*/
app.post('/autenticacion', (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos' });
  }
  db.query('SELECT id FROM usuarios WHERE correo_electronico = ? AND contrasena = ?', [correo_electronico, contrasena], (err, results) => {
    if (err) {
      console.error('Error al autenticar:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    const userId = results[0].id;
    res.status(200).json({ userId });
  });
});
/*-----------Ver Categorias----------------------------*/
app.get('/mostrarcat/:id_usuario', (req, res) => {
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
});
/*---------Agregar Categoria--------------*/
app.post('/categorias', (req, res) => {
  const { nombre, id_usuario } = req.body;

  db.query('INSERT INTO categorias SET ?', { nombre, id_usuario }, (error, result) => {
    if (error) {
      console.error('Error al agregar la categoría:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    res.status(201).json({ mensaje: 'Categoría agregada con éxito' });
  });
});
/*--------------------Modificar Categoria-----------------------*/
app.put('/categorias/:id', (req, res) => {
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
});
/*-----Eliminar Categoria y Tareas asociadas-------*/
app.delete('/categorias/:id', (req, res) => {
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
});
/*-----------------------------Agregar Tarea-----------------------------------------*/
app.post('/tareas', (req, res) => {
  const tareaData = req.body;

  db.query('INSERT INTO tareas SET ?', tareaData, (error, result) => {
    if (error) {
      console.error('Error al crear la tarea:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    console.log('Tarea creada con éxito');
    res.status(201).json({ mensaje: 'Tarea creada con éxito', tareaId: result.insertId });
  });
});
/*-------------------Modificar Tarea----------------------------------*/
app.put('/tareas/:id', (req, res) => {
  const tareaId = req.params.id;
  const { titulo, descripcion, fecha_vencimiento, id_categoria, estado } = req.body;

  const camposActualizados = { titulo, descripcion, fecha_vencimiento, id_categoria, estado };

  const query = 'UPDATE tareas SET ? WHERE id = ?';
  db.query(query, [camposActualizados, tareaId], (error, result) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json({ mensaje: 'Tarea actualizada con éxito' });
  });
});
/*--------------------Cambiar Status_Tarea---------------------*/
app.put('/tareas/cambiar-estado/:id', (req, res) => {
  const tareaId = req.params.id;

  db.query('UPDATE tareas SET estado = CASE WHEN estado = "pendiente" THEN "completada" ELSE "pendiente" END WHERE id = ?', tareaId, (error, result) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json({ mensaje: 'Estado de la tarea actualizado con éxito'});
  });
});
/*-------------Eliminar Tarea--------------------------*/
app.delete('/tareas/:id', (req, res) => {
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
});
/*--------------Mostrar Tareas--------------------------------*/
app.get('/tareas/:id_usuario', (req, res) => {
  const idUsuario = req.params.id_usuario;

  const query = 'SELECT t.id, t.titulo, t.descripcion, t.fecha_creacion, t.fecha_vencimiento, t.estado, ' +
                '(SELECT nombre FROM categorias c WHERE c.id = t.id_categoria) AS categoria ' +
                'FROM tareas t ' +
                'WHERE t.id_usuario = ?';

  db.query(query, idUsuario, (error, results) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    res.status(results.length > 0 ? 200 : 404).json(results);
  });
});
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});