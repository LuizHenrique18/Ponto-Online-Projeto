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
        let verificadorBD = null
        
        // Requisições ao BD para disponibilizar informações na view        
        let user = await User.findOne({where:{id:userId}})
        let nome = user.name
        let email = user.email


        await Horarios.create({horaEntrada:pontoEntrada, horaSaida:pontoSaida, dataDeCriacao:dataValida, tempoDeTrabalho:tempoAdicionar, horariosId:userId})

        res.redirect('/')
    }

    static async pontoEntrada(req,res){
        /*
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
            console.log(pontoEntrada, pontoSaida)
            if(pontoEntrada == 'null' || pontoSaida == null){
                console.log('não foi possível adicionar pois um dos pontos de entrada está como nulo')
            }else{
                let tempoAdicionar = somaEntradaSaida(pontoEntrada, pontoSaida)
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

            */
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
        console.log(dados)
        console.log('OPASMpdomsaDASOKDNDNASOID')
        let dadosSaida = {horaSaida:pontoSaida, tempoDeTrabalho:tempoTrabalhado}
        
        let user = await User.findOne({where:{id:userId}})
        let nome = user.name
        let email = user.email
        let verificadorBD = null

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

