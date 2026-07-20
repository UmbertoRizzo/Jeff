(function () {
    if (window.JeffWidgetLoaded) {
        return;
    }

    window.JeffWidgetLoaded = true;

    const currentScript = document.currentScript;
    const baseUrl = currentScript && currentScript.src
        ? new URL(".", currentScript.src).href
        : "https://umbertorizzo.github.io/Jeff/frontend/";
    const scriptUrl = currentScript && currentScript.src
        ? new URL(currentScript.src)
        : null;
    const cacheBuster = scriptUrl && scriptUrl.search
        ? scriptUrl.search
        : "?v=20260720-1";

    const defaults = {
        siteId: window.location.hostname || "demo",
        assistantName: "Jeff",
        buttonText: "Assistente virtuale",
        welcomeMessage: "Ciao, io sono Jeff. Come posso aiutarti?",
        inputPlaceholder: "Scrivi una domanda...",
        primaryColor: "#c71e32",
        secondaryColor: "#f5f5f5",
        textColor: "#ffffff",
        positionRight: "20px",
        positionBottom: "40px",
        size: "calc(6vmin + 70px)",
        backendUrl: "https://jeff-b2gq.onrender.com/chat"
    };

    const dataConfig = currentScript ? {
        siteId: currentScript.dataset.siteId,
        assistantName: currentScript.dataset.assistantName,
        primaryColor: currentScript.dataset.primaryColor,
        backendUrl: currentScript.dataset.backendUrl
    } : {};

    const definedDataConfig = Object.fromEntries(
        Object.entries(dataConfig).filter(([, value]) => value)
    );

    const config = Object.freeze({
        ...defaults,
        ...(window.JeffWidgetConfig || {}),
        ...definedDataConfig
    });

    window.JeffWidgetConfig = config;

    function loadStylesheet(href) {
        if (document.querySelector(`link[href="${href}"]`)) {
            return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        element.className = className;

        if (text) {
            element.textContent = text;
        }

        return element;
    }

    function applyTheme(element) {
        element.style.setProperty("--primary-color", config.primaryColor);
        element.style.setProperty("--secondary-color", config.secondaryColor);
        element.style.setProperty("--text-color", config.textColor);
        element.style.setProperty("--position-right", config.positionRight);
        element.style.setProperty("--position-bottom", config.positionBottom);
        element.style.setProperty("--dimension", config.size);
    }

    function insertWidgetHtml() {
        if (document.querySelector("[data-jeff-widget]")) {
            return;
        }

        const button = createElement("button", "jeff-button");
        button.type = "button";
        button.dataset.jeffWidget = "button";
        button.setAttribute("aria-label", `Apri ${config.assistantName}`);
        button.append(
            createElement("span", "jeff-right-arrow", "<"),
            createElement("span", "jeff-left-arrow", ">"),
            createElement("span", "jeff-label", config.buttonText)
        );

        const chat = createElement("section", "jeff-chat");
        chat.dataset.jeffWidget = "chat";
        chat.setAttribute("aria-label", `Chat con ${config.assistantName}`);

        const resizeButton = createElement("button", "jeff-resize", "╔");
        resizeButton.type = "button";
        resizeButton.setAttribute("aria-label", "Ridimensiona chat");

        const resetButton = createElement("button", "jeff-reset");
        resetButton.type = "button";
        resetButton.setAttribute("aria-label", "Cancella chat");

        const trashIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        trashIcon.setAttribute("class", "jeff-trash-icon");
        trashIcon.setAttribute("viewBox", "0 0 24 24");
        trashIcon.setAttribute("aria-hidden", "true");

        ["M3 6h18", "M8 6V4h8v2", "M6 6l1 15h10l1-15", "M10 11v6", "M14 11v6"].forEach(function (pathData) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            trashIcon.appendChild(path);
        });

        resetButton.appendChild(trashIcon);

        const closeButton = createElement("button", "jeff-close", "-");
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Chiudi chat");

        const messages = createElement("div", "jeff-chat-messages");
        messages.appendChild(createElement("div", "jeff-bot-message", config.welcomeMessage));

        const form = createElement("form", "jeff-chat-form");
        const input = createElement("textarea", "jeff-chat-input");
        input.rows = 1;
        input.placeholder = config.inputPlaceholder;
        input.setAttribute("aria-label", "Messaggio");

        const sendButton = createElement("button", "jeff-send", "➤");
        sendButton.type = "submit";
        sendButton.setAttribute("aria-label", "Invia messaggio");
        form.append(input, sendButton);
        chat.append(resizeButton, resetButton, closeButton, messages, form);

        applyTheme(button);
        applyTheme(chat);
        document.body.append(button, chat);
    }

    function loadAppScript() {
        const script = document.createElement("script");
        script.src = `${baseUrl}assets/js/widget-app.js${cacheBuster}`;
        document.body.appendChild(script);
    }

    function initWidget() {
        loadStylesheet("https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols+2&display=swap");
        loadStylesheet("https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap");
        loadStylesheet(`${baseUrl}assets/css/widget.css${cacheBuster}`);
        insertWidgetHtml();
        loadAppScript();
    }

    if (document.body) {
        initWidget();
    } else {
        document.addEventListener("DOMContentLoaded", initWidget, { once: true });
    }
})();
