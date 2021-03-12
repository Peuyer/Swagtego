const infoDisplay = document.querySelector('#info')
const startButton = document.querySelector('#start')
let currentPlayer = 'user'
let gameMode = ""
let playerNum = 0
let ready = false
let enemyReady = false
let allPawnsPlaced = false
let shotFired = -1


// Avertis socket io de l'arrivée dans le chat d'un user
const socket = io();

 // Get your player number
 socket.on('player-number', num => {
    if (num === -1) {
      infoDisplay.innerHTML = "Sorry, the server is full"
    } else {
      playerNum = parseInt(num)
      if(playerNum === 1) currentPlayer = "enemy"

      console.log(playerNum)

      // Get other player status
      socket.emit('check-players')
    }
  })

    // Another player has connected or disconnected
    socket.on('player-connection', num => {
        console.log(`Player number ${num} has connected or disconnected`);
        playerConnectedOrDisconnected(num);
    });

    // Ready button click
    startButton.addEventListener('click', () => {
        if(board.isCompleted(playerNum)) playGameMulti(socket)
        else infoDisplay.innerHTML = "Please place all pawns"
      })




    function playerConnectedOrDisconnected(num) {
        let player = `.p${parseInt(num) + 1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green');
        if(parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold';
      }
    












/*
socket.emit('login', '');

// Affichage d'un message
socket.on('new-message', msg => {
    let item = document.createElement('p');
    item.textContent = msg;
    pseudo.appendChild(item);
});

socket.on('gamestate', handleGameState);

function handleGameState(gameState){
    gamestate = JSON.parse(gameState);
    requestAnimationFrame(()=> paintGame(gameState));
}*/
