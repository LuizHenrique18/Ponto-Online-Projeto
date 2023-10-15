const express = require('express')
const router = express.Router()
const ControleController = require('../controllers/ControleController');

//Permite acesso a rota dependendo do nível e se está logado
const nivelAcess = require('../config/nivelAcess')
const authenticationMiddleware = require('../config/authenticationMiddleware')

router.get('/controle', authenticationMiddleware, nivelAcess, ControleController.controleDados)
router.get('/controleuser:id', authenticationMiddleware, nivelAcess, ControleController.controleUser)
router.get('/diauser:id', authenticationMiddleware, nivelAcess, ControleController.controleUserDetalhado)

module.exports = router