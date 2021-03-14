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
    init();
    const username = userNameInput.value;
    console.log(username);
    socket.emit('username',username);  
}

function resetMenu(){
    initialScreen.style.display = 'block';
    gameScreen.style.display ='none' ;
}
function init(){
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    DisplayBoard(board);
}