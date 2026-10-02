const VIRTUAL_DOMAINS = {};

export function registerDomain(domain, content) {
    if (VIRTUAL_DOMAINS[domain]) {
        throw new Error("Domain already exists");
    }
    VIRTUAL_DOMAINS[domain] = content;
}

export function navigate(url) {
    const domain = url.replace('aether://', '');
    if (VIRTUAL_DOMAINS[domain]) {
        renderPage(VIRTUAL_DOMAINS[domain]);
    } else {
        renderError("404: Page Not Found");
    }
}

function renderPage(content) {
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = `<div class="browser-container">${content}</div>`;
}

function renderError(msg) {
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = `<div class="browser-error">${msg}</div>`;
}

// Integration with bots to allow them to register their own web interface
export function initBotInterface(botId, htmlContent) {
    const domain = `${botId}.aether`;
    registerDomain(domain, htmlContent);
    return `aether://${domain}`;
}
