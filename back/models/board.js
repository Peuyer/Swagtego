let max = Array(12);
max[0] = 1;
max[1] = 1;
max[2] = 8;
max[3] = 5;
max[4] = 4;
max[5] = 4;
max[6] = 4;
max[7] = 3;
max[8] = 2;
max[9] = 1;
max[10] = 1;
max[11] = 6;

class Pawn{
    constructor(x,y,pawn,player){
        this.x = x;
        this.y = y;
        this.pawn = pawn;
        this.player = player;
        this.isReturned = false;
    }


}

module.exports = Pawn;

class Board extends Pawn{

    constructor(){
        super();
        this.currentPlayer = Math.random < 0.5;
        this.board = this.createBoard();   
    }

    rangeRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {currentDate = Date.now();}
        while (currentDate - date < milliseconds);
    }

    affichage(){
        let aff='';
        for(let i =0; i< 10; i++){
            aff='';
            for(let j =0; j< 10; j++){
                if(this.board[i][j]==null){
                    aff+='    ';
                }
                else if (this.board[i][j] == 'b'){
                    aff+='b   ';
                }
                else{
                    aff+=(this.board[i][j].pawn).toString();
                    if (this.board[i][j].pawn >2 && this.board[i][j].pawn < 92){
                        aff+='  ';
                    }
                    else if (this.board[i][j].pawn <2)aff+='   ';
                    else{aff+=' '}
                }
            }
            console.log(aff);
        }
    }
    //crée la grille de jeu
    createBoard()
    {
        let board = new Array(10);
        for (let c = 0;c<10;c++){
            board[c] = new Array(10);
        }



        board[4][2]= 'b';
        board[4][3]= 'b';
        board[5][2]= 'b';
        board[5][3]= 'b';
        board[4][6]= 'b';
        board[5][6]= 'b';
        board[4][7]= 'b';
        board[5][7]= 'b';

        console.log("Grille créée")
        return board;
    }

    //place un pion à la coordonée x,y
    placingPawns(playerId,x,y,pawn)
    {

        pawn = pawn *10 + playerId;
        let zoneStart, zoneEnd;
        if (playerId == 0){
            zoneStart = 0;
            zoneEnd=3;
        }
        else{
            zoneStart = 6;
            zoneEnd=9;
        }

        if(y>zoneEnd || y<zoneStart){
            console.log("Placement du pion impossible (hors-zone)");
            return false;
        }
        if(this.board[y][x] != null){
            console.log("Placement du pion impossible (case occupée)");
            return false;
        }

        this.board[y][x] = new Pawn(x,y,pawn,playerId);
        console.log("Pion ",pawn," placé en : ",x,"/",y," par le joueur",playerId);
    }

    //génère une composition de pions aléatoire pour le joueurs playerId
    //retourne '1' si succès, '0' si erreur.
    randomComposition(playerId){
        let count = this.counter(playerId);
        let nbPawn=0,randx=0,randy=0;
        for(let i = 0; i<12;i++){
            nbPawn = max[i] - count[i];
            count[i]?console.log("Already ",count[i]," pawn(s) with the value ",i):console.log();
            for (let j = 0; j<nbPawn ;j++){
                do{
                randx = this.rangeRand(0,9);
                randy = this.rangeRand(!playerId?0:6,!playerId?3:9);
                }
                while(this.board[randy][randx] != null)
                this.board[randy][randx] = new Pawn(randx,randy,i*10+playerId,playerId);
                console.log(this.board[randy][randx].pawn," : ",j+1," / ",max[i]);
            }
        }
        console.log('Generation completed with success');
        return 1;
    }
    //clear one side of the board
    clearSide(playerId){
        for (let x=0 ; x<10; x++){
            for (let y=(!playerId?0:6) ; y<(!playerId?4:10); y++){
                this.board[y][x] = null;
            }
        }
        console.log('Side cleared with success');
    }
    //regénère une composition après en avoir déja créé une
    regenerate(playerId){
        this.clearSide(playerId);
        let nbPawn=0,randx=0,randy=0;
        for(let i = 0; i<12;i++){
            nbPawn = max[i];
            for (let j = 0; j<nbPawn ;j++){
                do{
                randx = this.rangeRand(0,9);
                randy = this.rangeRand(!playerId?0:6,!playerId?3:9);
                }
                while(this.board[randy][randx] != null)
                this.board[randy][randx] = null;
                this.board[randy][randx] = new Pawn(randx,randy,i*10+playerId,playerId);
            }
        }
        console.log('Regeneration completed with success');
        return 1;
    }

    //retourne un 'tableau' avec le nombre de chaque pions posé
    pawnCounter(playerId){
        let mar=0,gen=0,col=0,com=0,cap=0,lie=0,ser=0,dem=0,ecl=0,esp=0,dra=0,bom=0;
        let array = new Array(12);
        for(let i = (!playerId ? 0:6) ; i<(!playerId?4:10) ; i++){
            for (let j = 0 ; j<10 ; j++)
            {
                if (this.board[j][i] != null){
                    switch (this.board[j][i].pawn){
                        default : break;
                        case 110 + playerId :
                            if(bom<6)bom++;
                            else{this.board[j][i] = null;}
                            break;

                        case 100 + playerId :
                            if(mar<1)mar++;
                            else{this.board[j][i] = null;}
                            break;

                        case 90 + playerId :
                            if(gen<1)gen++;
                            else{this.board[j][i] = null;}
                            break;

                        case 80 + playerId :
                            if(col<2)col++;
                            else{this.board[j][i] = null;}
                            break;

                        case 70 + playerId :
                            if(com<3)com++;
                            else{this.board[j][i] = null;}
                            break;

                        case 60 + playerId :
                            if(cap<4)cap++;
                            else{this.board[j][i] = null;}
                            break;

                        case 50 + playerId :
                            if(lie<4)lie++;
                            else{this.board[j][i] = null;}
                            break;

                        case 40 + playerId :
                            if(ser<4)ser++;
                            else{this.board[j][i] = null;}
                            break;

                        case 30 + playerId :
                            if(dem<5)dem++;
                            else{this.board[j][i] = null;}
                            break;

                        case 20 + playerId :
                            if(ecl<8)ecl++;
                            else{this.board[j][i] = null;}
                            break;

                        case 10 + playerId :
                            if(esp<1)esp++;
                            else{this.board[j][i] = null;}
                            break;

                        case 0 + playerId :
                            if(dra<1)dra++;
                            else{this.board[j][i] = null;}
                            break;
                    }
                }
            }
        }
        array[0] = dra;
        array[1] = esp;
        array[2] = ecl;
        array[3] = dem;
        array[4] = ser;
        array[5] = lie;
        array[6] = cap;
        array[7] = com;
        array[8] = col;
        array[9] = gen;
        array[10] = mar;
        array[11] = bom;
        return array;
    }

    //retourne 'true' si tout les pions sont correctement placé, 'false' sinon
    isCompleted(playerId)
    {
        console.log("Verification pions du joueur",playerId,"...");
        let mar=0,gen=0,col=0,com=0,cap=0,lie=0,ser=0,dem=0,ecl=0,esp=0,dra=0,bom=0;
        for(let i = (!playerId ? 0:6) ; i<(!playerId?4:10) ; i++){
            for (let j = 0 ; j<10 ; j++){
    
                if (this.board[i][j] != null){
                    
                    switch (this.board[i][j].pawn){
                        default :
                        case 110 + playerId :
                            if(bom<6)bom++;
                            else{
                                console.log("Trop de bombes");
                                return false;}
                            break;

                        case 100 + playerId:
                            if(mar<1)mar++;
                            else{
                                console.log("Trop de maréchal");
                                return false;}
                                break;

                        case 90 + playerId :
                            if(gen<1)gen++;
                            else{
                                console.log("Trop de général");
                                return false;}
                                break;

                        case 80 + playerId :
                            if(col<2)col++;
                            else{
                                console.log("Trop de colonel");
                                return false;}
                                break;

                        case 70 + playerId :
                            if(com<3)com++;
                            else{
                                console.log("Trop de commandant");
                                return false;}
                                break;

                        case 60 + playerId :
                            if(cap<4)cap++;
                            else{
                                console.log("Trop de capitaine");
                                return false;}
                                break;

                        case 50 + playerId :
                            if(lie<4)lie++;
                            else{
                                console.log("Trop de lieutenant");
                                return false;}
                                break;

                        case 40 + playerId :
                            if(ser<4)ser++;
                            else{
                                console.log("Trop de sergeant");
                                return false;}
                                break;

                        case 30 + playerId :
                            if(dem<5)dem++;
                            else{
                                console.log("Trop de démineur");
                                return false;}
                                break;

                        case 20 + playerId :
                            if(ecl<8)ecl++;
                            else{
                                console.log("Trop de éclaireur");
                                return false;}
                                break;

                        case 10 + playerId :
                            if(esp<1)esp++;
                            else{
                                console.log("Trop de éspion");
                                return false;}
                                break;

                        case 0 + playerId :
                            if(dra<1)dra++;
                            else{
                                console.log("Trop de drapeau");
                                return false;}
                                break;
                    }
                }
            }
        }
        if (mar == 1 && gen == 1 && col == 2 && com == 3 && cap == 4 && lie == 4 && ser == 4 && dem ==  5 && ecl == 8 && esp == 1 && dra == 1 && bom == 6){
            console.log("OK");
            return true;
        }
        console.log("Pions manquants");
        return false;
    }

    //reset de la game
    reset()
    {
        this.board = this.createBoard();
        this.currentPlayer = Math.random < 0.5;
    }

    //retourne 'id' du joueur actuel
    getCurrentPlayer()
    {
        return this.currentPlayer;
    }

    //retourne le pions sur la case x,y
    getCaseState(x,y)
    {
        return this.board[y][x];
    }

    //retourne '0' si mouvement impossible, '1' si mouvement effectué
    move(x_avant, y_avant,x,y)
    {
        for(let x=0; x<10; x++){
			for(let y=0; y<10; y++){
                if(this.board[x][y] != null && this.board[x][y]!= 'b'){
					this.board[x][y].isReturned = false;
				}
            }
        }
        console.log("Move : ",x_avant,"/",y_avant, " vers ",x,"/",y,".");
        if(x>9 || y>9  || x<0 || y<0){
            console.log("Mouvement hors grille de jeu");
            return false;
        }
        if (this.board[y][x] == 'b'){
            console.log("🌊💦 PLOUF 💦🌊");
            return false;
        }
        if (this.board[y_avant][x_avant] == null){
            console.log("La coordonnée de départ ne contient pas de pion.");
            return false;
        }
        if (this.board[y_avant][x_avant].pawn == 0+this.board[y_avant][x_avant].player || this.board[y_avant][x_avant].pawn == 110+this.board[y_avant][x_avant].player){
            console.log("Impossible de déplacer un drapeau ou un bombe");
            return false;
        }
        let pawn = new Pawn();
        pawn = this.board[y_avant][x_avant];
        console.log(this.getCaseState(x_avant,y_avant)," vers ",x,"/",y);
        //si le pion n'est pas un éclaireur
        if (pawn.pawn != 20 && pawn.pawn != 21){
            let ex = Math.abs(pawn.x - x)
            let ey = Math.abs(pawn.y - y)

            console.log(ex);
            console.log(ey);
            if (ex == 1 || ey == 1){
                if (this.board[y][x] != null){
                    let attack = this.attack(pawn,this.board[y][x]);
                    if (!attack){
                        console.log("Mouvement Impossible (attaque impossible)");
                        return false;
                    }
                    else if (attack == 3){
                        this.board[pawn.y][pawn.x] = null;
                        this.board[y][x].isReturned = true;
                        return 1;
                    }
                    else if(attack == 2){
                        this.board[pawn.y][pawn.x] = null;
                        this.board[y][x] = null;
                        return 1;
                    }
                }
            }
            else {
                console.log("Mouvement impossible (trop grande distance ou diagonale)");
                return false;
            }
            
            this.board[y][x] = pawn;
            this.board[pawn.y][pawn.x] = null;
            pawn.x = x;
            pawn.y = y;
            return 1;
        }
        //sinon
        else{
            if (x != pawn.x && y != pawn.y){
                console.log("Mouvement impossible (diag)");
                return false;
            }
            else{
                //cas d'un mouvement selon X
                if(x != pawn.x){
                    if (x < pawn.x){
                        for(let i = pawn.x-1; i != x;--i){
                            if(this.board[y][i] != null){
                                console.log("Mouvement impossible gauche");
                                return false;
                            }
                        }
                    }
                    else{
                        for(let i = pawn.x+1; i != x;++i){
                            if(this.board[y][i] != null){
                                console.log("Mouvement impossible droite");
                                return false;
                            }
                        }
                    }
                }

                //cas d'un mouvement selon Y

                if(y != pawn.y){
                    if (y < pawn.y){
                        for(let i = pawn.y-1; i != y;--i){
                            if(this.board[i][x] != null){
                                console.log("Mouvement impossible haut");
                                return false;
                            }
                        }
                    }
                    else{
                        for(let i = pawn.y+1; i != y;++i){
                            if(this.board[i][x] != null){
                                console.log("Mouvement impossible bas");
                                return false;
                            }
                        }
                    }

                }
            }
            //attaque
            if (this.board[y][x] != null){
                console.log("Move d'attaque : ");
                let attack = this.attack(pawn,this.board[y][x]);
                if (!attack){
                    console.log("Mouvement Impossible (attaque impossible)");
                    return false;
                }
                else if (attack == 3){
                    this.board[pawn.y][pawn.x] = null;
                    this.board[y][x].isReturned = true;
                    return 1;
                }
                else if(attack == 2){
                    this.board[pawn.y][pawn.x] = null;
                    this.board[y][x] = null;
                    return 1;
                }
            }
            //mise à jour coordonnées
            this.board[y][x] = pawn;
            this.board[pawn.y][pawn.x] = null;
            pawn.x = x;
            pawn.y = y;
            return 1;
        }
    }

    //retourne '0' si hors d'atteinte, '1' si attaque possible et '2' si éclaireur
    inReach(pawn1,pawn2)
    {       
        let ex = Math.abs(pawn1.x - pawn2.x)
        let ey = Math.abs(pawn1.y - pawn2.y)

        if (ex != 0 && ey != 0){
            console.log("/!|Coup en diagonale");
            return 0;
        }
        else if (ex==1 || ey==1){
            console.log("Coup possible");
            return 1;
        }
        else if (pawn1.pawn == 20 || pawn1.pawn == 21){
            return 2;
        }
    }

    //retourne '1' si succès, '0' si erreur, '2' si égalité, 3 si échec
    attack(pawn1,pawn2)
    {
        console.log("Attaque : ",pawn1.pawn," vs ",pawn2.pawn);
        if (pawn1.player == pawn2.player){
            console.log("Tir ami");
            return false;
        }
        if (this.inReach(pawn1,pawn2) == 0){
            console.log("Attaque hors d'atteinte");
            return false;
        }
        if (pawn1.pawn == 0 || pawn1.pawn==1 || pawn1.pawn == 110 || pawn1.pawn == 111){
            console.log("Attaque par une bombe ou drapeau");
            return false;
        }
        if ((pawn1.pawn == 10 || pawn1.pawn == 11) && (pawn2.pawn == 100 || pawn2.pawn == 101)){
            console.log("Espion tue maréchal");
                
        }
        else if ((pawn1.pawn == 30 || pawn1.pawn == 31) && (pawn2.pawn == 110 || pawn2.pawn == 111)){
            console.log("Bombe déminé");
        }
        else if(pawn2.pawn == 0 || pawn2.pawn == 1){
            console.log("Drapeau éliminé");
   
        }
        else if (pawn2.pawn == 110 || pawn2.pawn == 111){
            console.log("Explosion d'une bombe");
            this.board[pawn2.y][pawn2.x] = pawn2;

            return 3;
        }
        else if ((pawn1.pawn-pawn2.pawn) > 2){
            console.log("Attaque réussie");
        }
        else if ((pawn1.pawn-pawn2.pawn) < -2){
            console.log("Attaque ratée");
            this.board[pawn2.y][pawn2.x] = pawn2;

            return 3;
        }
        else{
            console.log("Egalité")
            this.board[pawn2.y][pawn2.x] = null;
            this.board[pawn1.y][pawn1.x] = null;
            return 2;
        }

        console.log('oui');
        this.board[pawn2.y][pawn2.x] = pawn1;
 
        return true;
    }

    //retourne un 'tableau' contenant le nombre de chaque pions par joueur
    counter(playerId){
        let mar=0,gen=0,col=0,com=0,cap=0,lie=0,ser=0,dem=0,ecl=0,esp=0,dra=0,bom=0;
        let array = new Array(12);
        for(let i = 0 ; i<10 ; i++){
            for (let j = 0 ; j<10 ; j++)
            {
                if (this.board[j][i] != null && this.board[j][i] != 'b' && this.board[j][i].player == playerId){
                    switch (this.board[j][i].pawn){
                        default : break;
                        case 110 + playerId :
                            bom++;
                            break;

                        case 100 + playerId :
                            mar++;
                            break;

                        case 90 + playerId :
                            gen++;
                            break;

                        case 80 + playerId :
                            col++;
                            break;

                        case 70 + playerId :
                            com++;
                            break;

                        case 60 + playerId :
                            cap++;
                            break;

                        case 50 + playerId :
                            lie++;
                            break;

                        case 40 + playerId :
                            ser++;
                            break;

                        case 30 + playerId :
                            dem++;
                            break;

                        case 20 + playerId :
                            ecl++;
                            break;

                        case 10 + playerId :
                            esp++;
                            break;

                        case 0 + playerId :
                            dra++;
                            break;
                    }
                }
            }
        }
        array[0] = dra;
        array[1] = esp;
        array[2] = ecl;
        array[3] = dem;
        array[4] = ser;
        array[5] = lie;
        array[6] = cap;
        array[7] = com;
        array[8] = col;
        array[9] = gen;
        array[10] = mar;
        array[11] = bom;
        return array;
    }

    //retourne 'id du joueur gagnant' (0 ou 1), '-1' si aucun vainqueur.
    hasWinner(){
    
        let count0 = this.counter(0);
        let count1 = this.counter(1);

        if (!count0[0]){
            console.log("Le joueur 0 n'a plus de drapeau : Victoire du joueur 1 !");
            return 1;
        }
        else if (!count1[0]){
            console.log("Le joueur 1 n'a plus de drapeau : Victoire du joueur 0 !");
            return 0;
        }
        else if (count0[1] == 0 && count0[2] == 0 && count0[3] == 0 && count0[4] == 0 && count0[5] == 0 && count0[6] == 0 && count0[7] == 0 && count0[8] == 0 && count0[9] == 0 && count0[10] == 0){
            console.log("Le joueur 0 n'a plus de pièce mobile : Victoire du joueur 1 !");
            return 1;
        }
        else if (count1[1] == 0 && count1[2] == 0 && count1[3] == 0 && count1[4] == 0 && count1[5] == 0 && count1[6] == 0 && count1[7] == 0 && count1[8] == 0 && count1[9] == 0 && count1[10] == 0){
            console.log("Le joueur 1 n'a plus de pièce mobile : Victoire du joueur 0 !");
            return 0;
        }
        else{
            console.log("Pas encore de vainqueur.")
            return -1;
        }

    }


    getPawn(x,y){

        return this.board[x][y].pawn;
    }

    
    //retourne un 'tableau de 4 éléments' avec tous les move possibles classés par direction (nord sud etc..), 'false' si pas de move dispo
    
    //a.n : si list['n'] == null alors pas de déplacement possible vers le nord ('n')
    //a.n : list['n']['action'] renvois l'action possible vers le nord ('none','attack' ou 'move');
    //a.n : list['n']['coordx (ou coordy)'] renvois la coordonnée du move disponible (case vide si list['n'] == null)
    moveList(x,y,dir){
        let list = {};
        if (this.board[y][x] == null || this.board[y][x] == 'b'){
            console.log("Aucune action disponible depuis cette case");
            return false;
        }
        else if(this.board[y][x].pawn == 0+this.board[y][x].player ||this.board[y][x].pawn == 110+this.board[y][x].player){
            console.log("Les bombes ou drapeaux ne peuvent se déplacer");
            return false;
        }
        let pawn = this.getCaseState(x,y);
        if (pawn.pawn != 20 && pawn.pawn != 21){
            list = this.nesw(pawn,dir,list);
            return list;
        }
        else{
            console.log("dir", dir);
            list = this.neswEcl(pawn,dir,list);
            return list;
        }
    }

    nesw(pawn, dir, list){
        let x = pawn.x, y = pawn.y, dx =0, dy=0;
        if (dir == 'n'){
            dx=0;
            dy=-1;
        }
        else if (dir == 'e'){
            dx=1;
            dy=0;
        }
        else if (dir == 's'){
            dx=0;
            dy=1;
        }
        else if (dir == 'w'){
            dx=-1;
            dy=0;
        }
        else{return -1;}
        let depX = x+dx;
        let depY  = y+dy;

        if(depX > 9 || depX < 0 || depY > 9 || depY < 0 || this.board[depY][depX] == 'b'){
            list = null;
            return list;
        }

        else if (this.board[depY][depX] == null){
            list = {};
            list.dir = dir;
            list.action = 'move';      //déplacement
            list.x = depX;
            list.y = depY;
            console.log("Déplacement possible jusque'en ",depX," / ",depY);
            return list;
        }
        else if(this.board[depY][depX].player == pawn.player){
            list = null;
            return list;
        }
        else {
            list = {};
            list.dir = dir;
            list.action = 'attack';      //attack
            list.x = depX;
            list.y = depY;
            console.log("Attaque possible en ",depX," / ",depY);
            return list;
        }
    }

    neswEcl(pawn, dir, list){
        console.log('ecl', dir);
        let x = pawn.x, y = pawn.y, dx =0, dy=0;
        
        if (dir == 'n'){
            dx=0;
            dy=-1;
        }
        else if (dir == 'e'){
            dx=1;
            dy=0;
        }
        else if (dir == 's'){
            dx=0;
            dy=1;
        }
        else if (dir == 'w'){
            dx=-1;
            dy=0;
        }
        else{return -1;}
        let depX = x+dx;
        let depY  = y+dy;
        

        if(depX > 9 || depX < 0 || depY > 9 || depY < 0 || this.board[depY][depX] == 'b'){
            list = null;
            return list;
        }
        else if (this.board[depY][depX] == null){
            list = {};
            list.dir = dir;

            while( depY< 10 && depX < 10 && depY >= 0 && depX>=0 && this.board[depY][depX] == null){
                if(depY+dy< 10 && depX+dx < 10 && depY+dy >= 0 && depX+dx>=0 && this.board[depY+dy][depX + dx] != null && this.board[depY+dy][depX + dx] != 'b' && pawn.player != this.board[depY+dy][depX+dx].player){
                    list.action = 'attack';      //attack
                }
                else {
                    list.action = 'move';      //déplacement
                }
                list.x = depX;
                list.y = depY;
                depX += dx 
                depY += dy
            }
            depX -= dx 
            depY -= dy
            if(list.action == 'move'){
                console.log("Déplacement possible en ",depX," / ",depY);
            }
            if(list.action == 'attack'){
                list.x= depX+dx;
                list.y=depY+dy;
                console.log("Attaque possible en ",depX+dx," / ",depY+dy);
            }
            return list;
        }
        else if(this.board[depY][depX].player != pawn.player){
            list.action = 'attack';
            list.x= depX;
            list.y=depY;
            console.log("Attaque possible en ",list.x," / ",list.y);
            return list;
        }
        else{
            list = null;
            return list;
        }
    }
}
module.exports = Board;