const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(bodyParser.json());

const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const tareasRoutes = require('./routes/tareasRoutes');



app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/tareas', tareasRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
