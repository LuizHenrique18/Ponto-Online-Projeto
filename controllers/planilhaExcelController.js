const Horarios = require('../models/Horarios')
const User = require('../models/User')

const ExcelJS = require('exceljs')
const workbook = new ExcelJS.Workbook();

const fs = require('fs');




const tempoTrabalhado = require('../helpers/TempoTotalTrabalhado/tempoTrabalhado')

module.exports = class planilhaExcelController{
    
    

  //LÓGICA PARA GERAR PLANILHA EXCEL DOS linhasPlanilha DO USUÁRIO
  static async excelPlanilha(req,res){
        //Apagar último arquivo baixado para não ter sobrecarga de arquivos no sistema
        let excelFileName = `./dowloadExcel/dowload1.xlsx`

        fs.unlink(excelFileName, (err)=>{
            if(err){
                console.log('erro ao excluir arquivo', err)
            }else{
                console.log('Arquivo excluído')
            }
        })


        //Essa parte abaixo é responsável, assim como no historicControlle, por somar o tempo total trabalhado durante o dia

        //ID do user
        let userId = req.params.id
    
        let arrayTempoTranalhado = []
        let arrayDeData = []
        let arrayEntrada = []
        let arraySaida = []
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
                arrayTempoTranalhado.push(valor)
                arrayEntrada.push(dados[0].horaEntrada)
                arraySaida.push(dados[dados.length-1].horaSaida)
            })
            .catch((err)=>{
                console.log(err, 'erro úiltimo')
            })
        
        }
        //Consulta para pegar o nome do user
        let dadosUser = await User.findOne({where:{id:userId}})
        let user = dadosUser.name

        let workSheetName = `Dados - ${user}`
        let contadorParaWorksheet = 0
        while(true){
            if(workbook.getWorksheet(workSheetName)){
                contadorParaWorksheet++
                console.log('já existe um worksheet com esse nome', contadorParaWorksheet)
            }else{
                console.log('passou')
                break
            }
            workSheetName = `Dados - ${user}${contadorParaWorksheet}`
        }
        let worksheet = workbook.addWorksheet(workSheetName)
        /* AQUI COMEÇA A PARTE RESPONSÁVEL POR ADICIONAR OS DADOS ACIMA NO EXCEL */
        //Título 
        worksheet.addRow(['Data', 'Entrada', 'Saída', 'Tempo'])

        //Pegar linhasPlanilha de tempo e data do usuário a partir do id
        for(let i=0;i<arrayTempoTranalhado.length;i++){
            worksheet.addRow([`${arrayDeData[i]}`, `${arrayEntrada[i]}`, `${arraySaida[i]}`, `${arrayTempoTranalhado[i]}`])
        }

        // Tempo para mudar sempre o nome da planilha para não sobrepor quando gerar outras


        workbook.xlsx.writeFile(excelFileName)
        .then(()=>{
            console.log('deu certo')
            res.download('dowloadExcel/dowload1.xlsx')
            console.log('teste')
        })
        .catch((err)=>{
            console.log(err)
        })

    }
}