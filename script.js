// Database Simulation
const DEFAULT_ADMIN = { user: "root", pass: "eth" };
let inviteCodes = JSON.parse(localStorage.getItem('invites')) || ["ETH-777"];
let users = JSON.parse(localStorage.getItem('users')) || [DEFAULT_ADMIN];

// Initialize Weather (Rain)
const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = [];
for(let i = 0; i < 100; i++) {
    drops.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, l: Math.random()*20, v: Math.random()*5+5 });
}

function drawRain() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    drops.forEach(d => {
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.l); ctx.stroke();
        d.y += d.v; if(d.y > canvas.height) d.y = -20;
    });
    requestAnimationFrame(drawRain);
}
drawRain();

// App Flow
const audio = document.getElementById('bg-audio');

document.getElementById('entrance-layer').onclick = function() {
    this.classList.add('hidden');
    document.getElementById('auth-layer').classList.remove('hidden');
    audio.play();
    audio.volume = 0.5;
};

function toggleAuth(type) {
    document.getElementById('login-form').classList.toggle('hidden', type === 'reg');
    document.getElementById('register-form').classList.toggle('hidden', type === 'login');
    document.getElementById('auth-title').innerText = type === 'reg' ? "REGISTRATION" : "SYSTEM ACCESS";
}

function handleLogin() {
    const u = document.getElementById('user-input').value;
    const p = document.getElementById('pass-input').value;
    const found = users.find(user => user.user === u && user.pass === p);

    if(found) {
        enterApp(found);
    } else {
        alert("ACCESS DENIED");
    }
}

function handleRegister() {
    const inv = document.getElementById('reg-invite').value;
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;

    if(users.length >= 2) return alert("System capacity reached (Max 2 users).");
    if(!inviteCodes.includes(inv)) return alert("Invalid Invite Code.");

    const newUser = { user: u, pass: p };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Remove invite after use
    inviteCodes = inviteCodes.filter(c => c !== inv);
    localStorage.setItem('invites', JSON.stringify(inviteCodes));

    alert("Registration successful. Please login.");
    toggleAuth('login');
}

function enterApp(user) {
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('display-name').innerText = user.user.toUpperCase();
    
    if(user.user === 'root') {
        document.getElementById('admin-panel').classList.remove('hidden');
        renderInvites();
    }
}

function generateInvite() {
    const code = "ETH-" + Math.floor(Math.random()*9999);
    inviteCodes.push(code);
    localStorage.setItem('invites', JSON.stringify(inviteCodes));
    renderInvites();
}

function renderInvites() {
    const list = document.getElementById('invite-list');
    list.innerHTML = inviteCodes.map(c => `<li>${c}</li>`).join('');
}

function logout() { location.reload(); }

document.getElementById('volume-ctrl').oninput = (e) => audio.volume = e.target.value;
