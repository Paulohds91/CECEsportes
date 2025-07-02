const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const alunoRoutes = require('./routes/aluno');
const gestorRoutes = require('./routes/gestor');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/aluno', alunoRoutes);
app.use('/gestor', gestorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔗 Backend rodando na porta ${PORT}`)); 