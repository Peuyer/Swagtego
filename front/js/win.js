const winScreen = document.getElementById('winScreen')
const restartBtn = document.getElementById('restartGame')
const winnerMessage = document.getElementById("winner");
const winnerInfo = document.getElementById("winnerInfo");


restartBtn.addEventListener('click', restartGame);

function restartGame(){
    location.reload(); 
}

function displayWin(winnerId){
    stopTimer();
    
    winScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    initialScreen.style.display = 'none';
    if (playerNum == winnerId){
        startConfetti();

        winnerMessage.innerHTML = "Vous avez gagné la partie !";
    }
    else{
        winnerMessage.innerHTML = "Vous avez perdu la partie !";
    } 
    winnerInfo.innerHTML = 'La partie a duré '+toHour(end)+'.';
    setTimeout(()=>{
        stopConfetti();
    },5000)
}
