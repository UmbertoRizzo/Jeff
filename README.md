# Jeff
# Jeff è il test iniziale del widget-AI che andremo a implementare nei siti dei comuni per aiutare i consumatori e semplificare la vita ai poveri operatori comunali che si trovano a leggere e rispondere a domande banali e ripetitive. 
# Qui si scriverà solo codice per la parte grafica
#
# Your site is live at https://umbertorizzo.github.io/Jeff/ 
#
# Per far funzionare il widget, disattivare sfondo e  incollare nella console 
const script = document.createElement("script");
script.src = "https://umbertorizzo.github.io/Jeff/widget.js?v=" + Date.now();
document.body.appendChild(script);