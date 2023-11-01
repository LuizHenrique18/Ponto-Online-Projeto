const User = require('../models/User')
const Horarios = require('../models/Horarios')

const tempoTrabalhado = require('../helpers/TempoTotalTrabalhado/tempoTrabalhado')


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
        let pessoas = []

        User.findAll()
        .then((users)=>{
            for(let i=0; i < users.length; i++){
                usersName.push(users[i].name)
                usersEmail.push(users[i].email)
                usersCPF.push(users[i].cpf)
                usersId.push(users[i].id)
                pessoas.push({name:usersName[i],email:usersEmail[i],cpf:usersCPF[i],userId:usersId[i]})
            }
            res.render('controle/controleDados',{pessoas, nivel})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    static async controleUser(req,res){
        //DADOS DO USER
        let userId = req.params.id
     
        //FUNCTION PARA RETORNAR A SOMA DAS HORAS TRABALHADAS DURANTE O DIA

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
        //LÓGICA PARA RETORNAR PRIMEIRO HORÁRIO DO DIA A SER CADASTRADO E O ÚLTIMO
        let arrayEntrada = []
        let arraySaida = []

        for(let i=0;i<arrayDeData.length;i++){
            await Horarios.findAll({where:{horariosId:userId, dataDeCriacao:arrayDeData[i]}})
            .then((dados)=>{
                console.log('AQUIAQUIAQUI')
                console.log()
                console.log(dados[dados.length - 1].horaSaida)
                if (dados[dados.length - 1].horaSaida != null){
                    let valor = tempoTrabalhado(dados)
                    array.push(valor)
                    arrayEntrada.push(dados[0].horaEntrada)
                    arraySaida.push(dados[dados.length-1].horaSaida)
                    
                }else{
                    arrayEntrada.push(dados[0].horaEntrada)
                    arraySaida.push(dados[dados.length-1].horaSaida)
                }
                
                
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

        //VALIDADOR PARA INFORMAR A VIEW DE QUE A SAIDA É NULL, E ASSIM MOSTRAR A LINHA DA TABELA COM UMA COR DIFERENTE
        let informaNullSaida = true
        if(arraySaida[-1]==null){
            informaNullSaida = false
        }


        //Nivel de acesso
        let idUserNivel = req.session.userid
        let userIdNivel = await User.findOne({where:{id:idUserNivel}})
        let nivel =userIdNivel
        console.log(userName, 'oaoskdmmidaosdimoidsa')
        let dadosUsuario = []
        for(let i=0; i < arrayDatas.length ; i++){
            dadosUsuario.push({datas:arrayDatas[i], entrada:arrayEntrada[i], saida:arraySaida[i], idDataUser:arrayDeIdDataUser[i], tempo:arrayTempoTotal[i], idDataUser:arrayDeIdDataUser[i]})
        }
        console.log(arraySaida, 'SAIDA')
        res.render('controle/controleUser', {userName, userEmail, cpfFormatado, dadosUsuario, nivel, userId})    
    }
    

    //RESPONSÁVEL POR DISPONIBILIZAR OS DADOS DE USUÁRIOS ESPECÍFICOS PARA O USER MASTER
    static async controleUserDetalhado(req,res){
        //DADOS DO USER
        let idParams = `${req.params.id}`
        let useridd = idParams[idParams.length - 1]
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
         let id = []            
         let dadosPessoa = []

        let data

         for(let i=0; i<dadosDoDia.length;i++){
             /* ADICIONANDO OS DADOS NOS ARRAYS QUE SERÃO VIZUALIZADOS NA VIEW */
             id.push(dadosDoDia[i].id)
             dadosPessoa.push({datas:dadosDoDia[i].dataDeCriacao, entrada:dadosDoDia[i].horaEntrada, saida:dadosDoDia[i].horaSaida, tempo:dadosDoDia[i].tempoDeTrabalho})
             data = dadosDoDia[i].dataDeCriacao
        }

        //VALIDADOR PARA INFORMAR A VIEW DE QUE A SAIDA É NULL, E ASSIM MOSTRAR A LINHA DA TABELA COM UMA COR DIFERENTE
        let validadorSaida = dadosDoDia[dadosDoDia.length -1].horaSaida
        let informaNullSaida = true
        if(validadorSaida==null){
            informaNullSaida = false
        }

         //Nivel de acesso
         console.log(dadosPessoa)
         res.render('controle/controleUserDetalhado', {data, idData, dadosPessoa, id, cpfFormatado, userCpf, userEmail, userName, nivel})
     }


  

}