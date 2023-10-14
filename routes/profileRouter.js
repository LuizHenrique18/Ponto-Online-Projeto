const express = require('express')
const router = express.Router()
const ProfileController = require('../controllers/ProfileController')

//Permite acesso a rota dependendo do nível e se está logado
const nivelAcess = require('../config/nivelAcess')
const authenticationMiddleware = require('../config/authenticationMiddleware')

//Rotas
router.get('/profile',authenticationMiddleware, nivelAcess, ProfileController.profile)

module.exports = router