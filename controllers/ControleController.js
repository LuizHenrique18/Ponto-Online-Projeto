const User = require('../models/User')
const Horarios = require('../models/Horarios')


module.exports = class ControleController{
    
    static async controleDados (req,res){
        //Array para dados que serão adicionados através do findAll
        let usersName = []
        let usersEmail = []
        let usersCPF = []      
        let usersId = []
    
        //Nivel do usuário
        let idUser = req.session.userid
        let usuario = await  User.findOne({where:{id:idUser}})   
        let nivel = usuario.nivel

        User.findAll()
        .then((users)=>{

            for(let i=0; i < users.length; i++){
    
                usersName.push(users[i].name)
                usersEmail.push(users[i].email)
                usersCPF.push(users[i].cpf)
                usersId.push(users[i].id)
            }
            res.render('controle/controleDados',{usersName, usersEmail, usersCPF, nivel, usersId})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    static async controleUser(req,res){
        //DADOS DO USER
        let userId = req.params.id
     
        //Data para identificar de qual o dia de criação - vai servir como parâmetro na hora de atualizar os dados de entrada e saída
        let data = new Date()

        //FUNCTION PARA RETORNAR A SOMA DAS HORAS TRABALHADAS DURANTE O DIA
        const tempoTrabalhado = require('../helpers/tempoTrabalhado')

        let array = []
        let arrayDeData = []
        let arrayDeNumero = []
        let arrayDeIdData = []

                
        //Adicionando o id do params para o arrayDeIdDataUser, para assim conseguir o id do user a ser monitorado e também da data que servirá como parâmetro para a pesquisa do que foi feito naquela data
        let arrayDeIdDataUser = []

        await Horarios.findAll({where:{horariosId:userId}
        })
        .then((dados)=>{   
                for(let i=0; i<dados.length;i++){            
                    let valor1 = `${dados[i].dataDeCriacao}`
                    arrayDeNumero.push(i)
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

        for(let i=0;i<arrayDeData.length;i++){
            await Horarios.findAll({where:{horariosId:userId, dataDeCriacao:arrayDeData[i]}})
            .then((dados)=>{
                let valor = tempoTrabalhado(dados)
                array.push(valor)
            })
            .catch((err)=>{
                console.log(err, 'erro úiltimo')
            })
       
        }

        for(let i=0; i < arrayDeIdData.length; i++){
            arrayDeIdDataUser.push(`${arrayDeIdData[i]}${userId}`)
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

        //LÓGICA PARA RETORNAR PRIMEIRO HORÁRIO DO DIA A SER CADASTRADO E O ÚLTIMO
        let arrayEntrada = []
        let arraySaida = []
        try{
            for(let i=0; i<arrayDatas.length;i++){
                //busca os dados de acordo com os dias que já foram adicionados no arrayDatas
                await Horarios.findAll({where:{horariosId:userId, dataDeCriacao:arrayDatas[i]}})
                .then((dados)=>{
                    //adiciona os dados no array de entrada e saída de acordo com o primeiro e último retornado de cada dia
                    arrayEntrada.push(dados[0].horaEntrada)
                    arraySaida.push(dados[dados.length-1].horaSaida)
                })
                .catch((err)=>{
                    console.log(err)
                })
                }
        }
        catch(err){
            console.log(err)
        }

        //Nivel de acesso
        let idUserNivel = req.session.userid
        let userIdNivel = await User.findOne({where:{id:idUserNivel}})
        let nivel =userIdNivel

        res.render('controle/controleUser', {userName, userEmail, cpfFormatado, arrayTempoTotal, arrayDatas, arrayEntrada, arraySaida, arrayDeIdData, arrayDeIdDataUser, nivel, userId})
    }


    //RESPONSÁVEL POR DISPONIBILIZAR OS DADOS DE USUÁRIOS ESPECÍFICOS PARA O USER MASTER
    static async controleUserDetalhado(req,res){
        //DADOS DO USER
        let idParams = `${req.params.id}`
        let useridd = idParams[idParams.length - 1]
        let userId = idParams.slice(1,2)
        let userName 
        let userEmail
        let userCpf         
        
        //Nivel de acesso
        let idUserNivel = req.session.userid
        let userIdNivel = await User.findOne({where:{id:idUserNivel}})
        let nivel =userIdNivel

        await User.findOne({where:{id:useridd}})
        .then((user)=>{
            userName = user.name
            userEmail = user.email
            userCpf = String(user.cpf)
        })

        //FORMATANDO CPF
        let tresCpf =userCpf.slice(0,3)
        let seisCpf =userCpf.slice(3,6)
        let noveCpf =userCpf.slice(6,9)
        let onzeCpf =userCpf.slice(9,11)

        let cpfFormatado = `${tresCpf}.${seisCpf}.${noveCpf}-${onzeCpf}`

        //Esse controller será responsável por disponibilizar os dados do pontos registrados especificamente em cada dia
        let contador1 = idParams.length - 1
        let idData = idParams.slice(0,contador1)
        console.log(idData,'nlallaskfmdafioa')
        let dadosDoId = await Horarios.findOne({where:{id:idData}})
        let dia = dadosDoId.dataDeCriacao
      
        let dadosDoDia = await Horarios.findAll({where:{dataDeCriacao:dia, horariosId:useridd}})
        /* ARRAY PARA ADICIONAR OS DADOS */
        let dadosFormatados = []
        let entrada = []
        let saida = []
        let tempo = []
        let descricao = []
        let data 
        let id = []            
        for(let i=0; i<dadosDoDia.length;i++){
            /* ADICIONANDO OS DADOS NOS ARRAYS QUE SERÃO VIZUALIZADOS NA VIEW */
            dadosFormatados.push(dadosDoDia[i].horaEntrada, dadosDoDia[i].horaSaida, dadosDoDia[i].descricao, dadosDoDia[i].id)
            entrada.push(dadosDoDia[i].horaEntrada)
            saida.push(dadosDoDia[i].horaSaida)
            tempo.push(dadosDoDia[i].tempoDeTrabalho)
            descricao.push(dadosDoDia[i].descricao)
            data = dadosDoDia[i].dataDeCriacao
            id.push(dadosDoDia[i].id)
        }
        res.render('controle/controleUserDetalhado', {idData, dadosFormatados,entrada, saida, data, id, tempo, descricao, cpfFormatado, userCpf, userEmail, userName, nivel})
    }


  

}