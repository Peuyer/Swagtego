//Affiche le plateau et les pions 


class View{
	constructor(game, playerIndex){
		this.initBoard(game, playerIndex);
		this.game = game;
		this.grid = this.boardLoad();
	}
	
	DisplayBoard(playerIndex){
		for(let x=0; x<10; x++){
			for(let y=0; y<10; y++){
				if(this.game.board[x][y] == null){
					this.grid[x][y].className = 'grass';
					this.grid[x][y].innerHTML ='';
				}
				else if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player == playerIndex){
					this.grid[x][y].className = playerIndex ? "pawnRed":"pawnBlue";
					this.grid[x][y].innerHTML = ((this.game.board[x][y].pawn-playerIndex)/10).toString();
					this.grid[x][y].id +="pawn";
				}
				else if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player != playerIndex){
					this.grid[x][y].className = playerIndex ? "pawnBlue":"pawnRed"
					this.grid[x][y].innerHTML = "";
				}
			}
		}
		this.attachListeners(playerNum);
	}

	initBoard(board,playerIndex){
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
					if((playerIndex == 0 && x<4) || (playerIndex == 1 && x>5)) {
						html += '<td class="grass" ondragover="onDragOver(event);" ondrop="onDrop(event);" data-value='+index.toString()+'>';
					}
					else html += '<td class="grass" data='+index.toString()+'>';
				}
				else{
					html += '<td class="grass" ondragover="onDragOver(event);" ondrop="onDrop(event);" data-value='+index.toString()+'>';
				}
				html += '</td>';
			}
			html += '</tr>';
		}
		let element = document.getElementById('table');
		element.innerHTML = html;
		this.initPawns();
	}

	initPawns(){
		let html='';
		for (let i = 0; i<12; i++){
			count[i]=0;
			html+= '<li class="pawn-item" id="pawn'+i.toString()+'" draggable="true" ondragstart="onDragStart(event);" data-value='+i.toString()+'>'+i.toString()+'<p>'+count[i]+'/'+max[i]+'</p></li>';
		}
		document.getElementById('pawn-container').innerHTML = html;
	}
	addPawn(i){
		let html='';
		html += '<li class="pawn-item" id="pawn'+i.toString()+'" draggable="true" ondragstart="onDragStart(event);" data-value='+i.toString()+'>'+i.toString()+'<p>'+count[i]+'/'+max[i]+'</p></li>';
		document.getElementById('pawn-container').innerHTML += html;
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

	setGame(board){
		this.game = board;
	}
	getGame(){
		return this.game;
	}


	attachListeners(pIndex){
		let pClass = "";
		pIndex == 0 ? pClass = "pawnBlue" : pClass = "pawnRed";
		document.querySelectorAll("#pawn").forEach(e=>e.addEventListener('click',event =>{
			let x = e.cellIndex;
			let y = e.parentNode.rowIndex
			console.log("youhou");

			if (e.classList.contains(pClass)){
				console.log( "Liste des déplacement disponible du pion en "+x ,y," : ");
				
				let listn = getList(x,y,'n');
				let lists = getList(x,y,'s');
				let liste = getList(x,y,'e');
				let listw = getList(x,y,'w');

				console.log(listn);
				console.log(lists);
				console.log(liste);
				console.log(listw);

				if(listn || lists || liste || listw){
					console.log("list exists");
					
					if(listn){
						console.log("available move toward north");
						this.classAdder('n',list);
						
					}
					if(liste){
						console.log("available move toward east");
						this.classAdder('e',list);
						
					}
					if(lists){
						console.log("available move toward south");
						this.classAdder('s',list);
						
					}
					if(listw){
						console.log("available move toward west");
						this.classAdder('w',list);
						
					}
						
				}	
			
			}
		})) 
	
	}



	classAdder(dir,list){

		switch(list[dir]['action']){
			default:
				break;
			case null :
				break;
			case 'move' :
				this.game.grid[list[dir]['coordx']][list[dir]['coordy']].classList.add("move");
				console.log(this.game.grid[list[dir]['coordx']][list[dir]['coordy']].classList)	;
				break;
			case 'attack' :
				this.game.grid[list[dir]['coordx']][list[dir]['coordy']].classList.add("attack");
				break;
		}
	}






}