let moveaudio = new Audio('../audio/pawn_sound.wav');
let attackaudio = new Audio('../audio/attack.wav');
let rareattackaudio = new Audio('../audio/rare_attack.wav');
let confettihorn = new Audio('../audio/confettihorn.wav');
let click = new Audio('../audio/click.wav');


moveaudio.volume=0.9;
attackaudio.volume=0.3;
rareattackaudio.volume=1;
confettihorn.volume=0.2;


function moveAudio(length){
    if (length){
        moveaudio.play();
        setTimeout(()=>{
        moveAudio(length-1);
        },300);
    }
    return;
}

function attackAudio(){
    let rand = Math.floor(Math.random()*100);
    if (rand < 10){
        rareattackaudio.play();
    }
    else{
        attackaudio.play();
    }
}

function confettiAudio(){
    confettihorn.play();
}

function clickAudio(){
    click.play();
}