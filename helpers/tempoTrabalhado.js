const horasParaSegundos = require('./horasParaSegundos')
const somaSegundos = require('./somaSegundos')
const segundosParaHoras = require('./segundosParaHoras')

//FUNCTION RESPONSÁVEL POR SOMAR O TEMPO TRABALHADO
function tempoTrabalhado(dados){
    let totalDeSegundos = []

    // FOR PARA TRANSFORMAS AS HORAS PARA SEGUNDOS E ADICIONÁ-LAS AO ARRAY
    for(let i=0;i<dados.length;i++){
        //dados que venho do controller para somar o tempo trabalhado
        let tempoTrabalhado = dados[i].tempoDeTrabalho

        let Horas = tempoTrabalhado.slice('0', '2')
        let Minutos = tempoTrabalhado.slice('3', '5')
        let Segundos = tempoTrabalhado.slice('6', '8')

        // transforma horas para segundos
        let valor = horasParaSegundos(Horas, Minutos,Segundos)
        totalDeSegundos.push(valor)
    }
    // soma os segundos
    let segundosTotal = somaSegundos(totalDeSegundos)

    // transforma os segundos em horas
    let totalTempo = segundosParaHoras(segundosTotal)

    return totalTempo
}

module.exports = tempoTrabalhado