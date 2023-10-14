const express = require('express')
const router = express.Router()

//Permite acesso a rota dependendo do nível e se está logado
const nivelAcess = require('../config/nivelAcess')
const authenticationMiddleware = require('../config/authenticationMiddleware')

const planilhaExcelController = require('../controllers/planilhaExcelController')

router.get('/gerarplanilha:id', authenticationMiddleware, nivelAcess, planilhaExcelController.excelPlanilha)

module.exports = router