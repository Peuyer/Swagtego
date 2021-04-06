const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const joinGameBtn = document.getElementById('joinGame')
const userNameInput = document.getElementById('usernameInput')



joinGameBtn.addEventListener('click', joinGame);

function joinGame(){
    clickAudio()
    const username = userNameInput.value;
    if(username){
        init();
        console.log(username);
        socket.emit('username',username,playerNum);
        socket.emit('bddUsername',username);
        socket.on('retourBddUsername',(newAcc)=>{

            socket.emit('getEloPlayer',username,playerNum);

        });

    }
    else {
        window.alert('Veuillez entrer un pseudo');
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