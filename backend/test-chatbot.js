import "dotenv/config"
import express from "express"
import cors from "cors"
import OpenAI from "openai"
const app = express ();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
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
        const response = await openai.responses.create({
            model: "gpt-5-nano",
            input: domanda
        });

        res.json({
            risposta: response.output_text
        });
    } catch (errore) {
        console.error(errore);

        res.status(500).json({
            errore: "Errore durante la comunicazione con openAI"
        });
    }
});

app.listen(porta, function () {
    console.log(`Server avviato su http://localhost:${porta}`);
});


/*controllo per vedere se si collega correttamente: da terminale in backend scrivere node test-chatbot.js
async function main() {
    try {
        const interaction = await openai.responses.create({
            model: "gpt-5-nano",
            input: "Explain how AI works in a few words",
        });

        console.log(interaction.output_text);
    } catch (errore) {
        console.error("Errore nella chiamata a OpenAI:");
        console.error(errore);
    }
}

main();
*/
