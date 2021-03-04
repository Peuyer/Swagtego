class Board {

    constructor(){
        this.currentPlayer = Math.random < 0.5;
        this.board = this.createBoard();
        
    }

    affichage(){
        let aff='';
        for(let i =0; i< 10; i++){
            for(let j =0; j< 10; j++){
                if(this.board[i][j]==null){
                    aff+=0;
                }
                else if(this.board[i][j]=='b'){
                    aff+=3;
                }
                else{
                    aff+=1;
                }
            }
            aff+= '\n';
        }
        return aff;
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

    //retourne 0 si tout les pions sont correctement placé, 0 sinon
    isCompleted(playerId)
    {
        console.log("Verification pions du joueur",playerId,"...");
        let mar=0,gen=0,col=0,com=0,cap=0,lie=0,ser=0,dem=0,ecl=0,esp=0,dra=0,bom=0;
        for(let i = 0 ; i<4 ; i++){
            for (let j = 0 ; j<10 ; j++){

                switch (this.board[x][y].pawn){
                    case 110 + playerId :
                        if(bom<6)bom++;
                        else{
                            console.log("Trop de bombes");
                            return false;}

                    case 100 + playerId :
                        if(mar<1)mar++;
                        else{
                            console.log("Trop de maréchal");
                            return false;}

                    case 90 + playerId :
                        if(gen<1)gen++;
                        else{
                            console.log("Trop de général");
                            return false;}

                    case 80 + playerId :
                        if(col<2)col++;
                        else{
                            console.log("Trop de colonel");
                            return false;}

                    case 70 + playerId :
                        if(com<3)com++;
                        else{
                            console.log("Trop de commandant");
                            return false;}

                    case 60 + playerId :
                        if(cap<4)cap++;
                        else{
                            console.log("Trop de capitaine");
                            return false;}

                    case 50 + playerId :
                        if(lie<4)lie++;
                        else{
                            console.log("Trop de lieutenant");
                            return false;}

                    case 40 + playerId :
                        if(ser<4)ser++;
                        else{
                            console.log("Trop de sergeant");
                            return false;}

                    case 30 + playerId :
                        if(dem<5)dem++;
                        else{
                            console.log("Trop de démineur");
                            return false;}

                    case 20 + playerId :
                        if(ecl<8)ecl++;
                        else{
                            console.log("Trop de éclaireur");
                            return false;}

                    case 10 + playerId :
                        if(esp<1)esp++;
                        else{
                            console.log("Trop de éspion");
                            return false;}

                    case 0 + playerId :
                        if(dra<1)dra++;
                        else{
                            console.log("Trop de drapeau");
                            return false;}
                }
            }
        }
        if (mar == 1 && gen == 1 && col == 2 && com == 3 && cap == 4 && lie == 4 && ser == 4 && dem ==  5 && ecl == 8 && esp == 1 && dra == 1 && bom == 6){
            console.log("OK");
            return true;
        }
        console.log("Pions manquants possible");
        return false;
    }

    //reset de la game
    reset()
    {
        this.board = this.createBoard();
        this.currentPlayer = Math.random < 0.5;
    }

    //retourne l'id du joueur actuel
    getCurrentPlayer()
    {
        return this.currentPlayer;
    }

    //retourne le pions sur la case x,y
    getCaseState(x,y)
    {
        return this.board[y][x];
    }

    //retourne 0 si mouvement impossible, 1 si mouvement effectué
    move(x_avant, y_avant,x,y)
    {
        let pawn = new Pawn();
        pawn = this.board[y_avant][x_avant];
        console.log(game.getCaseState(x_avant,y_avant));
        console.log(pawn.x);
        console.log(pawn.y);
        //si le pion n'est pas un éclaireur
        if (pawn.pawn != 20 && pawn.pawn != 21){
            let ex = Math.abs(pawn.x - x)
            let ey = Math.abs(pawn.y - y)

            console.log(ex);
            console.log(ey);
            if (ex == 1 || ey == 1){
                if (this.board[y][x] != null && this.board[y][x] != 'b'){
                    let attack = this.attack(pawn,this.board[y][x]);
                    if (!attack){
                        console.log("Mouvement Impossible");
                        return false;
                    }
                    else if (attack == 3 || attack == 2){
                        this.board[pawn.y][pawn.x] = null;
                        console.log("Echec de l'attaque ou égalité");
                        return 1;
                    }
                }
            }
            else {
                console.log("Mouvement impossible");
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
                console.log("Mouvement impossiblee");
                return false;
            }
            else{
                //cas d'un mouvement selon X
                if(x != pawn.x){
                    if (x < pawn.x){
                        for(let i = pawn.x-1; i != x;--i){
                            if(this.board[y][i] != null){
                                console.log("Mouvement impossible");
                                return false;
                            }
                        }
                    }
                    else{
                        for(let i = pawn.x; i != x;++i){
                            if(this.board[y][i] != null){
                                console.log("Mouvement impossible");
                                return false;
                            }
                        }
                    }
                    this.board[y][x] = pawn;
                    this.board[pawn.y][pawn.x] = null;
                    pawn.x = x;
                    pawn.y = y;
                    return 1;
                }

                //cas d'un mouvement selon Y

                if(y != pawn.y){
                    if (y < pawn.y){
                        for(let i = pawn.y-1; i != y;--i){
                            if(this.board[i][x] != null){
                                console.log("Mouvement impossible");
                                return false;
                            }
                        }
                    }
                    else{
                        for(let i = pawn.y; i != y;++i){
                            if(this.board[i][x] != null){
                                console.log("Mouvement impossible");
                                return false;
                            }
                        }
                    }
                    this.board[y][x] = pawn;
                    this.board[pawn.y][pawn.x] = null;
                    pawn.x = x;
                    pawn.y = y;
                    return 1;
                }
            }
        }
    }


    //retourne 0 si hors d'atteinte, 1 si attaque possible et 2 si éclaireur
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

    //retourne 1 si succès, 0 si erreur, 2 si égalité, 3 si échec
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
            this.board[pawn2.y][pawn2.x] = pawn2.pawn;
            return 3;
        }
        else if ((pawn1.pawn-pawn2.pawn) > 2){
            console.log("Attaque réussie");
        }
        else if ((pawn1.pawn-pawn2.pawn) < 2){
            console.log("Attaque ratée");
            this.board[pawn2.y][pawn2.x] = pawn2.pawn;
            return 3;
        }
        else{
            console.log("Egalité")
            this.board[pawn2.y][pawn2.x] = null;
            return 2;
        }

        this.board[pawn2.y][pawn2.x] = pawn1.pawn;
        return true;
    }
}


