const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/register-gestor', authController.registerGestor);
router.post('/login-aluno', authController.loginAluno);

module.exports = router; 