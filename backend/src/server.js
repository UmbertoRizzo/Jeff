import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { getSiteConfig } from "./config/sites.js";
import { getSiteContext } from "./services/site-context.js";

const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "32kb" }));
app.use(cors());

app.get("/", function (req, res) {
    res.send("Backend Jeff funzionante!");
});

app.post("/chat", async function (req, res) {
    const question = typeof req.body.domanda === "string" ? req.body.domanda.trim() : "";
    const siteId = typeof req.body.siteId === "string" ? req.body.siteId.trim() : "default";
    const pageUrl = typeof req.body.pageUrl === "string" ? req.body.pageUrl : "";

    if (!question) {
        return res.status(400).json({
            errore: "La domanda è vuota"
        });
    }

    try {
        const site = getSiteConfig(siteId);
        const context = await getSiteContext({ siteId, question, pageUrl });
        const hasSiteContext = context.trim().length > 0;

        if (site.knowledgeMode === "site-only" && !hasSiteContext) {
            return res.json({
                risposta: "Non trovo questa informazione nei contenuti del sito.",
                fonte: "site"
            });
        }

        const instructions = hasSiteContext
            ? `${site.instructions}\nUsa esclusivamente il contesto del sito fornito. Se la risposta non è presente, dichiaralo chiaramente.\n\nContesto del sito:\n${context}`
            : site.instructions;

        const response = await openai.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-5-nano",
            instructions,
            input: question
        });

        res.json({
            risposta: response.output_text,
            fonte: hasSiteContext ? "site" : "general"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            errore: "Il servizio non è attualmente disponibile, ci scusiamo per il disagio"
        });
    }
});

app.listen(port, function () {
    console.log(`Server avviato su http://localhost:${port}`);
});
