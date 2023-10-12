const pool = require('../config/database');

exports.agregarUsuario = (req, res) => {
  const nuevoUsuario = req.body;
  const query = 'INSERT INTO usuarios SET ?';

  pool.execute(query, nuevoUsuario)
    .then(([result]) => {
      res.status(201).json({ mensaje: 'Usuario agregado con éxito' });
    })
    .catch((error) => {
      console.error('Error al agregar el usuario:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};

exports.validarUsuario = (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo electrónico y contraseña son requeridos' });
  }
  const query = 'SELECT id FROM usuarios WHERE correo_electronico = ? AND contrasena = ?';

  pool.execute(query, [correo_electronico, contrasena])
    .then(([results]) => {
      if (results.length === 0) {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      } else {
        const userId = results[0].id;
        res.status(200).json({ userId });
      }
    })
    .catch((error) => {
      console.error('Error al autenticar:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    });
};
