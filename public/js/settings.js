// Faz aquele circulo enquanto a page está carregando para iniciar a contagem do horário

const carregador = document.querySelector('.loader')

function iniciarCarregamento() {
    carregador.style.display = 'block';
    }
    
    // Quando o carregamento da parte específica estiver concluído
  function concluirCarregamento() {
    carregador.style.display = 'none';
}


const pagePonto = document.getElementById('page-pontos')
pagePonto.style.display = 'none'
setTimeout(()=>{
    pagePonto.style.display = 'flex'
    concluirCarregamento()
}, 1000)

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

localStorage.removeItem('horaEntrada');


let horaEntradaResgatarValor = null
let horaSaidaResgatarValor = null

//PEGA OS HORÁRIO DE ENTRADA DO USER E GUARDA 
if(entrada == null){
    console.log('espere')
}else{
    entrada.addEventListener('click', ()=>{
        let tempoDeEntrada = cronometro.value
        console.log(tempoDeEntrada, 'tempo de entrada aqui')
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


            /* FOTO */
                let divPonto = document.querySelector('.bater-ponto')    
                let divVideo = document.querySelector('.div-video')

                let cam = document.querySelector('#tirar-foto')
                let canvas = document.getElementById('canvas')
                let clique = document.getElementById('cliqueaqui')
                let parar = document.getElementById('pararCamera')

                let enviar = document.getElementById('enviar')
                let novaFoto = document.getElementById('novafoto')

                //Botões
                enviar.style.display = 'none'
                novaFoto.style.display = 'none'

                divPonto.style.display = 'none'
                canvas.style.display = 'none'
                divVideo.style.display = 'flex'
                
                cam.addEventListener('click',()=>{
                    console.log('Aqui')
                })
                
                //Gravar
                navigator.mediaDevices.getUserMedia({video:true})
                .then((scream)=>{
                    cam.srcObject = scream
                    cam.play()
                })
                .catch((err)=>{
                    console.log(err)
                })

                //Tirar Foto
                clique.addEventListener('click', ()=>{
                    canvas.style.display = 'block'
                    canvas.height = cam.videoHeight
                    canvas.width = cam.videoWidth
                    let context = canvas.getContext('2d')
                    
                    context.drawImage(cam, 0, 0)
                    cam.style.display = 'none'
                    cam.srcObject.getTracks().forEach(track => {
                        track.stop()
                    })
                    
                    console.log('Deu certo')
                    parar.style.display = 'none'
                    clique.style.display = 'none'
                    enviar.style.display = 'flex'
                    novaFoto.style.display = 'flex'
                })
                //Parar Camera
                parar.addEventListener('click', ()=>{
                    cam.srcObject.getTracks().forEach(track => {
                        track.stop()
                    })
                    divVideo.style.display = 'none'
                    canvas.style.display = 'none'

                    divPonto.style.display = 'flex'
                    localStorage.removeItem('horaEntrada');

                })
            
                novaFoto.addEventListener('click',()=>{
                    canvas.style.display = 'none'
                    cam.style.display = 'block'
                    console.log('AQUI') 
                    navigator.mediaDevices.getUserMedia({video:true})
                    .then((scream)=>{
                        cam.srcObject = scream
                        cam.play()
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                    parar.style.display = 'flex'
                    clique.style.display = 'flex'
                    enviar.style.display = 'none'
                    novaFoto.style.display = 'none'

                })

                enviar.addEventListener('click', ()=>{
                        let acessoEntrada = localStorage.getItem('horaEntrada');
                        if(acessoEntrada === null){
                            localStorage.setItem('horaEntrada',tempoDeEntrada); 
                            let horaEntradaResgatarValor = tempoDeEntrada;
                            let dataImage = canvas.toDataURL()
                            let dadosPonto = {pontoEntrada:horaEntradaResgatarValor, data:dataValida, image:dataImage}
    
                            
                            fetch('/pontoEntradaPost', {
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                body:JSON.stringify({dados:dadosPonto})
                                
                            })
                            .then(()=>{
                                console.log('Dados Enviados com sucesso')
                                console.log(dataImage)
                                location.reload();
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                        }else{
                            console.log('Espere a solicitação ser completada')
                        }
                    })

                horaEntradaResgatarValor = cronometro.value
                horaSaidaResgatarValor =  null
                // Dados que serão enviados
                //Enviando dados
                
            

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

    // TEXT AREA

    let dadosPontoSaida = {horaSaida:horaSaidaResgatarValor, data:dataValida, entrada:horaEntradaResgatarValor}

    localStorage.removeItem('horaEntrada');
    localStorage.removeItem('horaSaida');
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
})




