const User = require('../models/User')
const Horarios = require('../models/Horarios')


module.exports = class PagController {
    static async ponto(req, res){ 
         //Data para identificar de qual o dia de criação - vai servir como parâmetro na hora de atualizar os dados de entrada e saída
         let data = new Date()
         console.log(data, 'ok, data aqui')
 
         let dia = String(data.getDate()).padStart(2,'0')
         let mes = String(data.getMonth() + 1).padStart(2,'0')
         let ano = data.getFullYear()
        
         let diaMaisCinco = String(data.getDate() + 5).padStart(2,'0')
         let dataValida = `${dia}/${mes}/${ano}`;
         
        //Lógica para mostrar o nome e email do usuário
        let userId = req.session.userid
        let user = await User.findOne({where:{id:userId}})
        console.log(user.name, 'Aqui baby')
        let nome = user.name
        let email = user.email
        
        // Lógica para retornar os horários 
        // let horario = await Horarios.findall({})

        res.render('baterponto/ponto',{email, nome})
    }
   

    static async pontoEntradaPost(req,res){
        
        //Data para identificar de qual o dia de criação - vai servir como parâmetro na hora de atualizar os dados de entrada e saída
        let data = new Date()
        console.log(data, 'ok, data aqui')

        let dia = String(data.getDate()).padStart(2,'0')
        let mes = String(data.getMonth() + 1).padStart(2,'0')
        let ano = data.getFullYear()

        let dataValida = `27/${mes}/${ano}`;
        //Id do usuário logado
        let userId = req.session.userid

        //Hora retornada do front-end pelo POST - HORÁRIOS DE ENTRADA E SAÍDA
        let pontoEntrada = `${req.body.horaEntrada}`
        let pontoSaida = `${req.body.horaSaida}`
        let descricaoDoDia = req.body.descricao
        console.log(descricaoDoDia, 'opaoapsopaos')

        console.log('Let me seeeeeeeeeeeeeeeeeeeeeeeeee', pontoEntrada)

        // Verifica se já tem dados no banco ou não
        let verificadorBD = null
        let horarioDeEntrada = null
        
        //Adicionar os dados ao banco de dados - data de envio, horário da batida do ponto e o tempo em que esteve no trabalho
        // await Horarios.findOne({where:{dataDeCriacao: dataValida, horariosId:userId}})
        // .then((dados)=>{
        //     if(dados){
        //         horarioDeEntrada = dados.horaEntrada
        //         console.log(horarioDeEntrada, pontoEntrada, 'opa deu certinho')
               
        //         verificadorBD = true;

                
        //     }else{
        //         verificadorBD = null;
        //     }
        // })
        // .catch((err)=>{
        //     console.log(err, 'droga deu erro')
        // })

        // IMPORTANDO MÓDULO QUE FAZ A CONTAGEM DO TEMPO TRABALHADO, SOMANDO CASO TENHA MAIS DE UM VALOR REGISTRADO
        const contador = require('../public/js/contador')
        console.log('OLHA AQUI PO', horarioDeEntrada)
       /*
        if(verificadorBD){
                let tempoAtualizado = contador(pontoEntrada, horarioDeEntrada) //PRECISO VER O QUE ESTÁ DANDO ERRADO AQUI
                await Horarios.update( 
                    {horaEntrada:pontoEntrada, tempoDeTrabalho:tempoAtualizado}, 
                    {where:{dataDeCriacao:dataValida, horariosId:userId}}
                    )
                .then(()=>{
                    console.log('Dados atualizados com sucesso')
                })
                .catch((err)=>{
                    console.log('erro aqui', err, 'erro aqui no update')
                })
                
        }else{
            await Horarios.create({dataDeCriacao:dataValida, horaEntrada:pontoEntrada, horariosId: userId, tempoDeTrabalho:'0'})
            console.log('Algo foi criado')
        }
        */


            let tempoAdicionar = contador(pontoEntrada, pontoSaida)
            await Horarios.create({dataDeCriacao:dataValida, horaEntrada:pontoEntrada, horaSaida:pontoSaida, tempoDeTrabalho:tempoAdicionar, horariosId:userId, descricao:descricaoDoDia})
            .then(()=>{
                console.log('Deu tudo certo')
            })
            .catch((err)=>{
                console.log(err, 'Erro ao adicionar ponto do usuário')
            })
        
        let user = await User.findOne({where:{id:userId}})
        console.log(user.name, 'Aqui baby')
        let nome = user.name
        let email = user.email
        
        // Lógica para retornar os horários 
        // let horario = await Horarios.findall({})


        res.render('baterponto/ponto', {verificadorBD, email, nome})

    }
}

