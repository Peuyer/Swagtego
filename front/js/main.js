const infoDisplay = document.querySelector('#info')
const startButton = document.querySelector('#start')
const turnDisplay = document.querySelector('#whose-go')
const randomButton = document.querySelector('#random')
const clearButton = document.querySelector('#clear')
const pawnContainer = document.querySelector('#pawn-container')
const buttons = document.querySelector(".Random-Composition")
const pawns = document.querySelector("#pawnPlaceholder")
const con = {};

socket.emit('get-con');
socket.on('con',conn=>{

     con = conn;
     console.log(con);
});

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

let start =0;
let end = 0;

// Warns socket io that a user connected
const socket = io();

// Get your player number
socket.on('player-number', num => {
    if (num === -1) {
        infoDisplay.innerHTML = "Sorry, the server is full";
        startButton.style.display = 'none';
        turnDisplay.style.display = 'none';
        randomButton.style.display = 'none';
        buttons.style.display = 'none';
        pawns.style.display = 'none';
        pawnContainer.style.display='none';
    
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

socket.on('last-move', (coord)=>{
    console.log('im here')
    let xsrc = coord.xsrc
    let ysrc = coord.ysrc
    let x = coord.x;
    let y = coord.y;
    view[0].glow(xsrc,ysrc,x,y);
    
});

// Receives the id of the winner if there's one
socket.on('has-winner', (winner)=>{
    if(winner != -1){
        console.log('Le joueur', winner, 'a gagné la partie');
        displayWin(winner);
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
    console.log('player', num,'has disconnected');
    playerConnectedOrDisconnected(num);
    turnDisplay.innerHTML = 'Placement des pions';
    
    let me = num;
    let him
    if(num == 0){
        him = 1;
    }
    else him =0;

    if(ready == false && enemyReady == true){
        console.log("1");
        playerReady(me);
    }
    else if(ready == true && enemyReady == false){
        console.log("2");
        playerReady(him);
    }
    else if(ready == false && enemyReady == false){
        console.log("3");
    }
    else if(ready == true && enemyReady == true){
        console.log("4");
        playerReady(me);
        playerReady(him);
    }
    buttons.style.display = 'block';
    pawns.style.display = 'block';
    pawnContainer.style.display='flex';

    ready = false;
    enemyReady = false;
});



// On enemy ready
socket.on('enemy-ready', num => {
    enemyReady = true;
    playerReady(num);
    console.log('jsp', ready);
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
    console.log('Début de la partie');
    view[0].attachListeners(playerNum);
    playGameMulti(socket);
    startTimer();
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
            console.log('Début de la partie');
            view[0].attachListeners(playerNum);
            socket.emit('gameStart');
            startTimer();
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

function startTimer(){
    start = Date.now();
    console.log(start);
}
function stopTimer(){
    end = Date.now()-start;
    console.log(end);
}
function toHour(time){
    string='';
    let h=0,m=0,s=0;
    time = Math.floor(time/1000)
    s=time;
    while (s > 3600){
        h++;
        s-=3600;
    }
    while (s > 60){
        m++;
        s-=60;
    }
    if (h != 0){
        string += h.toString() + ' heure' + (h>1?'s, ': ', ');
    }
    if (m != 0){
        string += m.toString() + ' minute' + (m>1?'s et ': ' et ');
    }
    string += s.toString() + ' secondes';
    return string;
}
function eloCalc (ratingPlayer,ratingOpponent,gameResult){

    let Kfactor = 20;

    con.connect(err=> {
        if (err) throw err;
        else console.log('connexion éffectuée')

        let sql= 'SELECT `wins` + `losses` FROM `swagtego`.`comptes` WHERE `username`= '+usernamePlayer+'';
 
        con.query(sql, (err,WinsAndLossesPlayer)=>{
            if (err) throw err;

            console.log('Nb of matches = '+WinsAndLossesPlayer[0]);

            if(WinsAndLossesPlayer < 10) Kfactor = 100;
            else if(WinsAndLossesPlayer < 20) Kfactor = 50;

            let Elodiff = ratingPlayer - ratingOpponent;
            if (Elodiff > 400) Elodiff = 400;
            let winProb = 1/(1+Math.pow(10,-Elodiff/400));
            return (Math.round(ratingPlayer + Kfactor*(gameResult - winProb)));
            
        });   
    });
}

function updateRating(usernamePlayer,usernameOpponent,gameResult){
    
    let resultNumberPlayer, resultNumberOpponent;

    if (gameResult == 'win'){
        resultNumberPlayer = 1;
        resultNumberOpponent = 0;

    }
    else{
        resultNumberPlayer = 0;
        resultNumberOpponent = 1;
    }

    con.connect(err=> {
        if (err) throw err;
        else console.log('connexion éffectuée')

        let sql= 'SELECT `rating` FROM `comptes` WHERE `username` = '+usernamePlayer+'';
 
        con.query(sql, (err,ratingPlayer) =>{
            if (err) throw err;
            console.log('rating'+usernamePlayer+' = '+ratingPlayer[0]);
        });

        sql= 'SELECT `rating` FROM `comptes` WHERE `username` = '+usernameOpponent+'';
        con.query(sql, (err,ratingOpponent)=>{
            if (err) throw err;
            console.log('rating'+usernameOpponent+' = '+ratingOpponent[0]);
        });

        let NewPlayerElo = eloCalc(ratingPlayer[0],ratingOpponent[0],resultNumberPlayer);
        let NewOpponentElo = eloCalc(ratingOpponent[0],ratingPlayer[0],resultNumberOpponent);

        sql= 'UPDATE `comptes`SET `rating` = '+NewPlayerElo+' WHERE `username` = '+usernamePlayer+'';
        con.query(sql,(err,UpdatePlayer)=>{
            if (err) throw err;
            console.log('UPDATE Player effectuée');
        });

        sql= 'UPDATE `comptes`SET `rating` = '+NewOpponentElo+' WHERE `username` = '+usernameOpponent+'';
        con.query(sql, (err,UpdateOpponent)=>{
            if (err) throw err;
            console.log('UPDATE Opponent effectuée');
        });

    });

}