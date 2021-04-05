//Affiche le plateau et les pions 
const footstep = '<img class="pawnImage" src="footsteps.svg"></img>'
const fight = '<img class="pawnImage" src="fight.svg"></img>'
const images = new Array();
images[0] = '<img class="perso" src="../images/stratego-flag.svg">';images[1] = '<img class="perso" src="../images/stratego-spy.svg">';
images[2] = '<img class="perso" src="../images/stratego-scout.svg">';images[3] = '<img class="perso" src="../images/stratego-miner.svg">';
images[4] = '<img class="perso" src="../images/stratego-sergeant.svg">';images[5] = '<img class="perso" src="../images/stratego-lieutenant.svg">';
images[6] = '<img class="perso" src="../images/stratego-captain.svg">';images[7] = '<img class="perso" src="../images/stratego-major.svg">';
images[8] = '<img class="perso" src="../images/stratego-colonel.svg">';images[9] = '<img class="perso" src="../images/stratego-general.svg">';
images[10] = '<img class="perso" src="../images/stratego-marshal.svg">';images[11] = '<img class="perso" src="../images/stratego-bomb.svg">';
const nom = new Array(12);
nom[0]='Drapeau';nom[1]='Espion';nom[2]='Eclaireur';nom[3]='Démineur';nom[4]='Sergent';nom[5]='Lieutenant';
nom[6]='Capitaine';nom[7]='Commandant';nom[8]='Colonel';nom[9]='Général';nom[10]='Maréchal';nom[11]='Bombe';



class View{
	constructor(game, playerIndex){
		this.initBoard(game, playerIndex);
		this.game = game;
		this.grid = this.boardLoad();
		this.started = false;
	}


