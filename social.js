import { getFirestore, collection, addDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createGroup(name, creatorUid, isChannel = false) {
    try {
        const docRef = await addDoc(collection(db, "groups"), {
            name,
            creatorUid,
            isChannel,
            members: [creatorUid],
            createdAt: new Date()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error creating group:", e);
    }
}

export function listenToGroups(userUid, callback) {
    const q = query(
        collection(db, "groups"),
        where("members", "array-contains", userUid)
    );

    return onSnapshot(q, (snapshot) => {
        const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(groups);
    });
}

// UI Bridge for switching tabs
window.switchTab = (tab) => {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const chatTitle = document.getElementById('chat-title');
    chatTitle.innerText = tab.charAt(0).toUpperCase() + tab.slice(1);

    // Clear messages when switching context
    document.getElementById('chat-messages').innerHTML = '';
};
