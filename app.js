import { observeAuth } from "./auth.js";
import { listenToMessages } from "./messaging.js";
import { initDefaultBots } from "./bots.js";

let currentUser = null;

observeAuth((user) => {
    currentUser = user;
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid, nickname: user.nickname }));
        initDefaultBots(user.uid);
        startGlobalListener(user.uid);
    } else {
        localStorage.removeItem('currentUser');
    }
});

function startGlobalListener(uid) {
    // For prototype, we listen to 'everyone' channel
    listenToMessages(uid, 'everyone', (messages) => {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.senderUid === uid ? 'sent' : 'received'}`;
            div.innerHTML = msg.htmlContent || msg.text;
            container.appendChild(div);
        });
        container.scrollTop = container.scrollHeight;
    });
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
