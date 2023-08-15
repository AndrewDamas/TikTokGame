let letterSquare = document.getElementById("letter");
let square = document.querySelectorAll(".letter-square");
let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

let skip = document.getElementById("skip");
let restart = document.getElementById("restart");
let userInput = document.getElementById("user-input");

let skipsUsedDiv = document.getElementById("skips-remaining-div");

let skipsRemaining = 10;
let skipsRemainingShow = document.getElementById("skips-remaining");

let tilesRemaining = 15;

let letter = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
letterSquare.innerHTML = letter;

let invisible = document.getElementById('invisible');

let canClick = true;
document.getElementById("restart-img").src = "./No-Restart.png"

skipsRemainingShow.innerHTML = (skipsRemaining - 10) * - 1;
skipsRemainingShow.style.color = "#F39E07";
skipsRemainingShow.style.marginRight = "2px";

skipsUsedDiv.classList.add("none");

const videoElement = document.getElementById('camera-feed');

function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = now.getMinutes();

    if(hours > 12){
        hours = hours - 12;
    }

    const formattedTime = `${hours}:${padZero(minutes)}`;
    currentTimeElement.textContent = formattedTime;

    setTimeout(updateCurrentTime, 1000);
}

function padZero(number) {
    return (number < 10) ? `0${number}` : number;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCurrentTime();
});


async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    startCamera();
});

const changeLetter = (timeout = true) => {
    letter = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
    if(timeout){
        setTimeout(function(){
            letterSquare.innerHTML = letter;
        }, 400)
    } else {
        letterSquare.innerHTML = letter;
    }
}

square.forEach(e => {
    e.addEventListener("click", e2 => {
        if(e.classList.contains("has-no-letter") && canClick){
            canClick = false;
            setTimeout(function(){
                canClick = true;
            }, 800)
            document.getElementById("restart-img").src = "./Restart.png"

            let rect = e.getBoundingClientRect();
            let letterPos = letterSquare.getBoundingClientRect();
            console.log(rect);
            console.log(letterPos);

            let translateX = rect.left - letterPos.left - 12.5;
            let translateY = rect.top - letterPos.top - 11.5;

            invisible.classList.add('invisible-on');

            letterSquare.style.transition = "all 0.4s ease-in-out";
            letterSquare.style.transform = `translate(${translateX}px, ${translateY}px) scale(1)`;            
            letterSquare.style.position = "absolute";
            letterSquare.style.fontSize = "20px";
            letterSquare.style.width = "25px";
            letterSquare.style.height = "25px";

            setTimeout(() => {
                e.innerHTML = letterSquare.innerHTML;
                letterSquare.style.transition = "none";
                letterSquare.style.fontSize = "38px";
                letterSquare.style.width = "50px";
                letterSquare.style.height = "50px";
                letterSquare.style.transform = 'translate(0, 0) scale(1)';
                letterSquare.innerHTML = e.innerHTML;
                if(tilesRemaining === 1){
                    letterSquare.style.fontSize = "20px";
                    letterSquare.innerHTML = "END.";
                } else{
                    changeLetter(false);
                    tilesRemaining -= 1;
                }
                e.classList.add('has-letter');
                e.classList.remove('has-no-letter');
            }, 400)
        }
    })
})

restart.addEventListener("click", () => {
    if(canClick && tilesRemaining < 15){
        skipsRemainingShow.style.color = "#F39E07";
        canClick = false;
        setTimeout(function(){
            canClick = true;
        }, 800)
        document.getElementById("skip-img").src = "./Skip.png"
        restart.classList.add('clicked');
        letterSquare.classList.add('skipped');
        if(letterSquare.innerHTML === "END."){
            setTimeout(() => {
                letterSquare.style.fontSize = "38px";
            },400)
        } else {
            letterSquare.style.fontSize = "38px";
        }
        skipsRemaining = 10;
        document.getElementById("restart-img").src = "./No-Restart.png"
        skipsRemainingShow.innerHTML = (skipsRemaining - 10) * - 1;
        square.forEach(e => e.innerHTML = "");
        changeLetter();
        square.forEach(e => {
            e.classList.add("has-no-letter");
            e.classList.remove("has-letter");
        })
        tilesRemaining = 15;
        restart.addEventListener('animationend', () => {
            restart.classList.remove('clicked')
        }, {once: true});
        letterSquare.addEventListener('animationend',() =>{
            letterSquare.classList.remove('skipped')
        })
    }
})


skip.addEventListener("click", () => {
    if(canClick && letterSquare.innerHTML !== "END."){
        if(skipsRemaining > 0){
            setTimeout(() => {
                skipsUsedDiv.classList.add("show");
                skipsUsedDiv.classList.remove("none-animation");
                skipsUsedDiv.classList.remove("none");
                skipsRemainingShow.innerHTML = (skipsRemaining - 10) * - 1;
            }, 800)
            setTimeout(() => {
                skipsUsedDiv.classList.add("none");
            }, 2400)
            setTimeout(() => {
                canClick = true;
            }, 1600)
            skipsUsedDiv.addEventListener('animationend', () => {
                skipsUsedDiv.classList.add("none-animation");
            })
            canClick = false;
            skip.classList.add('clicked');
            letterSquare.classList.add('skipped');
            skipsRemaining -= 1;
            if(skipsRemaining < 6){
                skipsRemainingShow.style.color = "#D3211D";
            }
            if(skipsRemaining === 0){
                document.getElementById("skip-img").src = "./No-Skip.png"
            }
            changeLetter();
            skip.addEventListener('animationend', () => {
                skip.classList.remove('clicked')
            }, {once: true});
            letterSquare.addEventListener('animationend',() =>{
                letterSquare.classList.remove('skipped')
            })
        }
    }
})