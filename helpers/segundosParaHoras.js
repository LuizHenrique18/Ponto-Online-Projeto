function segundosParaHoras(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    let segundosFormatados = String(segundosRestantes).padStart('2', 0)
    let minutosFormatados = String(minutos).padStart('2', 0)
    let horasFormatadas = String(horas).padStart('2',0)
    return `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
  }

  module.exports = segundosParaHoras