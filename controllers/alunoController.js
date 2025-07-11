const db = require('../database/db');
const AlunoDetalhes = require('../models/AlunoDetalhes');
const Plano = require('../models/Plano');
const Mensalidade = require('../models/Mensalidade');
const Treino = require('../models/Treino');
const mercadopago = require('mercadopago');
const Config = require('../models/Config');

exports.getPlano = async (req, res) => {
  try {
    const detalhes = await AlunoDetalhes.findOne({ usuario: req.userId }).populate('plano');
    if (!detalhes || !detalhes.plano) return res.json(null);
    res.json(detalhes.plano);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar plano.' });
  }
};

exports.getTreinos = async (req, res) => {
  try {
    const treinos = await Treino.find({ aluno: req.userId });
    res.json(treinos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar treinos.' });
  }
};

exports.getMensalidades = async (req, res) => {
  try {
    const boletos = await Mensalidade.find({ aluno: req.userId });
    res.json(boletos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensalidades.' });
  }
};

exports.getChat = (req, res) => {
  const userId = req.userId;
  db.all(
    'SELECT * FROM chat_mensagens WHERE remetente_id = ? OR destinatario_id = ? ORDER BY data_hora ASC',
    [userId, userId],
    (err, mensagens) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar mensagens.' });
      res.json(mensagens);
    }
  );
};

exports.sendMessage = (req, res) => {
  const remetente_id = req.userId;
  const { destinatario_id, mensagem } = req.body;
  const data_hora = new Date().toISOString();
  db.run(
    'INSERT INTO chat_mensagens (remetente_id, destinatario_id, mensagem, data_hora) VALUES (?, ?, ?, ?)',
    [remetente_id, destinatario_id, mensagem, data_hora],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro ao enviar mensagem.' });
      res.json({ id: this.lastID, remetente_id, destinatario_id, mensagem, data_hora });
    }
  );
};

// Utilitário para inicializar Mercado Pago com o token salvo
async function inicializarMercadoPago() {
  const config = await Config.findOne({ chave: 'mercado_pago_access_token' });
  if (!config) throw new Error('Access Token do Mercado Pago não configurado.');
  mercadopago.configure({ access_token: config.valor });
}

// Pagamento avulso (cartão ou pix)
exports.pagarComMercadoPago = async (req, res) => {
  try {
    await inicializarMercadoPago();
    const { valor, descricao, metodo, email, token, payment_method_id, issuer_id, payer_identification } = req.body;
    if (metodo === 'pix') {
      const payment = await mercadopago.payment.create({
        transaction_amount: Number(valor),
        description: descricao,
        payment_method_id: 'pix',
        payer: { email }
      });
      return res.json({ qr_code: payment.body.point_of_interaction.transaction_data.qr_code_base64, status: payment.body.status });
    } else if (metodo === 'cartao') {
      const payment = await mercadopago.payment.create({
        transaction_amount: Number(valor),
        token,
        description: descricao,
        installments: 1,
        payment_method_id,
        issuer_id,
        payer: {
          email,
          identification: payer_identification
        }
      });
      return res.json({ status: payment.body.status });
    } else {
      return res.status(400).json({ error: 'Método de pagamento inválido.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar pagamento.', details: err.message });
  }
};

// Assinatura recorrente
exports.criarAssinaturaMercadoPago = async (req, res) => {
  try {
    await inicializarMercadoPago();
    const { valor, descricao, recorrencia, email } = req.body;
    // Frequência: months (mensal), 6 months (semestral), 12 months (anual)
    let frequency = 1;
    let frequency_type = 'months';
    if (recorrencia === 'mensal') { frequency = 1; frequency_type = 'months'; }
    if (recorrencia === 'semestral') { frequency = 6; frequency_type = 'months'; }
    if (recorrencia === 'anual') { frequency = 12; frequency_type = 'months'; }
    const preapproval = await mercadopago.preapproval.create({
      reason: descricao,
      auto_recurring: {
        frequency,
        frequency_type,
        transaction_amount: Number(valor),
        currency_id: 'BRL'
      },
      payer_email: email,
      back_url: 'https://cecesportes.onrender.com/painel-aluno',
      status: 'pending'
    });
    res.json({ init_point: preapproval.body.init_point, status: preapproval.body.status });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar assinatura.', details: err.message });
  }
}; 
