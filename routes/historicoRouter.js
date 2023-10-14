const express = require('express')
const router = express.Router()
const HistoricController = require('../controllers/HistoricController')

//Permite acesso
const authenticationMiddleware = require('../config/authenticationMiddleware')

//Rotas
router.get('/historico', authenticationMiddleware ,HistoricController.historico)
router.get('/historicoDia:id', authenticationMiddleware, HistoricController.historicoDia)

module.exports = router