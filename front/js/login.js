/*const { Socket } = require("socket.io");

let form = document.getElementById('loginForm');
let input = document.getElementById('username');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    logger.sendLogin(input.value);

});*/
const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const joinGameBtn = document.getElementById('joinGame')
const userNameInput = document.getElementById('usernameInput')

joinGameBtn.addEventListener('click', joinGame);

function joinGame(){
    const username = userNameInput.value;
    if(username){
        init();
        console.log(username);
        socket.emit('username',username);
    }
    else {
        window.alert('Veuillez entrer un pseudo');
        return;
    }
}

function resetMenu(){
    initialScreen.style.display = 'block';
    gameScreen.style.display ='none' ;
}
function init(){
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

}