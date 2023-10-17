//REGISTER - INSERINDO DADOS DOS USUÁRIOS
const inputCPf = document.getElementById('cpf')
const buttonInput = document.getElementById('submit-button-register')

//Impede que o user digite caracteres não numéricos dentro do input acima
inputCPf.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    const valorNumerico = inputValue.replace(/\D/g, ''); // Remove todos os não dígitos
    
    if (inputValue !== valorNumerico) {
        // Se o valor atual não for igual ao valor após remover caracteres não numéricos
        event.target.value = valorNumerico;
    }
});