# Jeff

Widget AI personalizzabile da integrare nei siti web.

## Struttura

```text
Jeff/
├── frontend/
│   ├── widget.js                 # file da includere nel sito ospite
│   ├── assets/
│   │   ├── css/widget.css        # aspetto del widget
│   │   └── js/widget-app.js      # comportamento e collegamento al backend
│   └── demo/index.html           # pagina locale di prova
└── backend/
    ├── src/server.js             # API della chat
    ├── src/config/sites.js       # impostazioni specifiche per sito
    └── src/services/site-context.js # punto di innesto del futuro crawler
```

## Installazione del widget

Inserire la configurazione prima dello script:

```html
<script>
    window.JeffWidgetConfig = {
        siteId: "comune-esempio",
        assistantName: "Jeff",
        buttonText: "Chiedi a Jeff",
        welcomeMessage: "Ciao, come posso aiutarti?",
        inputPlaceholder: "Scrivi una domanda...",
        primaryColor: "#c71e32",
        secondaryColor: "#f5f5f5",
        textColor: "#ffffff",
        positionRight: "20px",
        positionBottom: "40px",
        size: "130px",
        backendUrl: "https://jeff-b2gq.onrender.com/chat"
    };
</script>
<script src="https://umbertorizzo.github.io/Jeff/frontend/widget.js" defer></script>
```

Per le impostazioni essenziali si possono usare anche gli attributi dello script:

```html
<script
    src="https://umbertorizzo.github.io/Jeff/frontend/widget.js"
    data-site-id="comune-esempio"
    data-assistant-name="Jeff"
    data-primary-color="#c71e32"
    data-backend-url="https://jeff-b2gq.onrender.com/chat"
    defer>
</script>
```

## Avvio locale

Backend:

```bash
cd backend
npm install
OPENAI_API_KEY="..." npm start
```

La demo si trova in `frontend/demo/index.html` e punta al backend locale sulla porta `3000`.

## Futuro crawler

Il file `backend/src/services/site-context.js` è già inserito nel flusso della chat. Quando il crawler sarà disponibile dovrà restituire i contenuti pertinenti al sito richiesto. Impostando `knowledgeMode: "site-only"` in `backend/src/config/sites.js`, Jeff rifiuterà di rispondere quando non trova informazioni nel contesto del sito.
