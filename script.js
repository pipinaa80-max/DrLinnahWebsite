/* ================= PRELOADER ================= */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  setTimeout(() => {
    preloader.style.opacity = "0";

    setTimeout(() => {
      preloader.style.display = "none";
    }, 800);
  }, 1000);
});

/* ================= MOBILE NAV ================= */
const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  document.querySelectorAll("#nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

/* ================= COUNTER ================= */
const counter = document.querySelector("[data-count]");
let counted = false;

if (counter) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;

      if (entry && entry.isIntersecting && !counted) {
        counted = true;

        const target = Number(counter.dataset.count || 0);
        let current = 0;

        const interval = setInterval(() => {
          current += 1;
          counter.textContent = String(current);

          if (current >= target) {
            clearInterval(interval);
          }
        }, 250);
      }
    },
    { threshold: 0.4 }
  );

  counterObserver.observe(counter);
}

/* ================= MUSIC ================= */
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");
const vinyl = document.querySelector(".vinyl");
const youtubeMusic = document.getElementById("youtubeMusic");

let playing = false;
let audioContext = null;

function ensureAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playCelebrationMelody() {
  const context = ensureAudioContext();
  if (!context) {
    if (musicStatus) {
      musicStatus.textContent = "Audio is unavailable in this browser.";
    }
    return;
  }

  const notes = [392, 523.25, 659.25, 523.25, 587.33, 659.25, 783.99, 659.25];
  const now = context.currentTime;

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.0001, now + index * 0.22);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + index * 0.22 + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.22 + 0.28);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now + index * 0.22);
    oscillator.stop(now + index * 0.22 + 0.28);
  });
}

function setMusicPlayingState(isPlaying) {
  playing = isPlaying;

  if (musicButton) {
    musicButton.textContent = isPlaying ? "Ⅱ" : "▶";
  }

  if (musicStatus) {
    musicStatus.textContent = isPlaying ? "Now playing 🎵" : "Music paused.";
  }

  if (vinyl) {
    vinyl.classList.toggle("playing", isPlaying);
  }
}

async function startMusic() {
  if (playing) return;

  try {
    if (music && music.src) {
      await music.play();
    } else {
      playCelebrationMelody();
    }

    setMusicPlayingState(true);
  } catch (error) {
    if (musicStatus) {
      musicStatus.textContent = "Tap, click, or press a key to start the soundtrack.";
    }
  }
}

if (musicButton) {
  musicButton.addEventListener("click", async () => {
    if (!playing) {
      await startMusic();
    } else {
      if (music) {
        music.pause();
      }

      setMusicPlayingState(false);
    }
  });
}

window.addEventListener("load", () => {
  const selectedSource = music && music.querySelector("source")
    ? music.querySelector("source").getAttribute("src")
    : "";

  if (music && selectedSource) {
    music.src = selectedSource;
    music.load();
  }

  if (musicButton) {
    startMusic();
  }
});

document.addEventListener("pointerdown", startMusic, { once: true });
document.addEventListener("keydown", startMusic, { once: true });

/* ================= PHOTO UPLOAD ================= */
const photoUpload = document.getElementById("photoUpload");
const gallery = document.getElementById("galleryContainer");

if (photoUpload && gallery) {
  photoUpload.addEventListener("change", function () {
    [...this.files].forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const card = document.createElement("div");
        card.className = "gallery-card";

        const image = document.createElement("img");
        image.src = event.target.result;
        image.alt = "Graduation memory";

        card.appendChild(image);
        gallery.appendChild(card);
        activateLightbox(card);
      };

      reader.readAsDataURL(file);
    });
  });
}

/* ================= LIGHTBOX ================= */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

function activateLightbox(card) {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    if (!image || !lightbox || !lightboxImage) return;

    lightboxImage.src = image.src;
    lightbox.classList.add("active");
  });
}

document.querySelectorAll(".gallery-card").forEach(activateLightbox);

if (closeLightbox) {
  closeLightbox.addEventListener("click", () => {
    if (lightbox) {
      lightbox.classList.remove("active");
    }
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox) {
    lightbox.classList.remove("active");
  }
});

/* ================= SCROLL REVEAL ================= */
const revealElements = document.querySelectorAll(".year, .stat, .gallery-card, .message-card");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
}
