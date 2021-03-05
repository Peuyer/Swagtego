let game = new Board();
let pawn = new Pawn();

game.placingPawns(1,9,9,2);
game.placingPawns(1,8,9,3);
game.placingPawns(1,7,9,4);
game.placingPawns(1,6,9,10);
game.placingPawns(1,5,8,10);

game.isCompleted(1);