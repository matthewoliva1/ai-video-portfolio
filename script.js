(function () {
  const projects = window.portfolioProjects || [];
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const workGrid = document.getElementById("work-grid");
  const filters = document.getElementById("filters");
  const projectCount = document.getElementById("project-count");
  const videoModal = document.getElementById("video-modal");
  const contactModal = document.getElementById("contact-modal");
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  let pointerFrame = 0;
  document.addEventListener("pointermove", (event) => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      document.body.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.body.style.setProperty("--pointer-y", `${event.clientY}px`);
      pointerFrame = 0;
    });
  }, { passive: true });

  function workCard(project) {
    return `<button class="work-card" type="button" data-project-id="${project.id}" aria-label="Play ${project.title}">
      <div class="work-card-media"><img src="${project.thumbnail}" alt="${project.alt}" loading="lazy"></div>
      <div class="work-card-copy"><p>${project.category} / ${project.subcategory}</p><h3>${project.title}</h3></div>
    </button>`;
  }

  function renderWork(category) {
    const visible = category === "All" ? projects : projects.filter((project) => project.category === category);
    workGrid.innerHTML = visible.map(workCard).join("");
    projectCount.textContent = `${String(visible.length).padStart(2, "0")} project${visible.length === 1 ? "" : "s"}`;
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

  renderFilters();
  renderWork("All");
  document.getElementById("hero-project-count").textContent = String(projects.length).padStart(2, "0");

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

    if (event.target.closest("[data-open-contact]")) {
      contactModal.showModal();
      document.body.classList.add("modal-open");
    }
    if (event.target.closest("[data-close-modal]")) closeModal(event.target.closest("dialog"));
    if (event.target.closest("#site-nav a")) {
      const link = event.target.closest("#site-nav a");
      setActiveNav(link.getAttribute("href").slice(1));
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
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

  let navFrame = 0;
  function syncActiveNav() {
    const marker = window.scrollY + window.innerHeight * .34;
    let currentSection = "";
    navSections.forEach((section) => {
      if (section.offsetTop <= marker) currentSection = section.id;
    });
    setActiveNav(currentSection);
  }
  window.addEventListener("scroll", () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(() => {
      syncActiveNav();
      navFrame = 0;
    });
  }, { passive: true });
  window.addEventListener("resize", syncActiveNav);
  requestAnimationFrame(syncActiveNav);

  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;

  document.querySelectorAll(".reveal").forEach((element) => {
    if (observer) observer.observe(element);
    else element.classList.add("in-view");
  });

  document.getElementById("form-next").value = new URL("thank-you.html", window.location.href).href;
})();
