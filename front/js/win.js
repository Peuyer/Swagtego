const winScreen = document.getElementById('winScreen')
const restartBtn = document.getElementById('restartGame')
const winnerMessage = document.getElementById("winner");
const confettiBtn = document.getElementById("confettiLauncher");


restartBtn.addEventListener('click', restartGame);
confettiBtn.addEventListener('click', launchConfetti);


function restartGame(){
    clickAudio()
    location.reload(); 
}

function displayWin(winnerId){
    stopTimer();
    
    winScreen.style.display = 'block';
    
    gameScreen.style.display = 'none';
    initialScreen.style.display = 'none';
    if (playerNum == winnerId){
        confettiBtn.style.display = 'block';
        launchConfetti(); 
        winnerMessage.innerHTML = "Vous avez gagné la partie !";
    }
    else{
        confettiBtn.style.display = 'none';
        winnerMessage.innerHTML = "Vous avez perdu la partie !";
    } 
    winnerInfo.innerHTML = 'La partie a duré '+toHour(end)+'.';
}

function launchConfetti(){
    confettiAudio();
    startConfetti();    
    setTimeout(()=>{
        stopConfetti();
    },3000)
}
