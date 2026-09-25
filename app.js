const lessons = [
  {
    id: "featured-1",
    module: "Módulo 1",
    moduleName: "Sertanejo",
    title: "Sertanejo do zero: corpo, ritmo e presença",
    instructor: "João Ribeiro",
    style: "Sertanejo",
    level: "Iniciante",
    duration: "28 min",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=85",
    description: "A base do sertanejo em uma aula leve: postura, balanço, boque e a vontade de levar o corpo para a música.",
    avatar: "JR",
    video: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
  },
  {
    id: "featured-2",
    module: "Módulo 2",
    moduleName: "Vanera Universitária",
    title: "Vanera universitária: postura e condução",
    instructor: "Camila Santos",
    style: "Vanera Universitária",
    level: "Iniciante",
    duration: "24 min",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=85",
    description: "Aprenda a conduzir a vanera universitária com mais leveza, firmeza e presença. Uma aula para sentir cada giro antes de hacerlo.",
    avatar: "CS",
    video: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
  },
  {
    id: "featured-3",
    module: "Módulo 1",
    moduleName: "Sertanejo",
    title: "Giro, boque e confiança",
    instructor: "João Ribeiro",
    style: "Sertanejo",
    level: "Intermediário",
    duration: "31 min",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1000&q=85",
    description: "Aperte seus movimentos com técnica e descubra a maneira natural do sertanejo: gestual, ritmo e presença.",
    avatar: "JR",
    video: "https://storage.googleapis.com/coverr-main/mp4/Blurry_Abstract_Video.mp4",
  },
  {
    id: "featured-4",
    module: "Módulo 2",
    moduleName: "Vanera Universitária",
    title: "Primeiros giros: leveza e controle",
    instructor: "Camila Santos",
    style: "Vanera Universitária",
    level: "Intermediário",
    duration: "27 min",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85",
    description: "Treine o eixo do corpo, a passé e o giro da vanera universitária sem perder a musicalidade nem a leveza.",
    avatar: "CS",
    video: "https://storage.googleapis.com/coverr-main/mp4/City_Bicycle.mp4",
  },
  {
    id: "continue-1",
    module: "Módulo 1",
    moduleName: "Sertanejo",
    title: "Aula 01 · Postura e condução",
    instructor: "João Ribeiro",
    style: "Sertanejo",
    level: "Iniciante",
    duration: "18 min",
    progress: 64,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85",
    description: "Continue o módulo de sertanejo com uma sequência de giro, boque e deslocamento.",
    avatar: "JR",
    video: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
  },
  {
    id: "continue-2",
    module: "Módulo 2",
    moduleName: "Vanera Universitária",
    title: "Aula 01 · Postura e condução",
    instructor: "Camila Santos",
    style: "Vanera Universitária",
    level: "Iniciante",
    duration: "16 min",
    progress: 18,
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=85",
    description: "Comece o módulo de vanera universitária entendendo postura, condução e o primeiro giro com segurança.",
    avatar: "CS",
    video: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
  },
];

const styles = [
  { name: "Sertanejo", count: "12 aulas", className: "style-card-coral", icon: "✦", module: "Módulo 1" },
  { name: "Vanera Universitária", count: "10 aulas", className: "style-card-lime", icon: "◌", module: "Módulo 2" },
];

const trails = [
  { number: "01", title: "Módulo 1 · Sertanejo", description: "12 aulas · base, boque, giro e repertório", progress: 64, className: "trail-coral" },
  { number: "02", title: "Módulo 2 · Vanera Universitária", description: "10 aulas · postura, condução, giro e musicalidade", progress: 18, className: "trail-lime" },
];

const continueGrid = document.querySelector("#continue-grid");
const styleRow = document.querySelector("#style-row");
const featuredGrid = document.querySelector("#featured-grid");
const trailList = document.querySelector("#trail-list");
const playerModal = document.querySelector("#player-modal");
const uploadModal = document.querySelector("#upload-modal");
const lessonVideo = document.querySelector("#lesson-video");
const searchInput = document.querySelector("#lesson-search");
const searchResults = document.querySelector("#search-results");
const toast = document.querySelector("#toast");

function playIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z"></path></svg>`;
}

function renderContinueCards() {
  continueGrid.innerHTML = lessons
    .filter((lesson) => lesson.id.startsWith("continue"))
    .map(
      (lesson) => `
        <article class="continue-card" data-lesson-id="${lesson.id}">
          <div class="card-visual">
            <img src="${lesson.image}" alt="${lesson.title}" loading="lazy" />
            <div class="card-topline"><span class="card-level">${lesson.module}</span><span class="card-duration">${lesson.duration}</span></div>
            <button class="card-hover-play" type="button" aria-label="Reproduzir ${lesson.title}">${playIcon()}</button>
            <div class="card-bottomline"><div><span class="card-play-title">${lesson.title}</span><span class="card-instructor">${lesson.instructor}</span></div><span class="card-style">${lesson.progress}%</span></div>
          </div>
          <div class="card-meta"><h3>${lesson.title}</h3><p>${lesson.style} · ${lesson.moduleName}</p><div class="progress-bar"><span style="width:${lesson.progress}%"></span></div></div>
        </article>`,
    )
    .join("");
}

function renderStyleCards(filter = "Todos") {
  const visibleStyles = filter === "Todos" ? styles : styles.filter((style) => style.name === filter);
  styleRow.innerHTML = visibleStyles
    .map(
      (style) => `
        <article class="style-card ${style.className}" data-style="${style.name}">
          <span class="style-card-label">${style.icon} ${style.module}</span>
          <h3>${style.name}</h3>
          <span class="style-card-count">${style.count}</span>
        </article>`,
    )
    .join("");
}

function renderFeaturedCards(filter = "Todos") {
  const featuredLessons = lessons.filter((lesson) => lesson.id.startsWith("featured"));
  const visibleLessons = filter === "Todos" ? featuredLessons : featuredLessons.filter((lesson) => lesson.style === filter);
  featuredGrid.innerHTML = visibleLessons
    .map(
      (lesson) => `
        <article class="feature-card" data-lesson-id="${lesson.id}">
          <div class="card-visual">
            <img src="${lesson.image}" alt="${lesson.title}" loading="lazy" />
            <div class="card-topline"><span class="card-level">${lesson.module}</span><span class="card-duration">${lesson.duration}</span></div>
            <button class="card-hover-play" type="button" aria-label="Reproduzir ${lesson.title}">${playIcon()}</button>
            <div class="card-bottomline"><div><span class="card-play-title">${lesson.title}</span><span class="card-instructor">${lesson.instructor}</span></div></div>
          </div>
          <div class="card-meta"><h3>${lesson.title}</h3><p>${lesson.style} · ${lesson.level}</p><div class="card-instructor-line">com ${lesson.instructor}</div></div>
        </article>`,
    )
    .join("");

  if (!visibleLessons.length) {
    featuredGrid.innerHTML = `<div class="empty-state">Ainda estamos preparando aulas neste módulo.</div>`;
  }
}

function renderTrails() {
  trailList.innerHTML = trails
    .map(
      (trail) => `
        <article class="trail-row ${trail.className}" tabindex="0">
          <span class="trail-number">${trail.number}</span>
          <div class="trail-info"><strong>${trail.title}</strong><small>${trail.description}</small></div>
          <span class="trail-description">Escolha um módulo e avance no seu ritmo. Na Ritmo K, cada passo conta.</span>
          <div class="trail-progress"><div class="trail-progress-bar"><span style="width:${trail.progress}%"></span></div><small>${trail.progress}%</small></div>
          <span class="trail-arrow">→</span>
        </article>`,
    )
    .join("");
}

renderContinueCards();
renderStyleCards();
renderFeaturedCards();
renderTrails();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function findLesson(id) {
  return lessons.find((lesson) => lesson.id === id) || lessons[0];
}

