import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SECRET_KEY = "aether-secure-messaging-key"; // In a real app, this would be derived from user passwords/keys
const CLOUDINARY_KEY = "GaZJHrnPMoB9soFRdRAoAqwEOsM";

export function encryptMessage(message) {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export function decryptMessage(encryptedMessage) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return "[Зашифрованное сообщение]";
    }
}

function renderMessageContent(text) {
    // Check if text is a link to an image or video (sticker)
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|mp4|webm))$/i;
    const match = text.match(urlPattern);

    if (match) {
        const url = match[1];
        if (url.endsWith('.mp4') || url.endsWith('.webm')) {
            return `<video src="${url}" autoplay loop muted class="sticker-video"></video>`;
        } else {
            return `<img src="${url}" class="sticker-img" alt="sticker">`;
        }
    }
    return text;
}

export async function sendMessage(senderUid, receiverUid, text) {
    const encryptedText = encryptMessage(text);
    try {
        await addDoc(collection(db, "messages"), {
            senderUid,
            receiverUid,
            text: encryptedText,
            timestamp: serverTimestamp(),
            chatId: [senderUid, receiverUid].sort().join('_')
        });
    } catch (e) {
        console.error("Error sending message:", e);
    }
}

export function listenToMessages(senderUid, receiverUid, callback) {
    const chatId = [senderUid, receiverUid].sort().join('_');
    const q = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            const decryptedText = decryptMessage(data.text);
            return {
                ...data,
                id: doc.id,
                text: decryptedText,
                htmlContent: renderMessageContent(decryptedText)
            };
        });
        callback(messages);
    });
}

window.sendMessage = async () => {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text) return;

    // For demo/prototype purposes, we use a fixed receiver if none selected
    // In the real app, this is set when clicking a contact
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Mock
    const receiverUid = localStorage.getItem('activeChatUid') || 'everyone';

    if (currentUser) {
        await sendMessage(currentUser.uid, receiverUid, text);
        input.value = '';
    } else {
        alert("Пожалуйста, войдите в систему");
    }
};
