const mongoose = require('mongoose');

const TreinoSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  descricao: { type: String, required: true },
  data: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Treino', TreinoSchema); 