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
let board = new Board();
const usernames = [];
usernames[0] = "Joueur 2";
usernames[1] = "Joueur 2";


/****** Code ******/

//Set static folder
app.use(express.static((__dirname,"front/html")));
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
    board.randomComposition(playerNum);
  });

  //Update view
  socket.on('update-view',()=>{
    socket.emit('view-updated',board);
    socket.broadcast.emit('view-updated',board);
  });
  

  //display username
  socket.on('username',(username,playerIndex)=>{
    usernames[playerIndex] = username;
    console.log("Joueur",playerIndex," : ",usernames[playerIndex]);
    socket.emit("username-display",usernames);
    socket.broadcast.emit("username-display",usernames);

  });


});