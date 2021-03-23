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

				socket.emit('get-list',{x:x , y:y});
				let listn = {};
				let lists = {};
				let liste = {};
				let listw = {};
				socket.on('list-north',(listNorth)=>{
					listn = listNorth;
				});
				socket.on('list-south',(listSouth)=>{
					lists = listSouth;
				});
				socket.on('list-east',(listEast)=>{
					liste = listEast;
				});
				socket.on('list-west',(listWest)=>{
					listw = listWest;
				});			

				setTimeout(()=>{
					if(listn || lists || liste || listw){			
						if(listn){
							console.log("available move toward north");
							this.classAdder(listn);						
						}
						if(liste){
							console.log("available move toward east");
							this.classAdder(liste);					
						}
						if(lists){
							console.log("available move toward south");
							this.classAdder(lists);
						}
						if(listw){
							console.log("available move toward west");
							this.classAdder(listw);		
						}	
					}
				},100);	
			
			}
		})) 
	}



	classAdder(list){
		switch(list.action){
			default:
				break;
			case 'move' :
				this.grid[list.y][list.x].classList.add("move");
				this.grid[list.y][list.x].setAttribute("movable","true");
				this.grid[list.y][list.x].innerHTML = '•' ;
				break;
			case 'attack' :
				this.grid[list.y][list.x].classList.add("attack");
				this.grid[list.y][list.x].setAttribute("attackable","true");
				this.grid[list.y][list.x].innerHTML = 'X' ;
				break;
		}
		
	}
}