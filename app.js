const bottone = document.querySelector(".bottone");
const linguetta = document.querySelector(".bottone.linguetta");
const frecciaDestra = document.querySelector(".right-arrow");
const frecciaSinistra = document.querySelector(".left-arrow");
const testo = document.querySelector(".text");

//variabili per il drag del bottone
let isDragging = false;
let hasdragged = false;
let startX=0, startY=0;



function mostraBottone() {
    bottone.classList.remove("linguetta");
    bottone.style.justifyContent = "center";
    frecciaDestra.style.display = "none";
    frecciaSinistra.style.display = "none";
    testo.style.display = "inline";
}

function mostraLinguetta(lato) {
    bottone.classList.add("linguetta");
    testo.style.display = "none";

    if (lato === "destra") {
        bottone.style.right = "-120px";
        bottone.style.justifyContent = "left";
        frecciaDestra.style.display = "inline";
        frecciaSinistra.style.display = "none";
    } else {
        bottone.style.right = window.innerWidth - 60 + "px";
        bottone.style.justifyContent = "right";
        frecciaDestra.style.display = "none";
        frecciaSinistra.style.display = "inline";
    }
}

//sezione funzioni per l'opacizzazione del bottone dopo 5 secondi di inattività
let inactivityTimeout;
function deopacizzaBottone() {
    clearTimeout(inactivityTimeout);
    bottone.classList.remove("opaco");
}

function opacizzaBottone() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(function() {
        bottone.classList.add("opaco");
    }, 5000);
}


bottone.addEventListener("mouseenter", deopacizzaBottone);
bottone.addEventListener("mouseleave", opacizzaBottone);

// Event listeners for dragging the button
bottone.addEventListener("pointerdown", function(e) {
    isDragging = true;
    bottone.style.transition = "none";
    bottone.setPointerCapture(e.pointerId);
    deopacizzaBottone();
    hasdragged = false;
    startX = e.clientX;
    startY = e.clientY;
});

bottone.addEventListener("pointermove", function(e) {
    if (isDragging===false) {
        return;
    }
    bottone.style.right = window.innerWidth - e.clientX - bottone.offsetWidth/2 + "px";
    bottone.style.bottom = window.innerHeight - e.clientY - bottone.offsetHeight/2 + "px";

    if(e.clientX < window.innerWidth / 2) {
        if(e.clientX - bottone.offsetWidth/2 < 20) {
            mostraLinguetta("sinistra");
        } else {
        mostraBottone();
        }
    } else {
        if(e.clientX + bottone.offsetWidth/2 > window.innerWidth - 20) {
            mostraLinguetta("destra");
        } else {
        mostraBottone();
        }
    }

});

bottone.addEventListener("pointerup", function(e) {
    if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
        hasdragged = true;
    }
    if (hasdragged===false) {
        if (bottone.classList.contains("linguetta")) {
            mostraBottone();
            isDragging=false;
            if(e.clientX < window.innerWidth / 2) {
                bottone.style.right = window.innerWidth - 60 - bottone.offsetWidth + "px";
            } else {
                bottone.style.right = "20px";
            }
            return;
        } else {}
    }

    isDragging=false;
    bottone.style.transition = "all 0.6s ease";
    if(e.clientX < window.innerWidth / 2) {
        if(e.clientX - bottone.offsetWidth/2 < 20) {
            mostraLinguetta("sinistra");
        } else {
        bottone.style.right = window.innerWidth - 20 - bottone.offsetWidth + "px";
        }
    } else {
        if(e.clientX + bottone.offsetWidth/2 > window.innerWidth - 20) {
            mostraLinguetta("destra");
        } else {
        bottone.style.right = "20px";
        }
    }

    let bottom = parseFloat(bottone.style.bottom);

    if (bottom < 20) {
        bottone.style.bottom = "20px";
    } else if (bottom + bottone.offsetHeight > window.innerHeight - 20) {
        bottone.style.bottom = window.innerHeight - 20 - bottone.offsetHeight + "px";
    }
    bottone.releasePointerCapture(e.pointerId);

});

