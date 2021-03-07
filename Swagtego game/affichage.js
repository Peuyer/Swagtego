//Affiche le plateau et les pions 

let board = new Board();

board.placingPawns(0,0,0,3);
board.placingPawns(1,0,8,2);
board.move(0,8,0,0);
board.move(0,0,1,0);



function DisplayBoard(board){
	let html = '';
    for(let x=0; x<10; x++){
  		html += '<tr>';
        for(let y=0;y<10;y++){
            
            if(board.board[x][y] == 'b'){
            	html+= '<td class="lake">';
            }
        	else if (board.board[x][y] == null){
	            	html += '<td class="grass">';
			}
			else {
				
				if (board.getPawn(x,y) % 2 == 0){
						if(board.board[x][y].isReturned == true){
							
							html += '<td class="pawnRed">';
							text = board.board[x][y].pawn.toString(); 
							html += text.slice(0,1);
						}
						else{
							html += '<td class="pawnRedRecto">';
						}
				}
				else if (board.getPawn(x,y) % 2 == 1){
					if(board.board[x][y].isReturned == true){
						html += '<td class="pawnBlue">';
						text = board.board[x][y].pawn.toString(); 
						html += text.slice(0,1);
					}
					else{
						html += '<td class="pawnBlueRecto">';

					
					}



				
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