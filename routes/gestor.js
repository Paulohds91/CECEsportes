const express = require('express');
const router = express.Router();
const gestorController = require('../controllers/gestorController');
const auth = require('../middleware/auth');

router.post('/aluno', auth, gestorController.cadastrarAluno);
router.post('/plano', auth, gestorController.cadastrarPlano);
router.get('/relatorios', auth, gestorController.getRelatorios);
router.get('/mensalidades', auth, gestorController.getMensalidades);
router.get('/planos', auth, gestorController.listarPlanos);
router.get('/alunos', auth, gestorController.listarAlunos);
router.put('/aluno/:id', auth, gestorController.editarAluno);
router.delete('/aluno/:id', auth, gestorController.excluirAluno);
router.put('/plano/:id', auth, gestorController.editarPlano);
router.delete('/plano/:id', auth, gestorController.excluirPlano);
router.post('/mercadopago/token', auth, gestorController.setMercadoPagoToken);
router.get('/mercadopago/token', auth, gestorController.getMercadoPagoToken);

module.exports = router; 