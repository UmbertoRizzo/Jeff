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
            caricaChat(); //questa funzione è scritta assieme a carica, salva e ricarica
            chat.style.display = "flex";
            requestAnimationFrame(aggiornaAltezzaMessaggiRidimensionata);
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
const sendButton = document.querySelector(".send-button");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-input");
const closeButton = document.querySelector(".close-button");
const chatMessages = document.querySelector(".chat-messages");
const ricaricaChat = document.querySelector(".ricarica-chat");
const resizeChat = document.querySelector(".resize-chat");

//caricamento, salvataggio e ricarica chat
function salvaChat () {
    localStorage.setItem("messaggiSalvati", chatMessages.innerHTML);
}
function caricaChat() {
    const messaggiSalvati =localStorage.getItem("messaggiSalvati");

    if (messaggiSalvati) {
        chatMessages.innerHTML = messaggiSalvati;
    }
}
ricaricaChat.addEventListener("click", function (){
    localStorage.removeItem("messaggiSalvati");
    chatMessages.innerHTML = '<div class = "bot-message">Ciao a tutti, io sono Jeff. Come posso aiutarti?</div>';
    salvaChat();
})



//Funzione scritta da ChatGPT
function creaIndicatoreScrittura() {
    const typingMessage = document.createElement("div");
    typingMessage.classList.add("bot-message", "typing-message");
    typingMessage.setAttribute("aria-label", "Jeff sta scrivendo");

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("typing-dot");
        typingMessage.appendChild(dot);
    }

    return typingMessage;
}


chatInput.addEventListener("input", function() {
    chatInput.rows = 1;

    const lineHeight = 20;
    const righe = Math.ceil(chatInput.scrollHeight / lineHeight - 1);

    chatInput.rows = Math.min(righe, 5);
    aggiornaAltezzaMessaggiRidimensionata();
});

//fatto da Chat
let minChatWidth = 0;
let minChatHeight = 0;
let chatRidimensionata = false;

function preparaChatRidimensionabile() {
    if (minChatWidth === 0 || minChatHeight === 0) {
        minChatWidth = chat.offsetWidth;
        minChatHeight = chat.offsetHeight;
    }

    chatRidimensionata = true;
    chat.style.width = chat.offsetWidth + "px";
    chat.style.height = chat.offsetHeight + "px";
    chat.style.maxHeight = "none";
    chatMessages.style.maxHeight = "none";
    chatMessages.style.flex = "none";
    chatMessages.style.minHeight = "0";
}

function impostaDimensioniChat(width, height) {
    const maxWidth = Math.max(minChatWidth, window.innerWidth - 20);
    const maxHeight = Math.max(minChatHeight, window.innerHeight - 20);

    chat.style.width = Math.min(Math.max(minChatWidth, width), maxWidth) + "px";
    chat.style.height = Math.min(Math.max(minChatHeight, height), maxHeight) + "px";
    aggiornaAltezzaMessaggiRidimensionata();
}

function aggiornaAltezzaMessaggiRidimensionata() {
    if (chat.offsetHeight === 0) {
        return;
    }

    if (!chatRidimensionata) {
        chatMessages.style.height = "";
        chatMessages.style.maxHeight = "";
        return;
    }

    const chatMessagesStyle = getComputedStyle(chatMessages);
    const marginBottom = parseFloat(chatMessagesStyle.marginBottom) || 0;
    const chatStyle = getComputedStyle(chat);
    const paddingBottom = parseFloat(chatStyle.paddingBottom) || 0;
    const rowGap = parseFloat(chatStyle.rowGap) || 0;

    const availableHeight = chat.clientHeight - paddingBottom - chatForm.offsetHeight - marginBottom - rowGap;

    chatMessages.style.height = Math.max(0, availableHeight) + "px";
    chatMessages.style.maxHeight = Math.max(0, availableHeight) + "px";
}

function puntoInManigliaChat(event) {
    if (event.target.closest("button, textarea, input")) {
        return false;
    }

    const chatRect = chat.getBoundingClientRect();
    const chatStyle = getComputedStyle(chat);
    const altezzaManiglia = parseFloat(chatStyle.getPropertyValue("--chat-drag-handle-height")) || 0;

    return event.clientY >= chatRect.top && event.clientY <= chatRect.top + altezzaManiglia;
}

