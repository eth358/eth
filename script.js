const config = {
    username: "Etherac",
    avatar: "https://ui-avatars.com/api/?name=Etherac&background=000&color=fff&size=256",
    background: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R4eGZqY3V4eGZqY3V4eGZqY3V4eGZqY3V4eGZqY3V4eGZqY3V4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/U3qYN8S0j3bpK/giphy.gif",
    audio: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3",
    volume: 0.3,
    texts: ["Producer & Visuals", "Hoodtrap / Arabesk", "Welcome to my world", "Etherac on Top"],
    socials: [
        { name: "Spotify", url: "https://open.spotify.com/user/31vd2swzox2pn6t4jz7kll3r4e4i", icon: "fa-brands fa-spotify" },
        { name: "SoundCloud", url: "https://soundcloud.com/etherac", icon: "fa-brands fa-soundcloud" },
        { name: "YouTube", url: "https://www.youtube.com/@etherac05", icon: "fa-brands fa-youtube" },
        { name: "Discord", url: "#", icon: "fa-brands fa-discord" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    // Verileri Yükle
    document.getElementById("user-avatar").src = config.avatar;
    document.getElementById("username").innerText = config.username;
    document.getElementById("username").setAttribute("data-text", config.username);
    document.getElementById("bg-media").style.backgroundImage = `url('${config.background}')`;
    
    const audio = document.getElementById("bg-audio");
    audio.src = config.audio;
    audio.volume = config.volume;

    const linksBox = document.getElementById("links-box");
    config.socials.forEach(s => {
        const a = document.createElement("a");
        a.href = s.url;
        a.className = "link-btn";
        a.target = "_blank";
        a.innerHTML = `<i class="${s.icon}"></i> ${s.name}`;
        linksBox.appendChild(a);
    });

    // Giriş Ekranı Mantığı
    const enterScreen = document.getElementById("enter-screen");
    enterScreen.addEventListener("click", () => {
        enterScreen.style.opacity = "0";
        setTimeout(() => {
            enterScreen.style.display = "none";
            document.getElementById("main-container").classList.add("visible");
            audio.play();
        }, 1000);
    });

    // Typewriter Efekti
    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeEl = document.getElementById("typewriter");

    function type() {
        const currentText = config.texts[textIdx];
        if (isDeleting) {
            typeEl.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typeEl.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
        }

        if (!isDeleting && charIdx === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            textIdx = (textIdx + 1) % config.texts.length;
        }
        setTimeout(type, isDeleting ? 50 : 100);
    }
    type();

    // Custom Cursor
    const dot = document.getElementById("cursor-dot");
    const circle = document.getElementById("cursor-circle");
    document.addEventListener("mousemove", (e) => {
        dot.style.left = circle.style.left = e.clientX + "px";
        dot.style.top = circle.style.top = e.clientY + "px";
    });
});
