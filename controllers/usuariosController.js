const pool = require('../config/index');
const jwt = require('jsonwebtoken');

const secretKey=process.env.JWT_SECRET;
exports.agregarUsuario = (req, res) => {
  const nuevoUsuario = req.body;
  const query = 'INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)';

  const values = [nuevoUsuario.nombre, nuevoUsuario.correo_electronico, nuevoUsuario.contrasena];

  pool.execute(query, values)
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
      console.log('Resultados del query:', results);
      if (results.length === 0) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      }
      
      const userId = results[0].id;
      const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ userId, token });
    })
    .catch((error) => {
      console.log('Resultados del query:', results);
      console.error('Error al autenticar:', error);
      return res.status(500).json({ mensaje: 'Error al autenticar' });
    });
};


exports.verificar = (req, res,next) => {
  const token = req.header('Authorization');
  
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    return res.status(200).json({ token });
    next();
  });
}, (req, res) => {
  res.json({ message: 'Ruta protegida' });
};



