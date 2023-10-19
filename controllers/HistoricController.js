const Horarios = require('../models/Horarios')
const User = require('../models/User')

//Lógica responsável por somar o tempo trabalhado
const tempoTrabalhado = require('../helpers/tempoTrabalhado')


module.exports = class HistoricController {


    static async historico(req, res){
        //ID do user
        let userId = req.session.userid
  
        let array = []
        let arrayDeData = []
        
        //Importante para servir de parâmetro na próxima página, quando vai puxar todos os pontos batidos daquele user nessa data
        let arrayDeIdData = []

        await Horarios.findAll({where:{horariosId:userId}
        })
        .then((dados)=>{   
                for(let i=0; i<dados.length;i++){            
                    let valor1 = `${dados[i].dataDeCriacao}`
                    //Se a data ainda não foi incluída dentro do array, ela entra e é incluída, se já está dentro, então não é incluída - é importante para as seguintes lógicas
                    if(arrayDeData.length > 0){
                        if(!arrayDeData.includes(valor1)){
                            arrayDeData.push(dados[i].dataDeCriacao) 
                            arrayDeIdData.push(dados[i].id)
                    }
                    }else{
                        arrayDeData.push(dados[i].dataDeCriacao)
                        arrayDeIdData.push(dados[i].id)
                    }
            }
        })
        .catch((err)=>{
            console.log(err)
        })

        //FOR para ler todo o array 
        for(let i=0;i<arrayDeData.length;i++){
            await Horarios.findAll({where:{horariosId:userId, dataDeCriacao:arrayDeData[i]}})
            .then((dados)=>{
                //É enviado para a function os dados que serão lidos e vai ser retornado em array o tempo trabalhado - O tempo total de cada dia
                let valor = tempoTrabalhado(dados)
                array.push(valor)
            })
            .catch((err)=>{
                console.log(err, 'erro úiltimo')
            })
       
        }


        // Requisição no banco para pegar as informações do user e mostrá-las na interface
        let user = await User.findOne({where:{id:userId}})

        let userName = user.name
        let userEmail = user.email
        let userCpf = String(user.cpf)

        let arrayTempoTotal = array
        let arrayDatas = arrayDeData

        //FORMATANDO CPF
        let tresCpf =userCpf.slice(0,3)
        let seisCpf =userCpf.slice(3,6)
        let noveCpf =userCpf.slice(6,9)
        let onzeCpf =userCpf.slice(9,11)

        let cpfFormatado = `${tresCpf}.${seisCpf}.${noveCpf}-${onzeCpf}`
        console.log(userCpf)

        //LÓGICA PARA RETORNAR PRIMEIRO HORÁRIO DO DIA A SER CADASTRADO E O ÚLTIMO
        let arrayEntrada = []
        let arraySaida = []

        let dadosPessoa = []
        try{
            for(let i=0; i<arrayDatas.length;i++){
                //busca os dados de acordo com os dias que já foram adicionados no arrayDatas
                await Horarios.findAll({where:{horariosId:userId, dataDeCriacao:arrayDatas[i]}})
                .then((dados)=>{
                    //adiciona os dados no array de entrada e saída de acordo com o primeiro e último retornado de cada dia
                    arrayEntrada.push(dados[0].horaEntrada)
                    arraySaida.push(dados[dados.length-1].horaSaida)
                    dadosPessoa.push({datas:arrayDatas[i], entrada:arrayEntrada[i], saida:arraySaida[i], tempo:arrayTempoTotal[i], arrayIdData:arrayDeIdData[i]})
                })
                .catch((err)=>{
                    console.log(err)
                })
                }
        }
        catch(err){
            console.log(err)
        }

        //Nivel do usuário
   
        let nivel = user.nivel
        console.log(dadosPessoa)
        console.log(arrayDeIdData)

        res.render('historico/historico', {userName, userEmail, cpfFormatado, dadosPessoa, nivel})

            
    }

    static async historicoDia(req,res){
        //DADOS DO USER
        let userId = req.session.userid
        let user = await User.findOne({where:{id:userId}})

        let userName = user.name
        let userEmail = user.email
        let userCpf = String(user.cpf)

        //FORMATANDO CPF
        let tresCpf =userCpf.slice(0,3)
        let seisCpf =userCpf.slice(3,6)
        let noveCpf =userCpf.slice(6,9)
        let onzeCpf =userCpf.slice(9,11)

        let cpfFormatado = `${tresCpf}.${seisCpf}.${noveCpf}-${onzeCpf}`

        //Esse controller será responsável por disponibilizar os dados do pontos registrados especificamente em cada dia
        const idData = req.params.id
        let dadosDoId = await Horarios.findOne({where:{id:idData}})
        let dia = dadosDoId.dataDeCriacao
      
        let dadosDoDia = await Horarios.findAll({where:{dataDeCriacao:dia, horariosId:userId}})
        /* ARRAY PARA ADICIONAR OS DADOS */
        let dadosFormatados = []
        let entrada = []
        let saida = []
        let tempo = []
        let descricao = []
        let data 
        let id = []

        let dadosPessoa = []
        for(let i=0; i<dadosDoDia.length;i++){
            /* ADICIONANDO OS DADOS NOS ARRAYS QUE SERÃO VIZUALIZADOS NA VIEW */
            entrada.push(dadosDoDia[i].horaEntrada)
            saida.push(dadosDoDia[i].horaSaida)
            tempo.push(dadosDoDia[i].tempoDeTrabalho)
            descricao.push(dadosDoDia[i].descricao)
            data = dadosDoDia[i].dataDeCriacao
            id.push(dadosDoDia[i].id)
            dadosPessoa.push({datas:dadosDoDia[i].dataDeCriacao, entrada:dadosDoDia[i].horaEntrada, saida:dadosDoDia[i].horaSaida, tempo:dadosDoDia[i].tempoDeTrabalho})
        }
        //Nivel de acesso
        let nivel = user.nivel
        res.render('historico/historicoDetalhado', {idData,data, dadosPessoa, id, descricao, cpfFormatado, userCpf, userEmail, userName, nivel})
    }
}
