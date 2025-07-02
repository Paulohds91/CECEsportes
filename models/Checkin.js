const mongoose = require('mongoose');

const CheckinSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data_hora: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Checkin', CheckinSchema); 