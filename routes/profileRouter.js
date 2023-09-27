const express = require('express')
const router = express.Router()
const ProfileController = require('../controllers/ProfileController')


router.get('/profile', ProfileController.profile)

module.exports = router