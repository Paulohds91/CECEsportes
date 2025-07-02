const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'castros_secret'; // Em produção, use variável de ambiente

exports.register = (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  const hash = bcrypt.hashSync(senha, 8);
  db.run(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, hash, tipo],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }
      res.json({ id: this.lastID, nome, email, tipo });
    }
  );
};

exports.login = async (req, res) => {
  const { usuario, senha } = req.body;
  const user = await User.findOne({ usuario });
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado.' });
  }
  if (!bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ error: 'Senha inválida.' });
  }
  const token = jwt.sign({ id: user._id, tipo: user.tipo }, SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, nome: user.nome, usuario: user.usuario, email: user.email, tipo: user.tipo } });
};

exports.registerGestor = async (req, res) => {
  const { nome, usuario, email, senha, confirmacaoSenha, telefone, dataNascimento, cpf } = req.body;

  // Validação básica
  if (!nome || !usuario || !email || !senha || !confirmacaoSenha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  if (senha.length < 8 || !(/[a-zA-Z]/.test(senha) && /[0-9]/.test(senha))) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres, letras e números.' });
  }
  if (senha !== confirmacaoSenha) {
    return res.status(400).json({ error: 'As senhas não conferem.' });
  }

  // Verifica duplicidade de email, usuario ou CPF
  const exists = await User.findOne({ $or: [{ email }, { usuario }, { cpf }] });
  if (exists) {
    return res.status(400).json({ error: 'E-mail, usuário ou CPF já cadastrado.' });
  }

  const hash = bcrypt.hashSync(senha, 8);
  const user = new User({
    nome,
    usuario,
    email,
    senha: hash,
    tipo: 'gestor',
    telefone: telefone || '',
    data_nascimento: dataNascimento || '',
    cpf: cpf ? cpf : null
  });

  try {
    await user.save();
    res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar gestor.' });
  }
};

exports.loginAluno = async (req, res) => {
  const { usuario, senha } = req.body;
  const user = await User.findOne({ usuario, tipo: 'aluno' });
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado.' });
  }
  if (!bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ error: 'Senha inválida.' });
  }
  const token = jwt.sign({ id: user._id, tipo: user.tipo }, SECRET, { expiresIn: '1d' });
  res.json({ token, aluno: { id: user._id, nome: user.nome, usuario: user.usuario, email: user.email, tipo: user.tipo } });
}; 