// CONFIGURAÇÃO DO RELÓGIO
const iniciarContagem = document.querySelector('.confirmar-entrada')

var id = null

// TEMPORIZADOR RESPONSÁVEL POR CONTAR O TEMPO 
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

/* Guarda os dados de entrada e saída */

const entrada = document.getElementById('item-entrada');
const saida = document.getElementById('item-saida')
const confirmarEntrada = document.querySelector('.confirmar-entrada');
const voltar = document.querySelector('.button-voltar')

//Ao iniciar a página 
entrada.style.display = 'block'
saida.style.display = 'none'

//PEGA OS HORÁRIO DE ENTRADA DO USER E GUARDA 
entrada.addEventListener('click', (event)=>{
    localStorage.setItem('horaEntrada',cronometro.value)  
})

//PEGA OS HORÁRIO DE SAÍDA DO USER E GUARDA, TAMBÉM ENVIA OS DADOS PARA O CONTROLLER ASSIM QUE É DADA A SAÍDA 
saida.addEventListener('click', ()=>{
    localStorage.setItem('horaSaida',cronometro.value) 

        
    let horaEntradaResgatarValor = localStorage.getItem('horaEntrada')
    let horaSaidaResgatarValor  = localStorage.getItem('horaSaida')

    // TEXT AREA
    const descricao = document.getElementById('descricao').value

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

})
//Função responsável por dizer se o user já deu entrada ou saída, para que assim fique disponível um dos dois bottões
setInterval(function() {

    if(localStorage.getItem('horaEntrada') == null){
        entrada.style.display = 'block'
        saida.style.display = 'none'
    }
    else{
        entrada.style.display = 'none'
        saida.style.display = 'block'
    }
}, 1000);