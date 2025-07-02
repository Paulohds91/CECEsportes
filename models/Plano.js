const mongoose = require('mongoose');

const PlanoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  duracao: { type: String, required: true },
});

module.exports = mongoose.model('Plano', PlanoSchema); 