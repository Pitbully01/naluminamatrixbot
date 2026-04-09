import express from 'express';
import { MatrixClient } from 'matrix-bot-sdk';

const client = new MatrixClient(
    "https://matrix.org",
    "DUMMY_TOKEN"
);

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send("server is running");
});
if (process.env.NODE_ENV !== "test") {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}
app.post('/webhook', async (req, res) => {
    const { title, message } = req.body;

    if (!message) {
        return res.status(400).send("message is required");
    }
    sendMessage(title, message);

    res.send("ok");
});

export async function sendMessage(title, message) {
    console.log("=== SEND MESSAGE ===");
    console.log("Title:", title || "no title provided");
    console.log("Message:", message);
}