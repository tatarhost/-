const OPENROUTER_API_KEY = "PLACEHOLDER_API_KEY";
const MODEL = "arcee-ai/trinity-large-preview:free";

export async function askAI(prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (e) {
        console.error("AI Agent error:", e);
        return "Извините, я временно недоступен.";
    }
}

window.handleAIChat = async () => {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text) return;

    appendLocalMessage('user', text);
    input.value = '';

    const aiResponse = await askAI(text);
    appendLocalMessage('ai', aiResponse);
};

function appendLocalMessage(role, text) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${role === 'user' ? 'sent' : 'received'}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
