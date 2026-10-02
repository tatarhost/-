import { sendMessage, listenToMessages } from "./messaging.js";

class BotHost {
    constructor(botId, botName, logic) {
        this.botId = botId;
        this.botName = botName;
        this.logic = logic; // Function that takes a message and returns a response
        this.unsubscribe = null;
    }

    start(userUid) {
        console.log(`Bot ${this.botName} starting host on user ${userUid}...`);
        this.unsubscribe = listenToMessages('everyone', this.botId, async (messages) => {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg && lastMsg.senderUid !== this.botId) {
                const response = await this.logic(lastMsg.text);
                if (response) {
                    await sendMessage(this.botId, lastMsg.senderUid, response);
                }
            }
        });
    }

    stop() {
        if (this.unsubscribe) this.unsubscribe();
    }
}

export const BotFramework = {
    createBot: (name, logic) => {
        const botId = "bot_" + Math.random().toString(36).substr(2, 9);
        return new BotHost(botId, name, logic);
    }
};

// Example bot implementation
export function initDefaultBots(userUid) {
    const echoBot = BotFramework.createBot("EchoBot", async (text) => {
        return `Вы сказали: ${text}`;
    });
    echoBot.start(userUid);
}
