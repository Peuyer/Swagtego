/**** Import npm libs ****/

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session")({
  // CIR2-chat encode in sha256
  secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false
  }
});
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const mysql = require('mysql');




/**** Import project libs ****/

const Board = require('./back/models/board');
const Pawn = require('./back/models/pawn');
const { emit } = require('process');
let board = new Board();
const usernames = [];

usernames[0] = "Joueur 2";    
usernames[1] = "Joueur 2";


/****** Code ******/

//Set static folder
app.use(express.static((__dirname,"front/html")));
app.use(express.static((__dirname,"front/images")));
app.use(express.static((__dirname,"front")));

//Start serveur
http.listen(4200, ()=>{
    console.log('Serveur lancé sur le port 4200');
});

// Handle a socket connection request from web client
const connections = [null, null];

io.on('connection', (socket) => {
    // Find an available player number
    let playerIndex = -1;
    
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
            break;
        }
    }
    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex);
    
    console.log(`Player ${playerIndex} has connected`);
   
    // Ignore player 3
    if (playerIndex === -1) return;

    connections[playerIndex] = false;
    // Tell eveyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex);

    // Sends the board to init the view
    socket.emit('init-view',board);
    socket.emit('view-updated',board);
    socket.emit('pawn-count',board.counter(playerIndex))

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`Player ${playerIndex} disconnected`);
      connections[playerIndex] = null;
      usernames[playerIndex] = undefined;
      socket.broadcast.emit("username-display",usernames);

      socket.emit('init-view',board);
      //Tell everyone what player number just disconnected
      socket.broadcast.emit('player-disconnection', playerIndex);
      socket.emit('player-disconnection', playerIndex);
      board = new Board();
      socket.broadcast.emit('init-view',board);
      if(playerIndex == 0){
        playerIndex = 1;
      }
      else playerIndex = 0;
      socket.emit('player-number', playerIndex);
      console.log(`Player ${playerIndex} has connected`);
      for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
            break;
        }
      }
      //socket.broadcast.emit('clear-board',board);

    });
    // On Ready
    socket.on('player-ready', () => {
      socket.broadcast.emit('enemy-ready', playerIndex);
      connections[playerIndex] = true;
    });

  //Check player connections
  socket.on('check-players', () => {
    const players = [];
    for (const i in connections) {
      connections[i] === null ? players.push({connected: false, ready: false}) : players.push({connected: true, ready: connections[i]});
    }
    socket.emit('check-players', players);
  });

  //Chek if player is ready
  socket.on('is-completed',(playerNum)=>{
    socket.emit('completed',board.isCompleted(playerNum));
  });

  //Generate a random composition
  socket.on('generate-comp',(playerNum)=>{
    if(!board.isCompleted(playerNum)){
      console.log('Génération...');
      board.randomComposition(playerNum);
    }
    else{
      console.log('Re génération...')
      board.regenerate(playerNum);
    }
    updateView();
  });

  //clear one player side
  socket.on('clear',(playerNum)=>{
    board.clearSide(playerNum);
    updateView();
  });

  //place a pawn
  socket.on('placing-pawn',data=>{
    if (board.board[data[2]][data[1]] == null){
      board.placingPawns(data[0],data[1],data[2],data[3]);
    }
    updateView();
  });

  //Update view
  socket.on('update-view',()=>{
    updateView();
  });

  socket.on('bddUsername',(username)=> {

    const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password : "",
      database : "swagtego"
    });

    con.connect(err=> {
      if (err) throw err;
  
      let sql= 'INSERT IGNORE INTO `comptes`(`username`) VALUE ("'+username+'")';
  
      con.query(sql, (err,newAcc)=>{
          if (err) throw err;
      });
      con.end();
   }); 
  });

  

  socket.on('Elo',(winnerId)=>{
    let usernamePlayer = usernames[winnerId];
    let usernameOpponent = usernames[!winnerId];

    updateRating(usernamePlayer,usernameOpponent,'win');
    updateRating(usernamePlayer,usernameOpponent,'loss');

  });


  

  function updateView(){
    socket.emit('view-updated',board);
    socket.broadcast.emit('view-updated',board);
    socket.emit('pawn-count',board.counter(playerIndex));
    board.affichage();
  }

  //display username
  socket.on('username',(username,playerIndex)=>{
    usernames[playerIndex] = username;
    console.log("Joueur",playerIndex," : ",usernames[playerIndex]);
    socket.emit("username-display",usernames);
    socket.broadcast.emit("username-display",usernames);
  });
  // Audio
  socket.on('send-move-audio',(long)=>{
    socket.broadcast.emit('move-audio',long);
  });
  socket.on('send-attack-audio',()=>{
    socket.broadcast.emit('attack-audio');
  });

  //update player count
  socket.on('update-count',(playerIndex)=>{
    socket.emit('update-count',board.counter(playerIndex));
  });
  //pawn count 
  socket.on('pawn-count',(data)=>{
    let info = board.counter(data.id)[data.p];
    socket.emit('pawn-counted',info);
  })


  //get the available move from a pawn in a given coordinate
  socket.on('get-list',(data)=>{

    let moveNorth = board.moveList(data.x,data.y,'n');
    let moveSouth = board.moveList(data.x,data.y,'s');
    let moveEast = board.moveList(data.x,data.y,'e');
    let moveWest = board.moveList(data.x,data.y,'w');
    
    let move = {
      n:moveNorth,
      s:moveSouth,
      e:moveEast,
      w:moveWest
    }
    socket.emit('receive-list', move);
  });

  //move pawn from xsrc, ysrc to x, y
  socket.on('move', (coord)=>{
    let move = board.move(coord.xsrc, coord.ysrc, coord.x, coord.y);
    if(move){
      socket.broadcast.emit('last-move',coord);
      socket.emit('has-winner',board.hasWinner());
      socket.broadcast.emit('has-winner',board.hasWinner());
      socket.emit('hasPlayed',playerIndex);
      socket.broadcast.emit('hasPlayed',playerIndex);
      updateView();
    }
  });

  socket.on('gameStart',()=>{
    socket.broadcast.emit('gameStarted');
  });

});


function eloCalc (ratingPlayer,ratingOpponent,gameResult,nbGames){
    
  let Kfactor = 20;
  
        
          if(nbGames < 10) Kfactor = 100;
          else if(nbGames < 20) Kfactor = 50;

          let Elodiff = ratingPlayer - ratingOpponent;
          if (Elodiff > 400) Elodiff = 400;
          let winProb = 1/(1+Math.pow(10,-Elodiff/400));
          return (Math.round(ratingPlayer + Kfactor*(gameResult - winProb)));
  

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

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password : "",
    database : "swagtego"
  });
  
  con.connect(err=> {
      if (err) throw err;
      else console.log('connexion éffectuée')

      let sql= 'SELECT `rating`,`wins` + `losses` FROM `comptes` WHERE `username` = '+usernamePlayer+'';

      let ratingPlayer = con.query(sql, (err,result)=>{
        if (err) throw err;
        console.log(result);
        
    });

      sql= 'SELECT `rating`,`wins` + `losses` FROM `comptes` WHERE `username` = '+usernameOpponent+'';
      let ratingOpponent = con.query(sql, (err,result)=>{
          if (err) throw err;
          console.log(result);
          
      });
        


      let NewPlayerElo = eloCalc(ratingPlayer[0],ratingOpponent[0],resultNumberPlayer,ratingPlayer[1]);
      let NewOpponentElo = eloCalc(ratingOpponent[0],ratingPlayer[0],resultNumberOpponent,ratingOpponent[1]);

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
  con.end();

}








