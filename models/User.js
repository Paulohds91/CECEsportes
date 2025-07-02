const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ['aluno', 'instrutor', 'gestor'], required: true },
  telefone: { type: String },
  data_nascimento: { type: String },
  cpf: { type: String, sparse: true, default: null },
});

module.exports = mongoose.model('User', UserSchema); 