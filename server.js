const express = require('express');
const app = express();
const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const tareasRoutes = require('./routes/tareasRoutes');
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/tareas', tareasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
