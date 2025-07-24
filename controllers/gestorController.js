const db = require('../database/db');
const bcrypt = require('bcryptjs');
const Plano = require('../models/Plano');
const User = require('../models/User');
const AlunoDetalhes = require('../models/AlunoDetalhes');
const cors = require('cors');
const Mensalidade = require('../models/Mensalidade');
const Config = require('../models/Config');

exports.cadastrarAluno = async (req, res) => {
  const {
    nome, usuario, email, senha, plano_id,
    data_nascimento, instituicao, serie_turma, periodo_integral, modalidade,
    mae_nome, mae_cpf, mae_telefone, mae_email,
    pai_nome, pai_cpf, pai_telefone, pai_email,
    endereco, cep_cidade, observacoes, ciente_contrato
  } = req.body;
  if (!nome || !usuario || !email || !senha || !plano_id) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  try {
    // Verifica duplicidade
    const exists = await User.findOne({ $or: [{ usuario }, { email }] });
    if (exists) {
      return res.status(400).json({ error: 'Usuário ou e-mail já cadastrado.' });
    }
    const hash = bcrypt.hashSync(senha, 8);
    const user = new User({ nome, usuario, email, senha: hash, tipo: 'aluno' });
    await user.save();
    const detalhes = new AlunoDetalhes({
      usuario: user._id,
      plano: plano_id,
      data_nascimento,
      instituicao,
      serie_turma,
      periodo_integral,
      modalidade,
      mae_nome,
      mae_cpf,
      mae_telefone,
      mae_email,
      pai_nome,
      pai_cpf,
      pai_telefone,
      pai_email,
      endereco,
      cep_cidade,
      observacoes,
      ciente_contrato
    });
    await detalhes.save();
    res.json({ usuario_id: user._id, nome, email, plano_id });
  } catch (err) {
    console.error('Erro ao cadastrar aluno:', err);
    res.status(400).json({ error: 'Erro ao cadastrar aluno.' });
  }
};

exports.cadastrarPlano = async (req, res) => {
  const { nome, preco, duracao } = req.body;
  if (!nome || !preco || !duracao) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  try {
    const plano = new Plano({ nome, preco, duracao });
    await plano.save();
    res.json({ id: plano._id, nome, preco, duracao });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar plano.' });
  }
};

exports.getRelatorios = async (req, res) => {
  try {
    // Relatório de frequência: total de check-ins por aluno
    const alunos = await User.find({ tipo: 'aluno' });
    const relatorio = await Promise.all(alunos.map(async (aluno) => {
      return { nome: aluno.nome, total_checkins: 0 }; // Retorna 0 para total_checkins
    }));
    res.json(relatorio);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar relatório.' });
  }
};

exports.getMensalidades = async (req, res) => {
  try {
    const mensalidades = await Mensalidade.find().populate('aluno', 'nome');
    const result = mensalidades.map(m => ({
      id: m._id,
      nome: m.aluno ? m.aluno.nome : '',
      valor: m.valor,
      vencimento: m.vencimento,
      status: m.status
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensalidades.' });
  }
};

exports.listarAlunos = async (req, res) => {
  try {
    const alunos = await User.find({ tipo: 'aluno' });
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
};

exports.editarAluno = async (req, res) => {
  const { id } = req.params;
  const { nome, usuario, email, senha, plano_id } = req.body;
  try {
    const update = { nome, usuario, email };
    if (senha) update.senha = bcrypt.hashSync(senha, 8);
    await User.findByIdAndUpdate(id, update);
    if (plano_id) {
      await AlunoDetalhes.findOneAndUpdate({ usuario: id }, { plano: plano_id });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao editar aluno.' });
  }
};

exports.excluirAluno = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    await AlunoDetalhes.deleteMany({ usuario: id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir aluno.' });
  }
};

exports.listarPlanos = async (req, res) => {
  try {
    const planos = await Plano.find();
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar planos.' });
  }
};

exports.editarPlano = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, duracao } = req.body;
  try {
    await Plano.findByIdAndUpdate(id, { nome, preco, duracao });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao editar plano.' });
  }
};

exports.excluirPlano = async (req, res) => {
  const { id } = req.params;
  try {
    await Plano.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir plano.' });
  }
};

exports.setMercadoPagoToken = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'Access Token é obrigatório.' });
    await Config.findOneAndUpdate(
      { chave: 'mercado_pago_access_token' },
      { valor: accessToken },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar Access Token.' });
  }
};

exports.getMercadoPagoToken = async (req, res) => {
  try {
    const config = await Config.findOne({ chave: 'mercado_pago_access_token' });
    res.json({ accessToken: config ? config.valor : null });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter Access Token.' });
  }
};

exports.recuperarSenhaAluno = async (req, res) => {
  const { cpf, novaSenha } = req.body;
  if (!cpf || !novaSenha) return res.status(400).json({ error: 'CPF e nova senha são obrigatórios.' });
  try {
    const detalhes = await AlunoDetalhes.findOne({ $or: [ { mae_cpf: cpf }, { pai_cpf: cpf } ] });
    if (!detalhes) {
      return res.status(404).json({ error: 'Aluno não encontrado para este CPF.' });
    }
    const user = await User.findById(detalhes.usuario);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    user.senha = bcrypt.hashSync(novaSenha, 8);
    await user.save();
    return res.json({ success: true, message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
}; 
