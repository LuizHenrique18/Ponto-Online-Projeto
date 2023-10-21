const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

//Permite acesso a rota dependendo do nível e se está logado
const nivelAcess = require('../config/nivelAcess')
const authenticationMiddleware = require('../config/authenticationMiddleware')
const acessLoginPage = require('../config/acessLoginPage')


//Rotas
router.get('/',acessLoginPage, AuthController.login)
router.post('/login',acessLoginPage, AuthController.loginPost)
router.get('/logout', AuthController.logOut)
router.get('/register',authenticationMiddleware, nivelAcess, AuthController.register)
router.post('/register',AuthController.registerPost)

module.exports = router