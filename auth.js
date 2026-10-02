import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper to convert nickname to a fake email for Firebase Auth
const nicknameToEmail = (nickname) => `${nickname.toLowerCase()}@aether.local`;

export async function register(nickname, password) {
    const email = nicknameToEmail(nickname);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store nickname in Firestore
        await setDoc(doc(db, "users", user.uid), {
            nickname: nickname,
            uid: user.uid,
            createdAt: new Date()
        });

        return user;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

export async function login(nickname, password) {
    const email = nicknameToEmail(nickname);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export function observeAuth(callback) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            callback({ ...user, nickname: userDoc.data()?.nickname });
        } else {
            callback(null);
        }
    });
}

window.handleRegister = async () => {
    const nickname = document.getElementById('reg-nickname').value;
    const password = document.getElementById('reg-password').value;
    if (!nickname || !password) return alert("Заполните все поля");
    try {
        await register(nickname, password);
        document.getElementById('auth-overlay').style.display = 'none';
    } catch (e) {
        alert("Ошибка регистрации: " + e.message);
    }
};

window.handleLogin = async () => {
    const nickname = document.getElementById('login-nickname').value;
    const password = document.getElementById('login-password').value;
    if (!nickname || !password) return alert("Заполните все поля");
    try {
        await login(nickname, password);
        document.getElementById('auth-overlay').style.display = 'none';
    } catch (e) {
        alert("Ошибка входа: " + e.message);
    }
};

observeAuth((user) => {
    if (user) {
        document.getElementById('auth-overlay').style.display = 'none';
        console.log("Logged in as:", user.nickname);
    } else {
        document.getElementById('auth-overlay').style.display = 'flex';
    }
});
