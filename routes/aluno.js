const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const auth = require('../middleware/auth');

router.get('/plano', auth, alunoController.getPlano);
router.get('/treinos', auth, alunoController.getTreinos);
router.get('/mensalidades', auth, alunoController.getMensalidades);
router.get('/chat', auth, alunoController.getChat);
router.post('/chat', auth, alunoController.sendMessage);
router.post('/pagamento', auth, alunoController.pagarComMercadoPago);
router.post('/assinatura', auth, alunoController.criarAssinaturaMercadoPago);

module.exports = router; 
