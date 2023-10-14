const User = require('../models/User')

module.exports = class ProfileController {

    static async profile (req,res){

        //Disponibiliza a vizualição do menu completo dependendo do nivel do user
        let userId = req.session.userid
        let user = await User.findOne({where:{id:userId}})
        let nivel = user.nivel

        res.render('perfil/profile', {nivel})
    }

} 