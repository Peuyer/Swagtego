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
					this.grid[x][y].id ="pawn";
					//if(this.grid[x][y].getAttribute('listener') !== 'true'){
					//	console.log('test',this.grid[x][y]);
					//	this.attachListeners(playerNum,x,y);
					//	this.grid[x][y].setAttribute('listener', 'true');
					//}
				}
				else if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player != playerIndex){
					this.grid[x][y].className = playerIndex ? "pawnBlue":"pawnRed"
					this.grid[x][y].innerHTML = "";
				}
			}
		}
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
		let board = this.game.board;
		let grid = this.grid;
		for(let i=0; i<10; i++){
			for(let j=0; j<10;j++){
				this.grid[j][i].addEventListener('click',function(){
					clickEvent(i,j,pIndex,board,grid);
				});
			}
		}
	}

	classAdder(list, source){
		let coord ={
			xsrc : source.x,
			ysrc : source.y,
			x : list.x,
			y : list.y
		}
		switch(list.action){
			default:
				break;
			case 'move' :
				this.grid[list.y][list.x].classList.add("move");
				this.grid[list.y][list.x].setAttribute("movable","true");
				this.grid[list.y][list.x].innerHTML = '•' ;

				//this.grid[list.y][list.x].addEventListener('click', ()=>{
				//	socket.emit('move',coord);
				//});
				break;
			case 'attack' :
				this.grid[list.y][list.x].classList.add("attack");
				this.grid[list.y][list.x].setAttribute("attackable","true");
				this.grid[list.y][list.x].innerHTML = 'X' ;
				//this.grid[list.y][list.x].addEventListener('click', ()=>{
				//	socket.emit('move',coord);
				//});
				break;
		}
	}


}

function clickEvent(x,y,pIndex,board,grid){

	if(grid[y][x].getAttribute('attackable') == 'true' || grid[y][x].getAttribute('movable')== 'true'){
		return
	}
	else if(board[y][x] == null || board[y][x] == 'b'){
		return 
	}
	else if(board[y][x].player != pIndex){
		return
	}
	else{
		removeAllAtribute(grid);
		socket.emit('get-list',{x:x, y:y});
		let src = {
			x:x,
			y:y
		}
		let i=0;
		socket.on('receive-list', (list)=>{
			if(i == 0){
				verif(list.n, list.s,list.e, list.w,src,i);
				i++;
			}
		});
		
	}
}
function removeAllAtribute(grid){
	for(let i=0; i<10; i++){
		for(let j=0; j<10;j++){
			if(grid[j][i].getAttribute('movable')=='true' || grid[j][i].getAttribute('attackable')=='true'){
				grid[j][i].innerHTML='';
			}
			grid[j][i].removeAttribute('attackable');
			grid[j][i].removeAttribute('movable');
			
		}
	}
}
function verif(listn,lists,liste,listw,src,i){
	if(i!=0) return;
	else if(listn || lists || liste || listw){			
		if(listn){
			console.log("available move toward north");
			view[0].classAdder(listn, src);						
		}
		if(liste){
			console.log("available move toward east");
			view[0].classAdder(liste, src);					
		}
		if(lists){
			console.log("available move toward south");
			view[0].classAdder(lists, src);
		}
		if(listw){
			console.log("available move toward west");
			view[0].classAdder(listw, src);		
		}	
	}
}