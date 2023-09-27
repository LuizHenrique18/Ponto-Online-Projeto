function somaSegundos(dados){
    let somador = 0
    let valor 
    for(let i=0;i<dados.length;i++){
        valor = parseInt(dados[i])
        somador = somador + valor
    }
    return somador
}

module.exports = somaSegundos