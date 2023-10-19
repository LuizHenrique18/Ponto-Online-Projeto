const User = require('../models/User')
const Horarios = require('../models/Horarios')


module.exports = class PagController {
    static async ponto(req, res){ 
        //Lógica para mostrar o nome e email do usuário
        let userId = req.session.userid
        let user = await User.findOne({where:{id:userId}})
        console.log(user.name, 'Aqui baby')
        let nome = user.name
        let email = user.email
        
        let nivel = user.nivel
        
        // Lógica para retornar os horários 
        // let horario = await Horarios.findall({})

        res.render('baterponto/ponto',{email, nome, nivel})
    }
   

    static async pontoEntradaPost(req,res){
        
        //Data para identificar de qual o dia de criação - vai servir como parâmetro na hora de atualizar os dados de entrada e saída
        const data = new Date().now;

        let options = {timeZone:'America/Sao_Paulo', year:'numeric', month:'numeric', day:'numeric'}
        let formatado = new Intl.DateTimeFormat('pt-BR', options);
        let dataFormatada = formatado.format(data);

        let dia  =String(dataFormatada).slice('0','2') 
        let mes = String(dataFormatada).slice('3','5')  
        let ano =String(dataFormatada).slice('6','10')  


        let dataValida = `${dia}/${mes}/${ano}`;
        //Id do usuário logado
        let userId = req.session.userid

        //Hora retornada do front-end pelo POST - HORÁRIOS DE ENTRADA E SAÍDA
        let pontoEntrada = `${req.body.horaEntrada}`
        let pontoSaida = `${req.body.horaSaida}`
        let descricaoDoDia = req.body.descricao

        // Verifica se já tem dados no banco ou não
        let verificadorBD = null
        let horarioDeEntrada = null
        

        // IMPORTANDO MÓDULO QUE FAZ A CONTAGEM DO TEMPO TRABALHADO, SOMANDO CASO TENHA MAIS DE UM VALOR REGISTRADO
        const contador = require('../public/js/contador')
      
            console.log(pontoEntrada, pontoSaida)
            if(pontoEntrada == 'null' || pontoSaida == null){
                console.log('não foi possível adicionar pois um dos pontos de entrada está como nulo')
            }else{
                let tempoAdicionar = contador(pontoEntrada, pontoSaida)
                await Horarios.create({dataDeCriacao:dataValida, horaEntrada:pontoEntrada, horaSaida:pontoSaida, tempoDeTrabalho:tempoAdicionar, horariosId:userId, descricao:descricaoDoDia})
                .then(()=>{
                    console.log('Deu tudo certo')
                })
                .catch((err)=>{
                    console.log(err, 'Erro ao adicionar ponto do usuário')
                })
            }
            
            
        
        let user = await User.findOne({where:{id:userId}})
        let nome = user.name
        let email = user.email
        
        // Lógica para retornar os horários 
        // let horario = await Horarios.findall({})


        res.render('baterponto/ponto', {verificadorBD, email, nome})

    }
}

