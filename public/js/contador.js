function contador(tempo1 , tempo2){

    let valor1 = tempo1
    let valor2 = tempo2

        let valor1Segundos = valor1.slice('0', '2')
        let valor1Minutos = valor1.slice('3', '5')
        let valor1Horas = valor1.slice('6', '8')
        let teste1 = [
            valor1Segundos,
            valor1Minutos,
            valor1Horas
        ]
        console.log('Teste1' ,teste1)
        let valor2Segundos = valor2.slice('0', '2')
        let valor2Minutos = valor2.slice('3', '5')
        let valor2Horas = valor2.slice('6', '8')

        let teste2 = [
            valor2Segundos,
            valor2Minutos,
            valor2Horas
        ]
        console.log('Teste2' ,teste2)


        let segundos1 = parseInt(valor1Segundos)
        let minutos1 = parseInt(valor1Minutos)
        let horas1 = parseInt(valor1Horas)

        let teste3 = [
            horas1,
            minutos1,
            segundos1
        ]
        console.log('Teste3' ,teste3)

        let segundos2 = parseInt(valor2Segundos)
        let minutos2 = parseInt(valor2Minutos)
        let horas2 = parseInt(valor2Horas)
    
        let teste4 = [
            horas2,
            minutos2,
            segundos2
        ]

        console.log('Teste4' ,teste4)


        let comparadorSegundos = segundos2 - segundos1
        let comparadorMinutos = minutos2 - minutos1
        let comparadorHoras = horas2 - horas1
        console.log('Ultimo teste:', comparadorHoras, comparadorMinutos, comparadorSegundos)

        if(segundos1<segundos2){
            comparadorSegundos = segundos2 - segundos1
        }else if(segundos2<segundos1){
            comparadorSegundos = segundos1 - segundos2
        }else{
            comparadorSegundos= 0
        }

        if(minutos1<minutos2){
            comparadorMinutos = minutos2 - minutos1
        }else if(minutos2<minutos1){
            comparadorMinutos = minutos1 - minutos2
        }else{
            comparadorMinutos= 0
        }

        if(horas1<horas2){
            comparadorHoras = horas2 - horas1
        }else if(horas2<horas1){
            comparadorHoras = horas1 - horas2
        }else{
            comparadorHoras= 0
        }

    if(comparadorSegundos > 59){
        console.log('contadorSegundos', comparadorSegundos)
        comparadorSegundos = comparadorSegundos - 60
        comparadorMinutos++
    }
    if(comparadorMinutos>59){
        console.log('contadorMinutos', comparadorMinutos)
        comparadorMinutos = comparadorMinutos - 60
        comparadorHoras++
        console.log('comparadorHoras')
    }
    
    let segundosFormatados = String(comparadorSegundos).padStart('2', 0)
    let minutosFormatados = String(comparadorMinutos).padStart('2', 0)
    let horasFormatadas = String(comparadorHoras).padStart('2',0)

    let time = `${segundosFormatados}:${minutosFormatados}:${horasFormatadas}`
    console.log('timer>>> ',time)
    return time
}

module.exports = contador