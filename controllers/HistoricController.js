const Horarios = require('../models/Horarios')
const User = require('../models/User')

module.exports = class HistoricController {


    static async historic(req, res){
        let userId = req.session.userid
        /*
        let user = await User.findOne({where:{id:userId}})
        await Horarios.findAll({where:{horariosId:userId}
            ,order:[
            ['dataDeCriacao', 'ASC'],  
        ]
    }).then((horarios)=>{
        let nameUser = user.name
        let dataDeCriacao = horarios.map((horario) => horario.dataDeCriacao); 
        let horaPonto = horarios.map((horario)=> horario.horaPonto);
        let createdAt = horarios.map((horario)=> horario.createdAt);
        let tempoDeTrabalho = horarios.map((horario)=> horario.tempoDeTrabalho);
        
        res.render('historico/historico', {nameUser, horaPonto, dataDeCriacao, createdAt, tempoDeTrabalho})
    })
    .catch((err)=>{
        console.log(err)
    })
    */

    //Data para identificar de qual o dia de criação - vai servir como parâmetro na hora de atualizar os dados de entrada e saída
    let data = new Date()
    console.log(data, 'ok, data aqui')

    let dia = String(data.getDate()).padStart(2,'0')
    let mes = String(data.getMonth() + 1).padStart(2,'0')
    let ano = data.getFullYear()

    let dataValida = `${dia}/${mes}/${ano}`;
        //FUNCTION PARA RETORNAR A SOMA DAS HORAS TRABALHADAS DURANTE O DIA
        const tempoTrabalhado = require('../helpers/tempoTrabalhado')

        let array = []
        let arrayDeData = []
        let arrayDeNumero = []

        await Horarios.findAll({where:{horariosId:userId}
        })
        .then((dados)=>{   
            console.log(dados)
            console.log('aqui entrou')
            for(let i=0; i<dados.length;i++){
                console.log(dados.length, 'awuiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                console.log(i)
                Horarios.findAll({where:{horariosId:userId, dataDeCriacao:dados[i].dataDeCriacao}
                })
                .then((dadoss)=>{
                    let valor1 = `${dadoss[i].dataDeCriacao}`
                    arrayDeNumero.push(i)
                    console.log('aaAaaaaquiii', i, valor1)

                    if(arrayDeData.length > 0){
                        if(arrayDeData.includes(valor1)){
                            console.log('A data é a mesma', valor1)
                        }else{
                            console.log('Aghora sim', valor1)
                            let valor = tempoTrabalhado(dadoss)
                            array.push(valor)
                            arrayDeData.push(dados[i].dataDeCriacao)
                            }   
                    }
                    else{
                        console.log('tem dados, primeiro')
                        let valor = tempoTrabalhado(dadoss)
                        array.push(valor)
                        arrayDeData.push(dados[i].dataDeCriacao)
                    }
                    console.log(arrayDeData)
                    console.log(array)
                    console.log(arrayDeNumero)

                })
                .catch((err)=>{
                    console.log(err)
                    console.log('o Erro é aqui aaaajjajajjjjjjjjjjjjjjjjjjjjjjjaaaaaas')
                })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
        //ESTOU TENTANDO FAZER COM QUE APAREÇA SOMENTE O VALOR DE UM DIA SOMADO, ENTENDE? VAMOS TRABALHAR MAIS NISSO DEPOIS


        // Requisição no banco para pegar as informações do user e mostrá-las na interface
        let user = await User.findOne({where:{id:userId}})

        // let userHorarios = await Horarios.findOne({where:{horariosId:userId, dataDeCriacao:dataValida}})
        // .then(()=>{
        //     console.log('Deu certo')
        // })
        // .catch((err)=>{
        //     (err)
        // })

        let nameUser = user.name

        res.render('historico/historico', {nameUser})

            
    }
}


// QUAL O PRÓXIMO PASSO? FAZER COM QUE O SOMADOR DE TEMPO, SOME PELO DIA, DATA VÁLIDA