function horasParaSegundos(horas, minutos, segundos) {
    let Horas = parseInt(horas)
    let Minutos = parseInt(minutos)
    let Segundos = parseInt(segundos)

    const segundosTotais = ((Horas * 3600) + (Minutos * 60) + Segundos);
    return segundosTotais;
}

module.exports = horasParaSegundos