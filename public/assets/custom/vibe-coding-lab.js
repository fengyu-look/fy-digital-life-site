(() => {
  const experiments = {
    "vibe-coding": {
      index: "/ 001",
      title: "Vibe Coding",
      status: "COMING SOON",
      direction: "Personal creative coding sketches, interface prototypes, and build notes.",
      future: "Future entry: runnable sketches, source notes, and selected experiments once they are stable enough to open.",
    },
    "micro-tools": {
      index: "/ 002",
      title: "Micro Tools",
      status: "IN PROGRESS",
      direction: "Tiny utilities for writing, image thinking, prompt systems, and reusable AI production workflows.",
      future: "Future entry: browser tools, local helpers, and compact workflows that can be used directly from this lab.",
    },
    "motion-tests": {
      index: "/ 003",
      title: "Motion Tests",
      status: "PROTOTYPE",
      direction: "Type rhythm, video-led interface states, transition timing, and motion language tests.",
      future: "Future entry: motion clips, interactive states, and animation patterns that can feed the new site.",
    },
  };

  const text = (selector, value, root = document) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };

  function modal() {
    return document.querySelector(".lab-modal");
  }

  function openExperiment(id) {
    const data = experiments[id];
    const node = modal();
    if (!data || !node) return;

    text(".lab-modal__title", data.title, node);
    text(".lab-modal__index", data.index, node);
    text(".lab-modal__status", data.status, node);
    text(
      ".lab-modal__copy",
      `Direction: ${data.direction} Current state: this experiment is being made and is intentionally reserved.`,
      node,
    );
    text(".lab-modal__future", data.future, node);

    node.hidden = false;
    window.requestAnimationFrame(() => {
      node.classList.add("is-open");
      document.body.classList.add("lab-modal-open");
      node.querySelector(".lab-modal__close")?.focus();
    });
  }

  function closeModal() {
    const node = modal();
    if (!node) return;
    node.classList.remove("is-open");
    document.body.classList.remove("lab-modal-open");
    window.setTimeout(() => {
      if (!node.classList.contains("is-open")) node.hidden = true;
    }, 160);
  }

  function bindSlots() {
    document.querySelectorAll("[data-lab-slot]").forEach((slot) => {
      slot.addEventListener("click", () => openExperiment(slot.dataset.labSlot));
    });
  }

  function bindModal() {
    const node = modal();
    if (!node) return;

    node.addEventListener("click", (event) => {
      if (event.target === node || event.target.closest(".lab-modal__close")) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && node.classList.contains("is-open")) closeModal();
    });
  }

  function updateClock() {
    const now = new Date();
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Shanghai",
    }).format(now);
    const date = new Intl.DateTimeFormat("en-CA", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "Asia/Shanghai",
      year: "numeric",
    }).format(now);

    text("[data-lab-time]", time);
    text("[data-lab-date]", date);
  }

  function setPageChrome() {
    const title = "Vibe Coding Lab / Vibe Coding 实验场";
    const description = "Vibe Coding Lab is a reserved creative lab for prototypes, micro tools, and motion experiments.";

    document.title = title;
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
      meta.setAttribute("content", title);
    });
    document
      .querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((meta) => {
        meta.setAttribute("content", description);
      });
  }

  function boot() {
    document.documentElement.dataset.vibeLab = "ready";
    setPageChrome();
    bindSlots();
    bindModal();
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
