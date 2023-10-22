function somaSegundos(dados){
    console.log('Vendo como chegam os dados', dados)
    let valorr = dados[0]
    let valorrr = dados[1]

    console.log(valorrr, valorr)
    let comparador = valorrr - valorr
    console.log(comparador)

    return comparador
}

module.exports = somaSegundos