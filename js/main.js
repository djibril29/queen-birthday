(function () {
  const config = BIRTHDAY_CONFIG;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const landing = document.getElementById("landing");
  const reveal = document.getElementById("reveal");
  const btnOpen = document.getElementById("btn-open");
  const landingTitle = document.getElementById("landing-title");
  const introLine = document.getElementById("intro-line");
  const nameText = document.getElementById("name-text");
  const nameCursor = document.getElementById("name-cursor");
  const photoWrap = document.getElementById("photo-wrap");
  const photo = document.getElementById("photo");
  const messageWrap = document.getElementById("message-wrap");
  const memoriesWrap = document.getElementById("memories-wrap");
  const tabTimeline = document.getElementById("tab-timeline");
  const tabBloopers = document.getElementById("tab-bloopers");
  const panelTimeline = document.getElementById("panel-timeline");
  const panelBloopers = document.getElementById("panel-bloopers");
  const timelineEl = document.getElementById("timeline");
  const bloopersEl = document.getElementById("bloopers");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const music = document.getElementById("music");
  const btnMute = document.getElementById("btn-mute");
  const muteIcon = document.getElementById("mute-icon");

  let confettiInterval = null;
  let musicAvailable = false;
  let scrollObserver = null;

  function init() {
    landingTitle.textContent = config.landingTitle;
    btnOpen.textContent = config.buttonLabel;
    introLine.textContent = config.introLine;
    photo.src = config.photo;
    photo.alt = `Photo de ${config.name}`;
    music.src = config.music;

    if (config.tabs?.timeline) tabTimeline.textContent = config.tabs.timeline;
    if (config.tabs?.bloopers) tabBloopers.textContent = config.tabs.bloopers;

    music.addEventListener("canplaythrough", () => {
      musicAvailable = true;
    });
    music.addEventListener("error", () => {
      musicAvailable = false;
    });

    btnOpen.addEventListener("click", handleOpenSurprise);
    btnMute.addEventListener("click", toggleMute);
    tabTimeline.addEventListener("click", () => switchTab("timeline"));
    tabBloopers.addEventListener("click", () => switchTab("bloopers"));
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", handleKeydown);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function typeWriter(element, text, speed) {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = "";
      nameCursor.classList.remove("hidden");

      function tick() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(tick, speed);
        } else {
          nameCursor.classList.add("hidden");
          resolve();
        }
      }

      if (prefersReducedMotion) {
        element.textContent = text;
        nameCursor.classList.add("hidden");
        resolve();
        return;
      }

      tick();
    });
  }

  function launchConfetti() {
    if (prefersReducedMotion || typeof confetti !== "function") return;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#d4a853", "#f0d78c", "#ff6b9d", "#c084fc", "#ffffff"]
    });

    confettiInterval = setInterval(() => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#d4a853", "#f0d78c", "#ff6b9d"]
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#d4a853", "#c084fc", "#ffffff"]
      });
    }, 400);
  }

  function burstConfetti() {
    if (prefersReducedMotion || typeof confetti !== "function") return;

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#d4a853", "#f0d78c", "#ff6b9d", "#c084fc"]
    });
  }

  async function startMusic() {
    if (!config.music) return;

    try {
      music.volume = 0.4;
      await music.play();
      musicAvailable = true;
      btnMute.classList.remove("hidden");
    } catch {
      musicAvailable = false;
    }
  }

  function toggleMute() {
    if (!musicAvailable) return;
    music.muted = !music.muted;
    muteIcon.textContent = music.muted ? "🔇" : "🔊";
    btnMute.setAttribute("aria-label", music.muted ? "Activer le son" : "Couper le son");
  }

  function showElement(el, className) {
    el.classList.remove("hidden");
    if (className) el.classList.add(className);
  }

  function buildMessage() {
    messageWrap.replaceChildren();
    const paragraphs = Array.isArray(config.message) ? config.message : [config.message];
    paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      messageWrap.appendChild(p);
    });
  }

  function buildTimeline() {
    const items = Array.isArray(config.timeline) ? config.timeline : [];
    timelineEl.replaceChildren();

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "timeline__item";

      const marker = document.createElement("div");
      marker.className = "timeline__marker";

      const dot = document.createElement("span");
      dot.className = "timeline__dot";
      dot.setAttribute("aria-hidden", "true");

      const date = document.createElement("time");
      date.className = "timeline__date";
      date.textContent = item.date || "";

      marker.append(dot, date);

      const photoSide = document.createElement("div");
      photoSide.className = "timeline__side timeline__side--photo";

      const figure = document.createElement("figure");
      figure.className = "timeline__photo";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.date || `Souvenir ${index + 1}`;
      img.loading = "lazy";
      img.addEventListener("click", () => openLightbox(item));

      const textSide = document.createElement("div");
      textSide.className = "timeline__side timeline__side--text";

      const p = document.createElement("p");
      p.textContent = item.text || "";

      figure.appendChild(img);
      photoSide.appendChild(figure);
      textSide.appendChild(p);
      li.append(marker, photoSide, textSide);
      timelineEl.appendChild(li);
    });
  }

  function buildBloopers() {
    const items = Array.isArray(config.bloopers) ? config.bloopers : [];
    bloopersEl.replaceChildren();

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "bloopers__empty";
      empty.textContent = "Les vidéos du bêtisier arrivent bientôt… 😄";
      bloopersEl.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "blooper__item";

      const video = document.createElement("video");
      video.className = "blooper__video";
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");
      video.src = item.src;
      if (item.poster) video.poster = item.poster;

      const title = document.createElement("h4");
      title.className = "blooper__title";
      title.textContent = item.title || "Bêtise";

      article.append(video, title);

      if (item.text) {
        const p = document.createElement("p");
        p.className = "blooper__text";
        p.textContent = item.text;
        article.appendChild(p);
      }

      bloopersEl.appendChild(article);
    });
  }

  function setupScrollReveal() {
    if (scrollObserver) scrollObserver.disconnect();

    if (prefersReducedMotion) {
      document.querySelectorAll(".timeline__item, .blooper__item").forEach((el) => {
        el.classList.add("visible");
      });
      return;
    }

    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { root: reveal, threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".timeline__item, .blooper__item").forEach((el) => {
      scrollObserver.observe(el);
    });
  }

  function switchTab(tab) {
    const isTimeline = tab === "timeline";

    tabTimeline.classList.toggle("memories__tab--active", isTimeline);
    tabTimeline.setAttribute("aria-selected", String(isTimeline));
    tabBloopers.classList.toggle("memories__tab--active", !isTimeline);
    tabBloopers.setAttribute("aria-selected", String(!isTimeline));

    panelTimeline.classList.toggle("memories__panel--active", isTimeline);
    panelTimeline.classList.toggle("hidden", !isTimeline);
    panelTimeline.hidden = !isTimeline;

    panelBloopers.classList.toggle("memories__panel--active", !isTimeline);
    panelBloopers.classList.toggle("hidden", isTimeline);
    panelBloopers.hidden = isTimeline;

    if (!isTimeline) {
      document.querySelectorAll(".blooper__item").forEach((el) => {
        if (!el.classList.contains("visible")) {
          scrollObserver?.observe(el);
        }
      });
    } else {
      pauseBloopers();
    }
  }

  function openLightbox(item) {
    lightboxImg.src = item.src;
    lightboxImg.alt = item.date || "Souvenir";
    lightboxCaption.textContent = item.text || item.date || "";
    lightbox.classList.remove("hidden");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.classList.remove("lightbox-open");
  }

  function handleKeydown(event) {
    if (lightbox.classList.contains("hidden")) return;
    if (event.key === "Escape") closeLightbox();
  }

  function pauseBloopers() {
    document.querySelectorAll(".blooper__video").forEach((video) => video.pause());
  }

  async function handleOpenSurprise() {
    btnOpen.disabled = true;

    landing.classList.remove("screen--active");
    landing.classList.add("screen--hidden");

    reveal.classList.remove("screen--hidden");
    reveal.classList.add("screen--revealed");
    reveal.setAttribute("aria-hidden", "false");

    startMusic();

    const displayName = config.nickname
      ? `${config.name} — ${config.nickname}`
      : config.name;

    const timings = prefersReducedMotion
      ? { confetti: 0, intro: 0, name: 100, photo: 200, message: 300, memories: 400, burst: 500 }
      : { confetti: 300, intro: 500, name: 1500, photo: 3000, message: 4000, memories: 6500, burst: 7500 };

    await delay(timings.confetti);
    launchConfetti();

    await delay(timings.intro - timings.confetti);
    introLine.classList.add("visible");

    await delay(timings.name - timings.intro);
    await typeWriter(nameText, `${displayName}.`, 70);

    await delay(timings.photo - timings.name);
    showElement(photoWrap, "visible");

    await delay(timings.message - timings.photo);
    buildMessage();
    showElement(messageWrap);
    const paragraphs = messageWrap.querySelectorAll("p");
    for (let i = 0; i < paragraphs.length; i++) {
      if (prefersReducedMotion) {
        paragraphs[i].classList.add("visible");
      } else {
        await delay(600);
        paragraphs[i].classList.add("visible");
      }
    }

    await delay(timings.memories - timings.message);
    buildTimeline();
    buildBloopers();
    showElement(memoriesWrap, "visible");
    setupScrollReveal();

    await delay(timings.burst - timings.memories);
    burstConfetti();
  }

  init();
})();
