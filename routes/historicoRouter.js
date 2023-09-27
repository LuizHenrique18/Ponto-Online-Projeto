const express = require('express')
const router = express.Router()
const HistoricController = require('../controllers/HistoricController')

router.get('/historico', HistoricController.historic)

module.exports = router