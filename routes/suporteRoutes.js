const express = require('express')
const router = express.Router()
const SuporteController = require('../controllers/SuporteController')

router.get('/suporte', SuporteController.suporteMain)
router.get('/novousuario', SuporteController.novoUsuario)
router.get('/reportarerro', SuporteController.reportarErro)
router.get('/contato', SuporteController.contato)

module.exports = router