const express = require('express')
const router  = express.Router()
const PagController = require('../controllers/PagController')

router.get('/ponto', PagController.ponto)
// router.post('/ponto', PagController.pontoPost)
router.post('/pontoEntrada', PagController.pontoEntradaPost)

module.exports = router