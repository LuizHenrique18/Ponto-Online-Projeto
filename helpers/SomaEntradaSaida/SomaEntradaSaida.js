const horasParaSegundos = require('../TempoTotalTrabalhado/horasParaSegundos')
const subtraiSegundos = require('./subtraiSegundos')
const segundosParaHoras = require('../TempoTotalTrabalhado/segundosParaHoras')

//FUNCTION RESPONSÁVEL POR SOMAR O TEMPO TRABALHADO
function tempoTrabalhado(valor1, valor2){
    console.log(valor1, valor2, 'primeiro passo')
    let totalDeSegundos = []
    let dados = [valor1 , valor2]
    // FOR para transformas as horas em segundos e adicioná-las ao array
    for(let i=0;i<dados.length;i++){
        //dados que venho do controller para somar o tempo trabalhado
        let tempoTrabalhado = String(dados[i])

        let Horas = tempoTrabalhado.slice('0', '2')
        let Minutos = tempoTrabalhado.slice('3', '5')
        let Segundos = tempoTrabalhado.slice('6', '8')
        console.log(dados[i], Horas, Minutos, Segundos)

        // transforma horas para segundos
        let valor = horasParaSegundos(Horas, Minutos,Segundos)
        totalDeSegundos.push(valor)
        console.log(totalDeSegundos, 'totaldesegundos')
    }
    // soma os segundos
    let segundosTotal = subtraiSegundos(totalDeSegundos)

    // transforma os segundos em horas
    let totalTempo = segundosParaHoras(segundosTotal)

    return totalTempo
}

module.exports = tempoTrabalhado