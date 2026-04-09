import { sendMessage } from "./index.js";

test("sendMessage läuft ohne Fehler", async () => {
    await sendMessage("Test", "Hallo");
});