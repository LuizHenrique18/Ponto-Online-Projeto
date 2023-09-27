// BATER PONTO - CONFIRMAÇÃO

const entrada = document.getElementById('item-entrada');
const saida = document.getElementById('item-saida')
const confirmarEntrada = document.querySelector('.confirmar-entrada');
const voltar = document.querySelector('.button-voltar')

saida.addEventListener('click', ()=>{
    confirmarEntrada.style.display = 'flex';
    console.log("worlk");
})
console.log('conectado está')
/*
voltar.addEventListener('click', ()=>{
    confirmarEntrada.style.display = "none";
})
*/
// CONFIGURAÇÃO DO RELÓGIO
const iniciarContagem = document.querySelector('.confirmar-entrada')

var id = null


// CRONOMETRO CONFIGURAÇÃO

let contagemSegundos = 0;
let contagemMinutos = 0; 
let contagemHoras = 0;
const cronometro = document.querySelector('.timeData')

function contador(){
    contagemSegundos++
    if(contagemSegundos>59){
        contagemMinutos++
        contagemSegundos = 0;
        if(contagemMinutos>59){
            contagemHoras++
            contagemMinutos=0;
        }
    }
    const dataAtual = new Date

    let horasFormat =String(dataAtual.getHours()).padStart('2',0) 
    let minutosFormat = String(dataAtual.getMinutes()).padStart('2',0)  
    let segundosFormat =String(dataAtual.getSeconds()).padStart('2',0)  

    cronometro.value = `${horasFormat}:${minutosFormat}:${segundosFormat}`
    
    let tempo = {
        horas:contagemHoras,
        minutos:contagemMinutos,
        segundos:contagemSegundos
    }

    return tempo
}
setInterval(contador, 1000)

// BUTTON DE ENTRADA E SAÍDA
const form = document.getElementById('form-ponto')

// GUARDA O HORÁRIO DE ENTRADA ATÉ QUE O PONTO DE SAÍDA TENHA SIDO BATIDO
// PARA QUE SEJA ADICIONADOS OS DE SAÍDA E ENTRADA AO MESMO TEMPO

entrada.addEventListener('click', (event)=>{
    console.log('olá baby')

    event.preventDefault()
    localStorage.setItem('horaEntrada',cronometro.value)  
})

saida.addEventListener('click', ()=>{
    localStorage.setItem('horaSaida',cronometro.value)

    //ENVIAR DADOS PELO POST 

})






iniciarContagem.addEventListener('submit', (event)=>{
    event.preventDefault()

    const horaEntradaResgatarValor = localStorage.getItem('horaEntrada')
    const horaSaidaResgatarValor = localStorage.getItem('horaSaida')

    // TEXT AREA
    const descricao = document.getElementById('descricao').value
    console.log(descricao)

    console.log('LOOK AQUI')
    console.log(horaEntradaResgatarValor, horaSaidaResgatarValor)
    let horaPonto = {horaEntrada:horaEntradaResgatarValor, horaSaida:horaSaidaResgatarValor, descricao:descricao}


    fetch('/pontoEntrada',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(horaPonto)
    })
    .then(responseData => {
        // Faça algo com a resposta do servidor, se necessário
        console.log(responseData, 'deu certo');
    })
    .catch(error => {
    console.error('Erro ao enviar os dados para o servidor:', error);
    });

    localStorage.removeItem('horaEntrada');
    localStorage.removeItem('horaSaida');
    confirmarEntrada.style.display = 'none';

})