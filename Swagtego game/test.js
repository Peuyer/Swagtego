let game = new Board();

game.placingPawns(0,2,2,0);
game.placingPawns(1,8,8,0);
game.placingPawns(0,3,3,3);
game.placingPawns(1,7,7,3);

console.log(game.affichage());

game.hasWinner();