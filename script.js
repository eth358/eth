document.addEventListener("DOMContentLoaded", () => {
    // === CONFIG YÜKLEME ===
    // Config yoksa hata vermesin diye try-catch
    try {
        if (typeof config !== 'undefined') {
            document.title = config.pageTitle;
            document.getElementById("username").innerText = config.username;
            document.getElementById("avatar").src = config.avatarUrl;
            
            // Arka Plan
            const bg = document.getElementById("background");
            if(config.backgroundUrl.endsWith(".mp4")) {
                bg.innerHTML = `<video src="${config.backgroundUrl}" autoplay loop muted playsinline></video>`;
            } else {
                bg.style.backgroundImage = `url('${config.backgroundUrl}')`;
            }

            // Rozetler
            const badgesContainer = document.getElementById("badges");
            if(badgesContainer) {
                config.badges.forEach(badge => {
                    const i = document.createElement("i");
                    i.className = badge.icon;
                    i.style.color = "#fff";
                    i.style.margin = "0 3px";
                    badgesContainer.appendChild(i);
                });
            }

            // Linkler
            const linksContainer = document.getElementById("links");
            config.links.forEach(link => {
                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                a.className = "link-btn";
                a.innerHTML = `<i class="${link.icon}"></i> ${link.name}`;
                
                // Cursor Efekti Tetikleyicileri
                a.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
                a.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
                
                linksContainer.appendChild(a);
            });

            // Müzik
            const audio = document.getElementById("audio");
            audio.src = config.musicUrl;
            audio.volume = config.musicVolume;

            // Typewriter
            startTypewriter(config.description);
        }
    } catch (e) {
        console.log("Config yüklenemedi veya eksik:", e);
    }
});

// === TYPEWRITER ===
function startTypewriter(texts) {
    let i = 0;
    let j = 0;
    let isDeleting = false;
    let currentText = "";
    const el = document.getElementById("typewriter");

    function type() {
        if(!el) return;
        currentText = texts[i];
        if (isDeleting) {
            el.textContent = currentText.substring(0, j - 1);
            j--;
            if (j == 0) { isDeleting = false; i++; if (i == texts.length) i = 0; }
        } else {
            el.textContent = currentText.substring(0, j + 1);
            j++;
            if (j == currentText.length) { isDeleting = true; setTimeout(type, 2000); return; }
        }
        setTimeout(type, isDeleting ? 50 : 100);
    }
    type();
}

// === GİRİŞ EKRANI & MOUSE FIX ===
const enterScreen = document.getElementById("enter-screen");
const mainCard = document.getElementById("main-card");
const audio = document.getElementById("audio");

// "Click to Enter" ekranına basılınca
enterScreen.addEventListener("click", () => {
    // 1. Ekranı Soldur
    enterScreen.style.opacity = "0";
    enterScreen.style.pointerEvents = "none"; // Tıklamayı anında kes
    
    // 2. Müziği Başlat
    if(audio) audio.play().catch(e => console.log("Ses hatası:", e));

    // 3. Ana Kartı Göster
    setTimeout(() => {
        enterScreen.style.display = "none"; // Elementi tamamen yok et (GİZLİ DUVARI KALDIR)
        mainCard.classList.add("visible");
    }, 500);
});

// Ses Aç/Kapa
function toggleMute() {
    const icon = document.getElementById("vol-icon");
    if(audio.muted) {
        audio.muted = false;
        icon.className = "fa-solid fa-volume-high";
    } else {
        audio.muted = true;
        icon.className = "fa-solid fa-volume-xmark";
    }
}

// === CUSTOM CURSOR SİSTEMİ ===
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
    // İmleci mouse pozisyonuna eşitle
    // requestAnimationFrame ile daha akıcı (lag yok)
    requestAnimationFrame(() => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
});

// === SPARKLE (KIVILCIM) EFEKTİ ===
// Bu kısım arka planda çalışır, tıklamayı etkilemez (CSS'de pointer-events:none var)
const canvas = document.getElementById("canvas");
if(canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.alpha = Math.random();
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if(this.x < 0) this.x = width;
            if(this.x > width) this.x = 0;
            if(this.y < 0) this.y = height;
            if(this.y > height) this.y = 0;
            this.alpha -= 0.003;
            if(this.alpha <= 0) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.alpha = 1;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for(let i=0; i<70; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}