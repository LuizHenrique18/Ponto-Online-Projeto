const User = require('../models/User')

module.exports = async function nivelAcess(req,res, next){
    let userId = req.session.userid
    let user = await User.findOne({where:{id:userId}})
    let nivel = user.nivel
    if(nivel == 0){
        res.redirect('/ponto')
        return
    }
    next()
}