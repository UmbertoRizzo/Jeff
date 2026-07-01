const bottone = document.querySelector(".bottone");

let isDragging = false;

bottone.addEventListener("pointerdown", function(e) {
    isDragging = true;
    bottone.style.transition = "none";
    bottone.setPointerCapture(e.pointerId);
});

bottone.addEventListener("pointermove", function(e) {
    if (isDragging===false) {
        return;
    }
    bottone.style.right = window.innerWidth - e.clientX - bottone.offsetWidth/2 + "px";
    bottone.style.bottom = window.innerHeight - e.clientY - bottone.offsetHeight/2 + "px";
});

bottone.addEventListener("pointerup", function(e) {
    isDragging=false;
    bottone.style.transition = "right 0.25s ease, bottom 0.25s ease";

    //riposizionamento del bottone sul bordo e nei limiti di altezza
    if(e.clientX < window.innerWidth / 2) {
        bottone.style.right = window.innerWidth - 20 - bottone.offsetWidth + "px";
    } else {
        bottone.style.right = "20px";
    }

    let bottom = parseFloat(bottone.style.bottom);

    if (bottom < 20) {
        bottone.style.bottom = "20px";
    } else if (bottom + bottone.offsetHeight > window.innerHeight - 20) {
        bottone.style.bottom = window.innerHeight - 20 - bottone.offsetHeight + "px";
    }
    bottone.releasePointerCapture(e.pointerId);
})