chat.addEventListener("pointerdown", function(event) {
    if (!puntoInManigliaChat(event)) {
        return;
    }

    event.preventDefault();

    const margine = 20;
    const startX = event.clientX;
    const startY = event.clientY;
    const startRight = parseFloat(getComputedStyle(chat).right) || 0;
    const startBottom = parseFloat(getComputedStyle(chat).bottom) || 0;

    chat.classList.add("dragging-chat");
    chat.setPointerCapture(event.pointerId);

    function trascinaChat(event) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const maxRight = Math.max(margine, window.innerWidth - chat.offsetWidth - margine);
        const maxBottom = Math.max(margine, window.innerHeight - chat.offsetHeight - margine);

        chat.style.right = Math.min(Math.max(margine, startRight - deltaX), maxRight) + "px";
        chat.style.bottom = Math.min(Math.max(margine, startBottom - deltaY), maxBottom) + "px";
    }

    function fermaTrascinamentoChat(event) {
        chat.classList.remove("dragging-chat");
        chat.releasePointerCapture(event.pointerId);
        chat.removeEventListener("pointermove", trascinaChat);
        chat.removeEventListener("pointerup", fermaTrascinamentoChat);
        chat.removeEventListener("pointercancel", fermaTrascinamentoChat);
    }

    chat.addEventListener("pointermove", trascinaChat);
    chat.addEventListener("pointerup", fermaTrascinamentoChat);
    chat.addEventListener("pointercancel", fermaTrascinamentoChat);
});

resizeChat.addEventListener("pointerdown", function(event) {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = chat.offsetWidth;
    const startHeight = chat.offsetHeight;

    preparaChatRidimensionabile();
    resizeChat.setPointerCapture(event.pointerId);

    aggiornaAltezzaMessaggiRidimensionata();

    function resize(event) {
        const newWidth = startWidth + (startX - event.clientX);
        const newHeight = startHeight + (startY - event.clientY);

        impostaDimensioniChat(newWidth, newHeight);
    }

    function stopResize(event) {
        resizeChat.releasePointerCapture(event.pointerId);
        resizeChat.removeEventListener("pointermove", resize);
        resizeChat.removeEventListener("pointerup", stopResize);
        resizeChat.removeEventListener("pointercancel", stopResize);
    }

    resizeChat.addEventListener("pointermove", resize);
    resizeChat.addEventListener("pointerup", stopResize);
    resizeChat.addEventListener("pointercancel", stopResize);
});

chat.addEventListener("touchstart", function(event) {
    if (event.touches.length !== 2) {
        return;
    }

    event.preventDefault();
    preparaChatRidimensionabile();

    const startWidth = chat.offsetWidth;
    const startHeight = chat.offsetHeight;
    const startDistance = distanzaTraTocchi(event.touches);

    function pinchResize(event) {
        if (event.touches.length !== 2) {
            return;
        }

        event.preventDefault();

        const scale = distanzaTraTocchi(event.touches) / startDistance;
        impostaDimensioniChat(startWidth * scale, startHeight * scale);
    }

    function stopPinch() {
        chat.removeEventListener("touchmove", pinchResize);
        chat.removeEventListener("touchend", stopPinch);
        chat.removeEventListener("touchcancel", stopPinch);
    }

    chat.addEventListener("touchmove", pinchResize, { passive: false });
    chat.addEventListener("touchend", stopPinch);
    chat.addEventListener("touchcancel", stopPinch);
}, { passive: false });

function distanzaTraTocchi(touches) {
    const deltaX = touches[0].clientX - touches[1].clientX;
    const deltaY = touches[0].clientY - touches[1].clientY;

    return Math.hypot(deltaX, deltaY);
}

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
    let typingMessage;

    if (sentText === "") {
        return;
    }

    userMessage.classList.add("user-message");
    userMessage.textContent = sentText;
    chatMessages.appendChild(userMessage);
    salvaChat();

    chatInput.value = "";
    chatInput.rows = 1;
    aggiornaAltezzaMessaggiRidimensionata();

    typingMessage = creaIndicatoreScrittura();
    chatMessages.appendChild(typingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

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

        typingMessage.remove();

        const botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        botMessage.textContent = data.risposta;
        chatMessages.appendChild(botMessage);
        salvaChat();
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (errore) {
        console.error("errore completo:", errore);

        if (typingMessage) {
            typingMessage.remove();
        }

        const errorMessage = document.createElement("div");
        errorMessage.classList.add("bot-message");
        errorMessage.textContent = errore.message;
        chatMessages.appendChild(errorMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
