const User = require('../models/User')
const Horarios = require('../models/Horarios')
const fs = require('fs')

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
        console.log('dimofoaimfdasd')
        console.log('dimofoaimfdasd')
        console.log('dimofoaimfdasd')
        console.log('dimofoaimfdasd')
        console.log('dimofoaimfdasd')
        let dados = req.body.dados

        //Dados que vinheram do body
        let pontoEntrada = dados.pontoEntrada
        let pontoSaida   = null
        let tempoAdicionar = null
        let dataValida   = dados.data
        let imagem = dados.image

        const base64 = imagem.replace(/^data:image\/png;base64,/, '');
        console.log(dados, 'Aqui')

        //Dados Usados para nomear o arquivo
        let data = new Date()
        let milesegundos = data.getMilliseconds()
        let segundos = data.getSeconds()
        console.log(segundos, 'data')
        

        let userId = req.session.userid

        let usuario = await User.findOne({where:{id:userId}})
        let nomeUser = String(usuario.name)

        const dir = 'imgPontos/Pontos/'; // Defina o diretório onde deseja salvar o arquivo
        const filename = `${nomeUser}${milesegundos}${segundos}.png`;
        const filePath = dir + filename;
    
        fs.writeFile(filePath, base64, 'base64', function(err) {
            if (err) {
                console.error('Erro ao salvar o arquivo:', err);
            } else {
                console.log('Arquivo salvo com sucesso em:', filePath);
            }
        });

        await Horarios.create({horaEntrada:pontoEntrada, horaSaida:pontoSaida, dataDeCriacao:dataValida, tempoDeTrabalho:tempoAdicionar, horariosId:userId, image:filePath})
        .then(()=>{
            console.log('Adicionado com sucesso')
        })
        .catch((err)=>{
            console.log(err)
        })
       
        
        
        
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

