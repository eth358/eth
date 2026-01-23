// Database Initialization
let users = JSON.parse(localStorage.getItem('eth_users')) || [CONFIG.admin];
let invites = JSON.parse(localStorage.getItem('eth_invites')) || CONFIG.startingInvites;
let currentUser = null;

const auth = {
    login: () => {
        const u = document.getElementById('l-user').value;
        const p = document.getElementById('l-pass').value;
        const found = users.find(x => x.user === u && x.pass === p);
        
        if (found) {
            currentUser = found;
            ui.showApp();
        } else {
            alert("INVALID CREDENTIALS");
        }
    },

    register: () => {
        const inv = document.getElementById('r-inv').value;
        const u = document.getElementById('r-user').value;
        const p = document.getElementById('r-pass').value;

        if (users.length >= CONFIG.maxUsers) return alert("SYSTEM CAPACITY FULL (MAX 2)");
        if (!invites.includes(inv)) return alert("INVALID INVITE");
        if (users.find(x => x.user === u)) return alert("USERNAME TAKEN");

        // Create user and consume invite
        const newUser = { user: u, pass: p, role: "MEMBER", img: `https://ui-avatars.com/api/?name=${u}` };
        users.push(newUser);
        invites = invites.filter(x => x !== inv);
        
        localStorage.setItem('eth_users', JSON.stringify(users));
        localStorage.setItem('eth_invites', JSON.stringify(invites));
        
        alert("REGISTERED. LOG IN NOW.");
        ui.toggleAuth('login');
    },

    genInvite: () => {
        const code = "ETH-" + Math.floor(Math.random() * 8999 + 1000);
        invites.push(code);
        localStorage.setItem('eth_invites', JSON.stringify(invites));
        ui.updateInvites();
    },

    logout: () => location.reload()
};

const profile = {
    save: () => {
        const newImg = document.getElementById('edit-img').value;
        const newRole = document.getElementById('edit-role').value;

        // Find current user in the 'users' array and update them
        const index = users.findIndex(x => x.user === currentUser.user);
        if (newImg) users[index].img = newImg;
        if (newRole) users[index].role = newRole;

        localStorage.setItem('eth_users', JSON.stringify(users));
        currentUser = users[index]; // Update local session
        ui.refreshProfile();
        ui.toggleEditor();
    }
};

const ui = {
    toggleAuth: (mode) => {
        document.getElementById('login-box').classList.toggle('hidden', mode === 'reg');
        document.getElementById('reg-box').classList.toggle('hidden', mode === 'login');
        document.getElementById('auth-title').innerText = mode.toUpperCase();
    },

    showApp: () => {
        document.getElementById('auth-ui').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        ui.refreshProfile();
        
        if (currentUser.user === "root") {
            document.getElementById('admin-card').classList.remove('hidden');
            ui.updateInvites();
        }
    },

    refreshProfile: () => {
        document.getElementById('p-name').innerText = currentUser.user.toUpperCase();
        document.getElementById('p-role').innerText = currentUser.role;
        document.getElementById('p-img').src = currentUser.img || `https://ui-avatars.com/api/?name=${currentUser.user}`;
    },

    toggleEditor: () => document.getElementById('editor').classList.toggle('hidden'),

    updateInvites: () => {
        const list = document.getElementById('invite-list');
        list.innerHTML = invites.map(c => `<li>${c}</li>`).join('');
    }
};

// Start music and entrance on click
document.getElementById('entrance').onclick = function() {
    this.classList.add('hidden');
    document.getElementById('auth-ui').classList.remove('hidden');
    const music = document.getElementById('bg-music');
    music.src = CONFIG.defaultMusic;
    music.play();
};
