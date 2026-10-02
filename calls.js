export function initCall(receiverUid) {
    console.log(`Starting call to ${receiverUid}...`);
    // In a real P2P implementation, we would use WebRTC
    // For this prototype, we simulate a call UI
    showCallOverlay(receiverUid);
}

function showCallOverlay(receiverUid) {
    const overlay = document.createElement('div');
    overlay.id = 'call-overlay';
    overlay.innerHTML = `
        <div class="call-card">
            <h3>Звонок: ${receiverUid}</h3>
            <div class="call-timer">00:00</div>
            <div class="call-actions">
                <button onclick="endCall()" class="end-call-btn">Завершить</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

window.startCall = () => {
    const receiverUid = localStorage.getItem('activeChatUid') || 'Unknown';
    initCall(receiverUid);
};

window.endCall = () => {
    const overlay = document.getElementById('call-overlay');
    if (overlay) overlay.remove();
};
