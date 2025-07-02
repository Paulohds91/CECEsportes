const mongoose = require('mongoose');

const AlunoDetalhesSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plano: { type: mongoose.Schema.Types.ObjectId, ref: 'Plano', required: true },
  data_inicio: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AlunoDetalhes', AlunoDetalhesSchema); 