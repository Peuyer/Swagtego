const infoDisplay = document.querySelector('#info')
const startButton = document.querySelector('#start')
const turnDisplay = document.querySelector('#whose-go')
const randomButton = document.querySelector('#random')
const clearButton = document.querySelector('#clear')
const pawnContainer = document.querySelector('#pawn-container')
const buttons = document.querySelector(".Random-Composition")
const pawns = document.querySelector("#pawnPlaceholder")

let currentPlayer = 'user'
let playerNum = 0
let ready = false
let enemyReady = false
let view = []
let count = []
let winner = -1
const max= []
max[0] = 1
max[1] = 1
max[2] = 8
max[3] = 5
max[4] = 4
max[5] = 4
max[6] = 4
max[7] = 3
max[8] = 2
max[9] = 1
max[10] = 1
max[11] = 6

// Warns socket io that a user connected
const socket = io();

// Get your player number
socket.on('player-number', num => {
    if (num === -1) {
        infoDisplay.innerHTML = "Sorry, the server is full";
        startButton.style.display = 'none';
        turnDisplay.style.display = 'none';
        randomButton.style.display = 'none';
    } 
    else {
    playerNum = parseInt(num)
    if(playerNum === 1) currentPlayer = "enemy"

    console.log(playerNum)

    // Get other player status
    socket.emit('check-players')
    }
});

// Initialize the view object to print the board
socket.on('init-view',(board)=>{
    view[0] = new View(board, playerNum);
});
// Receives the updated view
socket.on('view-updated',(board)=>{
    view[0].setGame(board);
    afficheBoard(playerNum);
});


// Receives the id of the winner if there's one
socket.on('has-winner', (winner)=>{
    if(winner != -1){
        console.log('Le joueur', winner, 'a gagné la partie');
    }
    else return
});

socket.on('hasPlayed',(player)=>{
    if(player==playerNum){
        currentPlayer='ennemy';
        turnDisplay.innerHTML = "Au tour de l'ennemi !";
    }
    else{
        currentPlayer = 'user';
    }
    playGameMulti(socket);
});

////////////////////////////////////////////////////////////////////    

// Another player has connected 
socket.on('player-connection', num => {
    console.log(`Player ${num} has connected.`);
    playerConnectedOrDisconnected(num);
});

// Another player has disconnected 
socket.on('player-disconnection', num => {
    console.log(`Player ${num} has disconnected.`);
    playerConnectedOrDisconnected(num);
    playerReady(num);
    turnDisplay.innerHTML = 'Placement des pions';
    ready = false;
    enemyReady = false;
    if(num == 0){
        playerReady(1);
        //playerConnectedOrDisconnected(1);
    }
    else{
        playerReady(0);
        //playerConnectedOrDisconnected(1);
    }
    
});

// On enemy ready
socket.on('enemy-ready', num => {
    enemyReady = true;
    playerReady(num);
    if (ready){
        playGameMulti(socket);
    }
});


// Check player status
socket.on('check-players', players => {
    players.forEach((p, i) => {
    if(p.connected) {
        playerConnectedOrDisconnected(i);
    }
    if(p.ready) {
        //playerReady(i);
        if(i !== playerReady){
            enemyReady = true;
        }
    }
    });

});


////////////////////////////////////////////////////////

//Display player usernames
socket.on("username-display",usernames=>{
    document.getElementById("player1").innerHTML = usernames[0];
    document.getElementById("player2").innerHTML = usernames[1];
});
socket.on('gameStarted',()=>{
    enemyReady = true;
    ready = true; 
    console.log('ouai je suis LAAAA');
    view[0].attachListeners(playerNum);
    playGameMulti(socket);
});


// Ready button click
startButton.addEventListener('click', () => {
    socket.emit('is-completed',playerNum);
    socket.on('completed',(complete)=>{
        if(complete){
            infoDisplay.innerHTML = "";
            playGameMulti(socket);
        } 
        else infoDisplay.innerHTML = "Placez tous les pions s'il vous plait";

        if(ready && enemyReady){
            console.log('ouai je suis LAAAA');
            view[0].attachListeners(playerNum);
            socket.emit('gameStart');
        }
    });
});

// Random button click
randomButton.addEventListener('click', () => {
    console.log("(Re)Génération d'une composition complète aléatoire")
    socket.emit('generate-comp',playerNum);
    //socket.emit('update-count',playerNum);
    afficheBoard(playerNum);     
    pawnContainer.style.display = 'none';    
    return;
});

//clear button click
clearButton.addEventListener('click', () => {
    console.log("Suppression de tous vos pions")
    socket.emit('clear',playerNum);
    pawnContainer.style.display = 'flex';    
    view[0].initPawns();
    return;
});


//////////////////////////////////////////////////////////////////  

// Prints the board on the clients page from his point view
function afficheBoard(playerIndex){
    view[0].DisplayBoard(playerIndex);
}

// Game Logic for MultiPlayer
function playGameMulti(socket) {    
    buttons.style.display = 'none';
    pawns.style.display = 'none';
    if(!ready) {
        socket.emit('player-ready');
        ready = true;
        playerReady(playerNum);
    }
    if(enemyReady) {   
        console.log(currentPlayer)
        
        if(currentPlayer === 'user') {
            turnDisplay.innerHTML = 'A ton tour !';
        }
        if(currentPlayer === 'enemy') {
            turnDisplay.innerHTML = "Au tour de l'ennemi !";
        }
    }
}

// Places a pawn on the board
function placePawn(id,value){
    let x=((value-1)%10);
    let y=Math.ceil(value/10)-1;
    console.log(x,y);
    let data= Array(4);
    data[0] = playerNum;
    data[1] = x;
    data[2] = y;
    data[3] = id;
    socket.emit('placing-pawn',data);
    let info = {id:playerNum,p:id};
    socket.emit('pawn-count',info);
    let i = 0;
    socket.on('pawn-counted',(counter)=>{
        if(!i){
            count[id] = counter;
            console.log(counter);
            console.log(count[id],"/",max[id]);
            if (count[id] < max[id]){
                view[0].addPawn(id);
            }
            i++;
        }
    });
}


// Updates the ready status dot colors
function playerReady(num) {
    let player = `.p${parseInt(num) + 1}`
    document.querySelector(`${player} .ready span`).classList.toggle('green')
}
// Updates connection status dot colors
function playerConnectedOrDisconnected(num) {
    let player = `.p${parseInt(num) + 1}`
    document.querySelector(`${player} .connected span`).classList.toggle('green');
    if(parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold';
}