	DisplayBoard(playerIndex){
		for(let x=0; x<10; x++){
			for(let y=0; y<10; y++){
				// Camp allié
				if(((playerIndex == 0 && x>3) || (playerIndex == 1 && x<6)) && (!enemyReady || !ready) && this.game.board[x][y] != 'b') {
					this.grid[x][y].id = 'grey';
				}
				// Case vide
				if(this.game.board[x][y] == null){
					if ((x+y)%2 == 0){this.grid[x][y].className = 'grassDark';}
					else{this.grid[x][y].className = 'grass';}
					this.grid[x][y].innerHTML ='';
					if (enemyReady && ready)this.grid[x][y].id = '';
				}
				
				// Pions alliés
				else if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player == playerIndex){
					let playerClass = !playerIndex ? 'pawnBlue':'pawnRed'
					let i = Math.round((this.game.board[x][y].pawn-playerIndex)/10);
					this.grid[x][y].innerHTML = "<div class='"+playerClass+"'><img>"+images[i]+"</img><h3>"+i+"</h3></div>";
					this.grid[x][y].id ="pawn";
				}
				else if (!this.started){
				}
				// Pions ennemis
				else if(this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].player != playerIndex){
					let playerClass = playerIndex ? 'pawnBlue':'pawnRed'
					this.grid[x][y].innerHTML = "<div class='"+playerClass+"'></div>";
					if(this.grid[x][y].id == 'grey')this.grid[x][y].id='pawn';
					
				}
				// Pions ennemi après attaque
				if (this.game.board[x][y] != null && this.game.board[x][y]!= 'b' && this.game.board[x][y].isReturned == true && this.game.board[x][y].player != playerIndex){
					let grid = this.grid;
					let i = Math.round((this.game.board[x][y].pawn-playerIndex)/10);
					this.grid[x][y].firstElementChild.innerHTML = "<img>"+images[i]+"<h3>"+i+"</h3></img>";
					setTimeout(function(){returnCard(x,y,grid)},5000);
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
				let herbe = (x+y)%2==0 ? 'grassDark':'grass';
				if(board.board[x][y] == 'b'){
					html+= '<td class="lake" >';
				}
				else if (board.board[x][y] == null){
					if((playerIndex == 0 && x<4) || (playerIndex == 1 && x>5)) {
						html += '<td class="'+herbe+'" ondragover="onDragOver(event);" ondrop="onDrop(event);" data-value='+index.toString()+'>';
					}
					else html += '<td class="'+herbe+'" data='+index.toString()+'>';
				}
				else{
					html += '<td class="'+herbe+'" ondragover="onDragOver(event);" ondrop="onDrop(event);" data-value='+index.toString()+'>';
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
			html+= '<li class="pawn-item" id="pawn'+i.toString()+'" draggable="true" ondragstart="onDragStart(event);" data-value='+i.toString()+'>'+images[i]+'<p id="amount">'+count[i]+'/'+max[i]+'</p><p id="nom">('+i+')'+nom[i]+'</p></li>';		
		}
		document.getElementById('pawn-container').innerHTML = html;
	}
	addPawn(i){
		let html='';
		html += '<li class="pawn-item" id="pawn'+i.toString()+'" draggable="true" ondragstart="onDragStart(event);" data-value='+i.toString()+'>'+images[i]+'<p id="amount">'+count[i]+'/'+max[i]+'</p><p id="nom">('+i+')'+nom[i]+'</p></li>';		
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
	start(){
		this.started = true;
	}
	stop(){
		this.started = false;
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
		switch(list.action){
			default:
				break;
			case 'move' :
				this.grid[list.y][list.x].classList.add("move");
				this.grid[list.y][list.x].setAttribute("movable","true");
				this.grid[list.y][list.x].innerHTML = footstep ;		
				break;
			case 'attack' :
				this.grid[list.y][list.x].classList.add("attack");
				this.grid[list.y][list.x].setAttribute("attackable","true");
				this.grid[list.y][list.x].firstElementChild.innerHTML = fight ;		
				break;
		}
	}

	glow(xsrc,ysrc,x,y){
		this.grid[y][x].id = "glow";
	}
}
let src = {};
function clickEvent(x,y,pIndex,board,grid){
	board = view[0].getGame().board;
	let coord = {
		xsrc:src.x,
		ysrc:src.y,
		x:x,
		y:y
	}
	let length = x-src.x ? x-src.x : y-src.y;
	length=Math.abs(length);
	if(currentPlayer != 'user'){
		return;
	}
	if(grid[y][x].getAttribute('attackable') == 'true'){
		socket.emit('move',coord);
		
		socket.emit('send-attack-audio');
		attackAudio();
		removeAllAtribute(grid);
		return
	}
	else if (grid[y][x].getAttribute('movable')== 'true'){
		socket.emit('move',coord);
		
		socket.emit('send-move-audio',length);
		moveAudio(length);
		removeAllAtribute(grid);
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
		src = {
			x:x,
			y:y
		}
		let i=0;
		socket.on('receive-list', (list)=>{
			if(i == 0){
				let pawn = board[y][x].pawn;
				verif(list.n, list.s,list.e, list.w,src,i,pawn,coord);
				i++;
			}
		});
		
	}
}
function removeAllAtribute(grid){
	for(let i=0; i<10; i++){
		for(let j=0; j<10;j++){
			if(grid[j][i].getAttribute('movable')=='true' || grid[j][i].getAttribute('attackable')=='true'){
				if(grid[j][i].classList.contains('move') || grid[j][i].classList.contains('attack')){
					grid[j][i].innerHTML='';
				}
			}
			if(grid[j][i].id == 'glow') {
				grid[j][i].id='';
			}
			grid[j][i].removeAttribute('attackable');
			grid[j][i].removeAttribute('movable');
		}
	}
}
function verif(listn,lists,liste,listw,src,i, pawn,coord){
	if(i!=0) return;
	else if(listn || lists || liste || listw){			
		if(listn){
			console.log("available move toward north");
			view[0].classAdder(listn, src);	
			if (verifecl(pawn,listn, src,coord) == true) verifecl(pawn,listn, src,coord)
		}
		if(liste){
			console.log("available move toward east");
			view[0].classAdder(liste, src);
			if(verifecl(pawn,liste, src,coord) == true) verifecl(pawn,liste, src,coord)
		}
		if(lists){
			console.log("available move toward south");
			view[0].classAdder(lists, src);
			if(verifecl(pawn,lists, src,coord) == true) verifecl(pawn,lists, src,coord)
		}
		if(listw){
			console.log("available move toward west");
			view[0].classAdder(listw, src);
			if(verifecl(pawn,listw, src,coord) == true) verifecl(pawn,listw, src,coord)
		}	
	}
	else return ;
}

function verifecl(pawn,list,src,coord){
	if(pawn == 20 || pawn == 21){
		let listTransfer = list;

		if(list.dir == 's'){
			let depart = coord.y+1;
			let fin = list.y;
			if(fin-depart == 0) return;
			else {
				while(depart != fin){
					listTransfer.y = depart;
					listTransfer.action = 'move';
					view[0].classAdder(listTransfer, src);
					depart++;
				}
			}
		}
		if(list.dir == 'n'){
			let depart = coord.y-1;
			let fin = list.y;
			if(fin-depart == 0) return;
			else {
				while(depart != fin){
					listTransfer.y = depart;
					listTransfer.action = 'move';
					view[0].classAdder(listTransfer, src);
					depart--;
				}
			}
		}
		if(list.dir == 'w'){
			let depart = coord.x-1;
			let fin = list.x;
			if(fin-depart == 0) return;
			else {
				while(depart != fin){
					listTransfer.x = depart;
					listTransfer.action = 'move';
					view[0].classAdder(listTransfer, src);
					depart--;
				}
			}
		}
		if(list.dir == 'e'){
			let depart = coord.x+1;
			let fin = list.x;
			if(fin-depart == 0) return;
			else {
				while(depart != fin){
					listTransfer.x = depart;
					listTransfer.action = 'move';
					view[0].classAdder(listTransfer, src);
					depart++;
				}
			}
		}
		return true;
	}
	else return false;
}

function returnCard(x,y,grid){
	grid[x][y].firstElementChild.innerHTML='';
}