const defaultSite = {
    assistantName: "Jeff",
    knowledgeMode: "general",
    instructions: "Rispondi in italiano in modo chiaro, sintetico e cortese."
};

const sites = {
    "demo-comune": {
        assistantName: "Jeff",
        knowledgeMode: "general",
        instructions: "Sei l'assistente virtuale del sito dimostrativo. Rispondi in italiano in modo chiaro e cortese."
    },
    "gestione-lupi": {
        assistantName: "Jeff",
        primaryColor: "#323d49",
        knowledgeMode: "general",
        welcomeMessage: "Ciao, io sono solo un assistente dimostrativo, su questo sito non posso fare molto. Se pensi che io possa essere utile per il tuo sito, scrivi all'amministratore di GestioneLupi alla mail udrizzo04@gmail.com! ",
        instructions: "Sei un assistente virtuale senza una reale utilità nel sito in cui ti trovi, il tuo obiettivo è essere una pubblicità, tu puoi essere installato anche se ultri siti, e tu sei qui in questo sito per farti vedere. Rispondi in italiano in modo chiaro e cortese."
    }
};

export function getSiteConfig(siteId) {
    return {
        ...defaultSite,
        ...(sites[siteId] || {})
    };
}
