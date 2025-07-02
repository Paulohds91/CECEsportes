const jwt = require('jsonwebtoken');
const SECRET = 'castros_secret'; // Em produção, use variável de ambiente

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido.' });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido.' });
    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    next();
  });
}; 