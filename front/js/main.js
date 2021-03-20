const infoDisplay = document.querySelector('#info')
const startButton = document.querySelector('#start')
const turnDisplay = document.querySelector('#whose-go')
const randomButton = document.querySelector('#random')
const clearButton = document.querySelector('#clear')
const pawnContainer = document.querySelector('#pawn-container')




let currentPlayer = 'user'
let gameMode = ""
let playerNum = 0
let ready = false
let enemyReady = false
let view = [];
let count = [];
const max= [];
var moveList =[];

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


    socket.on('init-view',(board)=>{
        view[0] = new View(board, playerNum);
    });
    socket.on('view-updated',(board)=>{
        view[0].setGame(board);
        afficheBoard(playerNum);
    });

    socket.on('pawn-count',(counter)=>{
        count = counter;
    });

    socket.on('get-max',(maxi)=>{
        max = maxi;
    });

    socket.on('send-list',(list) => {
        moveList = list;
        console.log(list);
    });




////////////////////////////////////////////////////////////////////    

    // Another player has connected 
    socket.on('player-connection', num => {
        console.log(`Player ${num} has connected.`);
        playerConnectedOrDisconnected(num);
        //playerReady(num);
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
        if (ready) playGameMulti(socket);
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


    // Ready button click
    startButton.addEventListener('click', () => {
        socket.emit('is-completed',playerNum);
        socket.on('completed',(complete)=>{
            if(complete){
                //infoDisplay.innerHTML = "";
                playGameMulti(socket);
            } 
            else infoDisplay.innerHTML = "Placez tous les pions s'il vous plait";
        });
    });

    // Random button click
    randomButton.addEventListener('click', () => {
        console.log("(Re)Génération d'une composition complète aléatoire")
        socket.emit('generate-comp',playerNum);
        socket.emit('update-count',playerNum);
        afficheBoard(playerNum);     
        pawnContainer.style.display = 'none';    
        return;
    });

    //clear button click
    clearButton.addEventListener('click', () => {
        console.log("Suppression de tous vos pions")
        socket.emit('clear',playerNum);
        pawnContainer.style.display = 'flex';    
        return;
    });


//////////////////////////////////////////////////////////////////
    function afficheBoard(playerIndex){
        view[0].DisplayBoard(playerIndex);
    }

    // Game Logic for MultiPlayer
    function playGameMulti(socket) {    
        if(!ready) {
            socket.emit('player-ready');
            ready = true;
            playerReady(playerNum);
        }
        if(enemyReady) {
            if(currentPlayer === 'user') {
              turnDisplay.innerHTML = 'A ton tour !';
            }
            if(currentPlayer === 'enemy') {
              turnDisplay.innerHTML = "Au tour de l'ennemi !";
            }
        }
    }
    function placePawn(id,value){
        let x=((value-1)%10);
        let y=Math.ceil(value/10)-1;
        let data= Array(4);
        data[0] = playerNum;
        data[1] = x;
        data[2] = y;
        data[3] = id;
        socket.emit('placing-pawn',data);
    }

    function playerReady(num) {
        let player = `.p${parseInt(num) + 1}`
        document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    function playerConnectedOrDisconnected(num) {
        let player = `.p${parseInt(num) + 1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green');
        if(parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold';
      }

    function getList(x,y){
        console.log("pdpd");
        let coord = new Array(2);
        let list = [];
        coord[0]= x;
        coord[1]= y;
        socket.emit('get-list',(coord));
	    return moveList;


        
    }