import "dotenv/config"
import express from "express"
import cors from "cors"
import { GoogleGenAI } from "@google/genai";

const app = express ();
const ai = new GoogleGenAI({});
const porta = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.get("/", function(req,res) {
    res.send("Backend funzionante!");
});

app.post("/chat", async function (req, res) {
    const domanda = req.body.domanda;

    if (!domanda) {
        return res.status(400).json({
            errore: "La domanda è vuota"
        });
    }

    try {
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: domanda
        });

        res.json({
            risposta: interaction.output_text
        });
    } catch (errore) {
        console.error(errore);

        res.status(500).json({
            errore: "Errore durante la comunicazione con Gemini"
        });
    }
});

app.listen(porta, function () {
    console.log(`Server avviato su http://localhost:${porta}`);
});


/*controllo per vedere se si collega correttamente: da terminale in backend scrivere node test-gemini.js
async function main() {
    try {
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: "Explain how AI works in a few words",
        });

        console.log(interaction.output_text);
    } catch (errore) {
        console.error("Errore nella chiamata a Gemini:");
        console.error(errore);
    }
}

main();
*/