(function () {
    if (window.JeffWidgetLoaded) {
        return;
    }

    window.JeffWidgetLoaded = true;

    const currentScript = document.currentScript;
    const baseUrl = currentScript && currentScript.src
        ? new URL(".", currentScript.src).href
        : "https://umbertorizzo.github.io/Jeff/";
    const cacheBuster = currentScript && currentScript.src
        ? new URL(currentScript.src).search || "?v=20260716"
        : "?v=20260716";

    function loadStylesheet(href) {
        const existingLink = document.querySelector(`link[href="${href}"]`);

        if (existingLink) {
            return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function insertWidgetHtml() {
        if (document.querySelector(".bottone") || document.querySelector(".chat")) {
            return;
        }

        document.body.insertAdjacentHTML("beforeend", `
            <button class="bottone">
                <span class="right-arrow">&lt</span>
                <span class="left-arrow">&gt</span>
                <span class="text">Assistente<br>virtuale</span>
            </button>

            <section class="chat">
                <button class="resize-chat">
                    <span>╔</span>
                </button>
                <button class="ricarica-chat">
                    <span>↻</span>
                </button>
                <button class="close-button">
                    <span>-</span>
                </button>
                <div class="chat-messages">
                    <div class="bot-message">Ciao a tutti, io sono Jeff. Come posso aiutarti?</div>
                </div>
                <form class="chat-form">
                    <textarea class="chat-input" rows="1" type="text"></textarea>
                    <button class="send-button" type="button">➤</button>
                </form>
            </section>
        `);
    }

    function loadAppScript() {
        const script = document.createElement("script");
        script.src = `${baseUrl}app.js${cacheBuster}`;
        document.body.appendChild(script);
    }

    function initWidget() {
        loadStylesheet("https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols+2&display=swap")
        loadStylesheet("https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap");
        loadStylesheet(`${baseUrl}style.css${cacheBuster}`);
        insertWidgetHtml();
        loadAppScript();
    }

    if (document.body) {
        initWidget();
    } else {
        document.addEventListener("DOMContentLoaded", initWidget, { once: true });
    }
})();
