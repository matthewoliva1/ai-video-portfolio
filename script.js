(function () {
  const projects = window.portfolioProjects || [];
  const featuredIds = window.featuredProjectIds || [];
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const featuredProjects = featuredIds.map((id) => projectById.get(id)).filter(Boolean);
  const featuredGrid = document.getElementById("featured-grid");
  const workGrid = document.getElementById("work-grid");
  const filters = document.getElementById("filters");
  const videoModal = document.getElementById("video-modal");
  const aboutModal = document.getElementById("about-modal");
  const contactModal = document.getElementById("contact-modal");
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");

  function projectCard(project, featured) {
    if (featured) {
      return `<article class="project-card" tabindex="0" role="button" data-project-id="${project.id}" aria-label="Play ${project.title}">
        <div class="project-card-media"><img src="${project.thumbnail}" alt="${project.alt}" loading="lazy"></div>
        <span class="play-button" aria-hidden="true">▶</span>
        <div class="project-card-content">
          <div class="project-card-meta"><span>${project.category}</span> / ${project.subcategory}</div>
          <h3>${project.title}</h3><p>${project.description}</p>
        </div>
      </article>`;
    }
    return `<button class="work-card" type="button" data-project-id="${project.id}" aria-label="Play ${project.title}">
      <div class="work-card-media"><img src="${project.thumbnail}" alt="${project.alt}" loading="lazy"></div>
      <div class="work-card-copy"><p>${project.category}</p><h3>${project.title}</h3></div>
    </button>`;
  }

  function renderFeatured() {
    featuredGrid.innerHTML = featuredProjects.map((project) => projectCard(project, true)).join("");
  }

  function renderWork(category) {
    const visible = category === "All" ? projects : projects.filter((project) => project.category === category);
    workGrid.innerHTML = visible.map((project) => projectCard(project, false)).join("");
  }

  function renderFilters() {
    const categories = ["All", ...new Set(projects.map((project) => project.category))];
    filters.innerHTML = categories.map((category, index) => `<button class="filter-button${index === 0 ? " active" : ""}" type="button" data-filter="${category}" aria-pressed="${index === 0}">${category}</button>`).join("");
  }

  function openVideo(projectId) {
    const project = projectById.get(projectId);
    if (!project) return;
    document.getElementById("video-frame").innerHTML = `<iframe src="https://drive.google.com/file/d/${project.fileId}/preview" title="${project.title}" allow="autoplay; fullscreen" allowfullscreen loading="eager"></iframe>`;
    document.getElementById("video-category").textContent = `${project.category} / ${project.subcategory}`;
    document.getElementById("video-title").textContent = project.title;
    document.getElementById("video-description").textContent = project.description;
    document.getElementById("video-source").href = `https://drive.google.com/file/d/${project.fileId}/view`;
    videoModal.showModal();
    document.body.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal || !modal.open) return;
    modal.close();
    if (modal === videoModal) document.getElementById("video-frame").innerHTML = "";
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
  }

  renderFeatured();
  renderFilters();
  renderWork("All");

  document.addEventListener("click", (event) => {
    const projectElement = event.target.closest("[data-project-id]");
    if (projectElement) openVideo(projectElement.dataset.projectId);
    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      document.querySelectorAll("[data-filter]").forEach((button) => {
        const active = button === filterButton;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      renderWork(filterButton.dataset.filter);
    }
    if (event.target.closest("[data-open-about]")) {
      aboutModal.showModal();
      document.body.classList.add("modal-open");
    }
    if (event.target.closest("[data-open-contact]")) {
      contactModal.showModal();
      document.body.classList.add("modal-open");
    }
    if (event.target.closest("[data-close-modal]")) closeModal(event.target.closest("dialog"));
    if (event.target.closest("#site-nav a")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    const card = event.target.closest(".project-card");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openVideo(card.dataset.projectId);
    }
  });

  document.querySelectorAll("dialog").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
    modal.addEventListener("close", () => {
      if (modal === videoModal) document.getElementById("video-frame").innerHTML = "";
      if (!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
    });
  });

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.getElementById("form-next").value = new URL("thank-you.html", window.location.href).href;
  document.getElementById("year").textContent = new Date().getFullYear();
})();
