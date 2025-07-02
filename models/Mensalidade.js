const mongoose = require('mongoose');

const MensalidadeSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  valor: { type: Number, required: true },
  vencimento: { type: Date, required: true },
  status: { type: String, enum: ['pago', 'pendente'], default: 'pendente' },
});

module.exports = mongoose.model('Mensalidade', MensalidadeSchema); 