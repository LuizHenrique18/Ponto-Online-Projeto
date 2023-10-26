const express = require('express')
const router = express.Router()
const SuporteController = require('../controllers/SuporteController')

router.get('/suporte', SuporteController.suporteMain)

module.exports = router