function openPlayer(id) {
  const lesson = findLesson(id);
  document.querySelector("#player-title").textContent = lesson.title;
  document.querySelector("#player-style").textContent = `${lesson.style.toUpperCase()} · ${lesson.level.toUpperCase()}`;
  document.querySelector("#player-description").textContent = lesson.description;
  document.querySelector("#player-instructor").textContent = lesson.instructor;
  document.querySelector("#player-avatar").textContent = lesson.avatar;
  lessonVideo.poster = lesson.image;
  lessonVideo.src = lesson.video;
  lessonVideo.load();
  playerModal.classList.add("open");
  playerModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => lessonVideo.play().catch(() => {}), 220);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (modal === playerModal) {
    lessonVideo.pause();
    lessonVideo.removeAttribute("src");
    lessonVideo.load();
  }
  document.body.classList.remove("modal-open");
}

document.addEventListener("click", (event) => {
  const lessonTarget = event.target.closest("[data-lesson-id]");
  const playTarget = event.target.closest("[data-play]");
  if (playTarget) {
    openPlayer(playTarget.dataset.play);
    return;
  }
  if (lessonTarget && !event.target.closest("button")) {
    openPlayer(lessonTarget.dataset.lessonId);
  }

  const styleTarget = event.target.closest("[data-style]");
  if (styleTarget) {
    const styleName = styleTarget.dataset.style;
    const filterButton = document.querySelector(`[data-filter="${styleName}"]`);
    if (filterButton) filterButton.click();
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    document.querySelectorAll("[data-filter]").forEach((tab) => {
      const selected = tab === filter;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    renderStyleCards(filter.dataset.filter);
    renderFeaturedCards(filter.dataset.filter);
  }

  const filterFocus = event.target.closest("[data-filter-focus]");
  if (filterFocus) {
    document.querySelector("#aulas").scrollIntoView({ behavior: "smooth" });
  }

  const scrollTarget = event.target.closest("[data-scroll]");
  if (scrollTarget) {
    document.querySelector(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  }

  const rowControl = event.target.closest("[data-scroll-row]");
  if (rowControl) {
    const row = document.querySelector(rowControl.dataset.scrollRow);
    const distance = row.clientWidth * 0.72;
    row.scrollBy({ left: distance * Number(rowControl.dataset.direction), behavior: "smooth" });
  }
});

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop")));
});

[playerModal, uploadModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(playerModal);
    closeModal(uploadModal);
    searchResults.classList.remove("open");
  }
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    searchResults.classList.remove("open");
    return;
  }
  const matches = lessons.filter((lesson) => `${lesson.title} ${lesson.instructor} ${lesson.style} ${lesson.moduleName}`.toLowerCase().includes(normalized));
  searchResults.innerHTML = matches.length
    ? matches.slice(0, 5).map((lesson) => `<button class="search-result-item" type="button" data-lesson-id="${lesson.id}"><img src="${lesson.image}" alt="" /><span><strong>${lesson.title}</strong><small>${lesson.style} · ${lesson.duration}</small></span></button>`).join("")
    : `<div class="search-empty">Nenhuma aula encontrada. Tente “sertanejo” ou “vanera universitária”.</div>`;
  searchResults.classList.add("open");
}

searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
searchInput.addEventListener("focus", (event) => {
  if (event.target.value.trim()) renderSearchResults(event.target.value);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-box") && !event.target.closest(".search-results")) {
    searchResults.classList.remove("open");
  }
});

document.querySelector("#subscribe-plan")?.addEventListener("click", () => {
  showToast("Plano anual selecionado: R$ 129,99 por ano.");
});

document.querySelector("#open-upload").addEventListener("click", () => {
  uploadModal.classList.add("open");
  uploadModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
});

document.addEventListener("ritmo-toast", (event) => showToast(event.detail));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".continue-card, .feature-card, .style-card").forEach((element, index) => {
      element.style.animation = `card-in 500ms ${index * 45}ms both`;
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

[continueGrid, styleRow, featuredGrid, trailList].forEach((section) => observer.observe(section));

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
