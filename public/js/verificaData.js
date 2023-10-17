//FUNCTION USADA PARA VERIFICAR E TRANSFORMAR DE NOME PARA NÚMERO PARA FACILITAR VERIFICAÇÃO
function verificaData(data){
    if(data == 'Jan'){
        return '01';
    }
    else if(data == 'Feb'){
        return '02';
    }
    else if(data == 'Mar'){
        return '03';
    }
    else if(data == 'Apr'){
        return '04';
    }
    else if(data == 'May'){
        return '05';
    }
    else if(data == 'Jun'){
        return '06';
    }
    else if(data == 'Jul'){
        return '07';
    }
    else if(data == 'Aug'){
        return '08';
    }
    else if(data == 'Sep'){
        return '09';
    }
    else if(data == 'Oct'){
        return '10';
    }
    else if(data == 'Nov'){
        return '11';
    }
    else if(data == 'Dec'){
        return '12';
    }
    else{
        return 'erro verifica data'
    }
    
}

module.exports = verificaData;