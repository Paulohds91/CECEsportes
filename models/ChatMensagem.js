const mongoose = require('mongoose');

const ChatMensagemSchema = new mongoose.Schema({
  remetente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mensagem: { type: String, required: true },
  data_hora: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMensagem', ChatMensagemSchema); 