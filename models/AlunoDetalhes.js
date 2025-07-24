const mongoose = require('mongoose');

const AlunoDetalhesSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plano: { type: mongoose.Schema.Types.ObjectId, ref: 'Plano', required: true },
  data_inicio: { type: Date, default: Date.now },
  // Novos campos do formulário
  data_nascimento: { type: Date },
  instituicao: { type: String },
  serie_turma: { type: String },
  periodo_integral: { type: Boolean, default: false },
  modalidade: [{ type: String }], // agora é array
  mae_nome: { type: String },
  mae_cpf: { type: String },
  mae_telefone: { type: String },
  mae_email: { type: String },
  pai_nome: { type: String },
  pai_cpf: { type: String },
  pai_telefone: { type: String },
  pai_email: { type: String },
  endereco: { type: String },
  cep_cidade: { type: String },
  observacoes: { type: String },
  ciente_contrato: { type: Boolean, default: false }
});

module.exports = mongoose.model('AlunoDetalhes', AlunoDetalhesSchema); 
