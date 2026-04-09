import { sendMessage } from "./index.js";
import { jest, test } from "@jest/globals";

let logSpy;

beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
    logSpy.mockRestore();
});

jest.mock("matrix-bot-sdk", () => {
    return {
        MatrixClient: jest.fn().mockImplementation(() => ({
            sendMessage: jest.fn()
        }))
    };
});

test("sendMessage läuft ohne Fehler", async () => {
    await sendMessage("Test", "Hallo");
});

test("sendMessage gibt richtige Logs aus", async () => {
    await sendMessage("Test", "Hallo");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "Hallo"]);
});

test("sendMessage gibt richtigen Log aus, wenn kein Titel angegeben ist", async () => {
    await sendMessage(null, "Hallo");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "no title provided"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "Hallo"]);
});

test("sendMessage gibt richtigen Log aus, wenn kein Titel und keine Nachricht angegeben ist", async () => {
    await sendMessage(null, null);

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "no title provided"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", null]);
});

test("sendMessage gibt richtigen Log aus, wenn kein Titel und eine leere Nachricht angegeben ist", async () => {
    await sendMessage(null, "");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "no title provided"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", ""])
});

test("sendMessage gibt richtigen Log aus, wenn ein Titel und eine leere Nachricht angegeben ist", async () => {
    await sendMessage("Test", "");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", ""]);
}); 

test("sendMessage gibt richtigen Log aus, wenn ein Titel und eine Nachricht mit Sonderzeichen angegeben ist", async () => { 
    await sendMessage("Test", "Hallo!");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "Hallo!"]);
});

test("sendMessage gibt richtigen Log aus, wenn ein Titel und eine Nachricht mit Zeilenumbrüchen angegeben ist", async () => {
    await sendMessage("Test", "Hallo\nWie geht's?");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "Hallo\nWie geht's?"]);
});

test("sendMessage gibt richtigen Log aus, wenn ein Titel und eine Nachricht mit Unicode-Zeichen angegeben ist", async () => {
    await sendMessage("Test", "Hallo 👋");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "Hallo 👋"]);
});


test("sendMessage gibt richtigen Log aus, wenn ein Titel und eine Nachricht mit speziellen JS Escape Characters angegeben ist", async () => {
    await sendMessage("Test", "Hallo \"Welt\"");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "Hallo \"Welt\""]);
});

test("sendMessage gibt richtigen Log aus, wenn ein Titel und eine Nachricht mit potenziell gefährlichen Zeichen angegeben ist", async () => {
    await sendMessage("Test", "<script>alert('Hallo');</script>");

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", "Test"]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", "<script>alert('Hallo');</script>"]);
});

test("sendMessage gibt richtigen Log aus, wenn falsche datentypen übergeben werden", async () => {
    await sendMessage(123, {foo: "bar"});

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", 123]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", {foo: "bar"}]);
});

test("sendMessage gibt richtigen Log aus, wenn  viel zu viele zeichen übergeben werden", async () => {
    const longMessage = "a".repeat(10000);
    const longTitle = "b".repeat(10000);

    await sendMessage(longTitle, longMessage);

    expect(logSpy.mock.calls[0]).toEqual(["=== SEND MESSAGE ==="]);
    expect(logSpy.mock.calls[1]).toEqual(["Title:", longTitle]);
    expect(logSpy.mock.calls[2]).toEqual(["Message:", longMessage]);
});