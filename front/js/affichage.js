//Affiche le plateau et les pions 

class View{
	constructor(game){
		this.initBoard(game);
		this.game = game;
		this.grid = this.boardLoad();

	}
	
	DisplayBoard(playerIndex){
		console.log("display");
		for(let x=0; x<10; x++){
			for(let y=0; y<10; y++){
				if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player == playerIndex){
					this.grid[x][y].className = playerIndex ? "pawnRed":"pawnBlue";
					this.grid[x][y].innerHTML = ((this.game.board[x][y].pawn-playerIndex)/10).toString();
				}
				else if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player == playerIndex){
					this.grid[x][y].className = playerIndex ? "pawnBlue":"pawnRed"
					this.grid[x][y].innerHTML = "";
				}
			}
		}
	}

	initBoard(board){
		let html = '';
		let index = 0;
		for(let x=0; x<10; x++){
			  html += '<tr>';
			for(let y=0;y<10;y++){
				index++;
				if(board.board[x][y] == 'b'){
					html+= '<td class="lake" >';
				}
				else if (board.board[x][y] == null){
						html += '<td class="grass" data=',index,'>';
				}
				html += '</td>';
			}
			html += '</tr>';
		}
		let element = document.getElementById('table');
		element.innerHTML = html;
	}
	
	boardLoad(){
		let tab = document.getElementById("table");
		tab = tab.firstElementChild.getElementsByTagName("tr");
	
		let grid = new Array(10);
		for(let i=0; i<10; i++){
			grid[i] = tab[i].getElementsByTagName("td");
		}
		return grid; 
	}
}