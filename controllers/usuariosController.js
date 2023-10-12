const db = require('../config/database');

exports.agregarUsuario = (req, res) => {
  const nuevoUsuario = req.body;

  db.query('INSERT INTO usuarios SET ?', nuevoUsuario, (error, result) => {
    if (error) {
      console.error('Error al agregar el usuario:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    res.status(201).json({ mensaje: 'Usuario agregado con éxito' });
  });
};

exports.validarUsuario = (req, res) => {
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
};
