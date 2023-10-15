const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

//Permite acesso a rota dependendo do nível e se está logado
const nivelAcess = require('../config/nivelAcess')
const authenticationMiddleware = require('../config/authenticationMiddleware')

//Rotas
router.get('/', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/logout', AuthController.logOut)
router.get('/register', AuthController.register)
router.post('/register',AuthController.registerPost)

module.exports = router