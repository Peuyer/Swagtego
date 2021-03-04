//Affiche le plateau et les pions 

let board = new Board();

function DisplayBoard(board){
	let html = '';
    for(let x=0; x<10; x++){
  		html += '<tr>';
        for(let y=0;y<10;y++){
            
            if(board.board[x][y] == 'b'){
            	html+= '<td class="lake">';
            }
            else{
	            if (board.board[x][y] % 2 == 0 && board.board[x][y] != 0){
	            	html+= '<td class="pawnRed">';
	            	html += board.board[x][y];
	            }
	            if (board.board[x][y] % 2 == 1){
	            	html+= '<td class="pawnBlue">';
	            	html += board.board[x][y];
	            }
	            else{
	            	html += '<td class="grass">';
	            }
        	}
            html += '</td>';
        }
        html += '</tr>';
    }
    let element = document.getElementById('table');
    element.innerHTML = html;
}
DisplayBoard(board);