const bottone = document.querySelector(".bottone");
const linguetta = document.querySelector(".bottone.linguetta");
const frecciaDestra = document.querySelector(".right-arrow");
const frecciaSinistra = document.querySelector(".left-arrow");
const testo = document.querySelector(".text");
const chat = document.querySelector(".chat");

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
        bottone.style.right = 60- bottone.offsetWidth + "px";
        bottone.style.justifyContent = "left";
        frecciaDestra.style.display = "inline";
        frecciaSinistra.style.display = "none";
    } else {
        bottone.style.right = window.innerWidth - bottone.offsetWidth * 0.35 + "px";
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
        } else {
            //comparsa della chat
            chat.style.display = "flex";
            bottone.style.display = "none";
        }
        opacizzaBottone();
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

//da qui parte il codice della gestione della chat
const sendButton = document.querySelector(".send-button")
const chatInput = document.querySelector(".chat-input");
const closeButton = document.querySelector(".close-button");
const chatMessages = document.querySelector(".chat-messages")

chatInput.addEventListener("input", function() {
    chatInput.rows = 1;

    const lineHeight = 20;
    const righe = Math.ceil(chatInput.scrollHeight / lineHeight - 1);

    chatInput.rows = Math.min(righe, 5);
});

closeButton.addEventListener("click",function() {
    const posX = chat.style.right;
    const posY = chat.style.bottom;

    chat.style.display = "none";
    bottone.style.display = "flex";

    bottone.style.right = posX;
    bottone.style.bottom = posY;
})
sendButton.addEventListener("click", async function() {
    const sentText = chatInput.value.trim();
    const userMessage = document.createElement("div");

    if (sentText === "") {
        return;
    }

    userMessage.classList.add("user-message");
    userMessage.textContent = sentText;
    chatMessages.appendChild(userMessage);

    chatInput.value = "";
    chatInput.rows = 1;

    try {
        const response = await fetch("https://jeff-b2gq.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domanda: sentText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errore || `Errore HTTP ${response.status}`);
        }

        const botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        botMessage.textContent = data.risposta;
        chatMessages.appendChild(botMessage);

    } catch (errore) {
        console.error("errore completo:", errore);

        const errorMessage = document.createElement("div");
        errorMessage.classList.add("bot-message");
        errorMessage.textContent = errore.message;
        chatMessages.appendChild(errorMessage);
    }
});