const User = require('../models/User')
const Horarios = require('../models/Horarios')

//Soma entrada e saída do user
const somaEntradaSaida = require('../helpers/SomaEntradaSaida/SomaEntradaSaida')


module.exports = class PagController {
    static async ponto(req, res){ 
        //Lógica para mostrar o nome e email do usuário
        let userId = req.session.userid;
        let user = await User.findOne({where:{id:userId}});
        console.log(user.name, 'Aqui baby');
        let nome = user.name;
        let email = user.email;
        
        let nivel = user.nivel;
        let butEntrada = true;
        await Horarios.findOne({where:{horariosId:userId},order:[[
            'createdAt','DESC' 
        ]]
        })
        .then((ResponseData)=>{
            if(ResponseData){
                if(ResponseData.horaSaida == null){
                    butEntrada = false;
                };
            }else{
                console.log('Não tem nenhum dado')
            }
        })
        .catch((err)=>{
            console.log(err)
        })
        
        let arrayTeste = []
        
        
        arrayTeste.push(butEntrada)
        
        // Lógica para retornar os horários 
        // let horario = await Horarios.findall({})

        res.render('baterponto/ponto',{email, nome, nivel, butEntrada});
    }
   
    static async pontoEntradaPost(req,res){
        let dados = req.body.dados

        //Dados que vinheram do body
        let pontoEntrada = dados.pontoEntrada
        let pontoSaida   = null
        let tempoAdicionar = null
        let dataValida   = dados.data
        
        let userId = req.session.userid
        
        await Horarios.create({horaEntrada:pontoEntrada, horaSaida:pontoSaida, dataDeCriacao:dataValida, tempoDeTrabalho:tempoAdicionar, horariosId:userId})

        res.redirect('/')
    }

    static async pontoEntrada(req,res){
        let dados        = req.body.dados
        let dataValida   = dados.data
        let pontoSaida   = dados.horaSaida
        let pontoEntrada = null

        let userId = req.session.userid

        await Horarios.findOne({where:{horariosId:userId}, order:
            [['createdAt','DESC']]
        }).then((response)=>{
            pontoEntrada = response.horaEntrada
            console.log(pontoEntrada)
        })
        .catch((err)=>{
            console.log(err)
        })
        let tempoTrabalhado = somaEntradaSaida(pontoEntrada, pontoSaida)
        let dadosSaida = {horaSaida:pontoSaida, tempoDeTrabalho:tempoTrabalhado}

        await Horarios.update(dadosSaida,{where:{horariosId:userId, dataDeCriacao:dataValida ,horaSaida:null}})
        .then(()=>{
            console.log('Valores atualizados com sucesso')
        })
        .catch((err)=>{
            console.log(err)
        })
        res.redirect('/')
    }
}

