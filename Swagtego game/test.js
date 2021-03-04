let game = new Board();
let pawn = new Pawn();



game.placingPawns(0,9,3,4);
game.placingPawns(1,9,9,2);

console.log(game.affichage());

console.log(game.getCaseState(9,6));

game.move(9,9,9,6);
console.log(game.affichage());


game.move(9,6,0,6);
console.log(game.affichage());


/*
console.log("move2");
game.move(9,5,9,4);
console.log(game.affichage());

console.log("move3");
game.move(9,4,9,3);
console.log(game.affichage());

console.log(game.getCaseState(9,3));


console.log("move");
game.move(9,6,9,5);
console.log(game.affichage());

console.log("move2");
game.move(9,5,9,4);
console.log(game.affichage());



console.log("move3");
game.move(9,4,9,3);
console.log(game.affichage());
*/