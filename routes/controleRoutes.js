const express = require('express')
const router = express.Router()
const controleController = require('../controllers/ControleController');

//Permite acesso a rota dependendo do nível e se está logado
const nivelAcess = require('../config/nivelAcess')
const authenticationMiddleware = require('../config/authenticationMiddleware')

router.get('/controle', authenticationMiddleware, nivelAcess, controleController.controleDados)
router.get('/controleuser:id', authenticationMiddleware, nivelAcess, controleController.controleUser)
router.get('/diauser:id', authenticationMiddleware, nivelAcess, controleController.controleUserDetalhado)

module.exports = router