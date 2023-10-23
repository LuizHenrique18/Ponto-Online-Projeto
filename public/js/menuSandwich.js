let buttaoSandwich = document.querySelector('.buttao-sandwich')
let menuSandwich = document.querySelector('.menu-sandwich')

buttaoSandwich.addEventListener('click', function(){
        //Responsável por fazer com que o menu nos dispositivos móveis, apareça e desapareça
        document.addEventListener('click', function(event){
            if(buttaoSandwich.contains(event.target)) {
                menuSandwich.style.display = 'flex';
                buttaoSandwich.style.display = 'none';
            }
            if(!menuSandwich.contains(event.target) && !buttaoSandwich.contains(event.target)){
                menuSandwich.style.display = 'none'
                buttaoSandwich.style.display = 'flex'
            }
            
        })
})



