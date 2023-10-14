const express = require('express')
const router  = express.Router()
const PagController = require('../controllers/PagController')

//Permite acesso a rota dependendo se está logado
const authenticationMiddleware = require('../config/authenticationMiddleware')

//Rotas
router.get('/ponto',authenticationMiddleware ,PagController.ponto)
router.post('/pontoEntrada',authenticationMiddleware ,PagController.pontoEntradaPost)

module.exports = router