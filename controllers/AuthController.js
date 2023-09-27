const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class AuthController {
    // PÁGINA DE INICIALIZAÇÃO
    static async login(req, res) {
        res.render('auth/login')
    }

    static async register(req, res){
        res.render('auth/register')
    }

    // PARTE DE REGISTRO DA PÁGINA
    static async registerPost(req, res){
        const {name , email, cpf , password, confirmpassword} = req.body

        if(password != confirmpassword){
            console.log('A senha não é a mesma')
            redirect('/register')
            return
        }
        const salt = bcrypt.genSaltSync(8)
        const hashPassword = bcrypt.hashSync(password, salt)

        const user ={
            name, 
            email, 
            cpf,
            password:hashPassword
        }

        try{
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            req.session.save(()=>{
                res.redirect('/ponto')
            })
        }
        catch(err){
            console.log(err)
        }
    }   

    // LOGIN, ENTRADA DO USUÁRIO
    static async loginPost(req, res){
        const{email, password} = req.body

        const user = await User.findOne({where:{email:email}})
        if(!user){
            console.log('Usuário não encontrado')
            res.render('auth/login')
            return
        }

        const confPas = bcrypt.compareSync(password, user.password)
        
        if(!confPas){
            console.log('A senha está incorreta')
            res.redirect('/')
            return
        }

        req.session.userid = user.id
        req.session.save(()=>{
            res.redirect('/ponto')
        })
    }

    // SAIR, LOGOUT DO USUÁRIO
    static async logOut(req,res){
        req.session.destroy()
        res.redirect('/')
    } 

    
}