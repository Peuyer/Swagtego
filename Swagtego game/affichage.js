//Affiche le plateau et les pions 

let board = new Board();
console.log(board.getCaseState(0,0));


function DisplayBoard(board){
	let html;
    for(let x=0; x<10; x++){
  		html += '<tr>';
        for(let y=0;y<10;y++){
            html += '<td class="pawn">';
            html += '</td>';      
        }
        html += '</tr>';
    }
    let element = document.getElementById('table');
    element.innerHTML = html;
}
DisplayBoard(board);