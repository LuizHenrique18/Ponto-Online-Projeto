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

    //Transforma o horário para o fuso de São Paulo
    let options = {timeZone:'America/Sao_Paulo', hour:'numeric', minute:'numeric', second:'numeric'}
    let formatado = new Intl.DateTimeFormat('pt-BR', options);
    let tempoFormatado = formatado.format(dataAtual);


    let horasFormat =String(tempoFormatado).slice('0','2') 
    let minutosFormat = String(tempoFormatado).slice('3','5')  
    let segundosFormat =String(tempoFormatado).slice('6','8')   

    cronometro.value = `${horasFormat}:${minutosFormat}:${segundosFormat}`
    
    let tempo = {
        horas:contagemHoras,
        minutos:contagemMinutos,
        segundos:contagemSegundos
    }
    console.log('Ta contando aqui')
    return tempo
}
window.addEventListener('DOMContentLoaded', ()=>{
    setInterval(contador, 1000)
})

// BUTTON DE ENTRADA E SAÍDA
const form = document.getElementById('form-ponto')

/* Guarda os dados de entrada e saída */

const entrada = document.getElementById('item-entrada');
const saida = document.getElementById('item-saida')
const confirmarEntrada = document.querySelector('.confirmar-entrada');
const voltar = document.querySelector('.button-voltar')



let horaEntradaResgatarValor = null
let horaSaidaResgatarValor = null

//PEGA OS HORÁRIO DE ENTRADA DO USER E GUARDA 
if(entrada == null){
    console.log('espere')
}else{
    entrada.addEventListener('click', ()=>{
        // Setar data atual do usuário durante o evento de clique no botão de entrada
        const dataAtual = new Date    
        let options = {timeZone:'America/Sao_Paulo', year:'numeric', month:'numeric', day:'numeric'}
        let formatado = new Intl.DateTimeFormat('pt-BR', options);
        let dataFormatada = formatado.format(dataAtual);
        //Formatando data para ficar de forma padrão
        let dia  =String(dataFormatada).slice('0','2') 
        let mes = String(dataFormatada).slice('3','5')  
        let ano =String(dataFormatada).slice('6','10')  

        let dataValida = `${dia}/${mes}/${ano}`;

        //Guardando data na memória do user para ser usado como comparação quando o user for dar saída
        localStorage.setItem('entradaTempoFormatado', dataFormatada)

        localStorage.setItem('horaEntrada',cronometro.value)  
        horaEntradaResgatarValor = cronometro.value
        horaSaidaResgatarValor =  null
        // Dados que serão enviados
        let dadosPonto = {pontoEntrada:horaEntradaResgatarValor, data:dataValida}
        //Enviando dados
        fetch('/pontoEntradaPost', {
            method:'POST',headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({dados:dadosPonto})
            
        })
        .then(()=>{
            console.log('dados enviados com sucesso')
            location.reload();
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}
//PEGA OS HORÁRIO DE SAÍDA DO USER E GUARDA, TAMBÉM ENVIA OS DADOS PARA O CONTROLLER ASSIM QUE É DADA A SAÍDA 
saida.addEventListener('click', ()=>{
    // Setar data atual do usuário durante o evento de clique no botão de entrada
    const dataAtual = new Date;
    let options = {timeZone:'America/Sao_Paulo', year:'numeric', month:'numeric', day:'numeric'};
    let formatado = new Intl.DateTimeFormat('pt-BR', options);
    let dataFormatada = formatado.format(dataAtual);

    //Formatando data para ficar de forma padrão
    let dia  =String(dataFormatada).slice('0','2'); 
    let mes = String(dataFormatada).slice('3','5');
    let ano =String(dataFormatada).slice('6','10');

    let dataValida = `${dia}/${mes}/${ano}`;
    localStorage.setItem('horaSaida',cronometro.value);

        
    horaEntradaResgatarValor = localStorage.getItem('horaEntrada');
    horaSaidaResgatarValor  = localStorage.getItem('horaSaida');
    console.log(horaSaidaResgatarValor, 'horasaidaa');

    // TEXT AREA

    console.log(horaEntradaResgatarValor, horaSaidaResgatarValor)
    let dadosPontoSaida = {horaSaida:horaSaidaResgatarValor, data:dataValida, entrada:horaEntradaResgatarValor}


    fetch('/pontoEntrada',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({dados:dadosPontoSaida})
    })
    .then(() => {
        location.reload();
    })
    .catch(error => {
    console.error('Erro ao enviar os dados para o servidor:', error);
    });

    localStorage.removeItem('horaEntrada');
    localStorage.removeItem('horaSaida');
})
