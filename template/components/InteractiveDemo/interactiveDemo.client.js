(function () {
  const initializedRoots = new WeakSet();

  function isMode(v) {
    return v === "light" || v === "dark";
  }

  function initRoot(root) {
    if (!(root instanceof HTMLElement)) return;
    if (initializedRoots.has(root)) return;
    initializedRoots.add(root);

    const optionButtons = Array.from(
      root.querySelectorAll("[data-image-toggle-button]")
    ).filter((n) => n instanceof HTMLElement);

    const modeButtons = Array.from(
      root.querySelectorAll("[data-image-toggle-to]")
    ).filter((n) => n instanceof HTMLElement);

    const cards = Array.from(root.querySelectorAll("[data-image-card]")).filter(
      (n) => n instanceof HTMLElement
    );

    optionButtons.forEach((btn) => {
      if (!btn.hasAttribute("data-default-variant")) {
        btn.setAttribute("data-default-variant", btn.getAttribute("data-variant") || "filled");
      }
    });

    const getMode = () => root.getAttribute("data-mode") === "dark" ? "dark" : "light";
    const setMode = (mode) => root.setAttribute("data-mode", mode);

    const getActiveId = () =>
      root.getAttribute("data-active-id") ||
      optionButtons[0]?.getAttribute("data-image-id") ||
      "";

    const setActiveId = (id) => root.setAttribute("data-active-id", id);

    const updateModeButtons = () => {
      const mode = getMode();

      modeButtons.forEach((btn) => {
        const to = btn.getAttribute("data-image-toggle-to");
        const show =
          (mode === "light" && to === "dark") ||
          (mode === "dark" && to === "light");

        btn.style.display = show ? "" : "none";
        btn.setAttribute("aria-hidden", show ? "false" : "true");

        try {
          btn.tabIndex = show ? 0 : -1;
        } catch (e) {}
      });
    };

    const update = () => {
      const mode = getMode();
      const activeId = getActiveId();

      optionButtons.forEach((btn) => {
        const id = btn.getAttribute("data-image-id");
        const isActive = id === activeId;

        if (isActive) {
          btn.setAttribute("data-active", "true");
          btn.setAttribute("aria-pressed", "true");
          const defaultVariant = btn.getAttribute("data-default-variant") || "filled";
          btn.setAttribute("data-variant", defaultVariant);
        } else {
          btn.removeAttribute("data-active");
          btn.setAttribute("aria-pressed", "false");
          btn.setAttribute("data-variant", "ghost");
        }
      });

      cards.forEach((card) => {
        const id = card.getAttribute("data-image-id");
        const cardMode = card.getAttribute("data-image-mode");
        const isActive = id === activeId && cardMode === mode;

        if (isActive) {
          card.setAttribute("data-active", "true");
          card.setAttribute("aria-hidden", "false");
        } else {
          card.removeAttribute("data-active");
          card.setAttribute("aria-hidden", "true");
        }
      });

      updateModeButtons();
    };

    optionButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = btn.getAttribute("data-image-id");
        if (id) {
          setActiveId(id);
          update();
        }
      });
    });

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const to = btn.getAttribute("data-image-toggle-to");
        if (isMode(to)) {
          setMode(to);
          update();
        }
      });
    });

    update();
  }

  function scan() {
    const roots = document.querySelectorAll("[data-image-toggle-root]");
    roots.forEach(initRoot);
  }

  function setupObserver() {
    if (!document.body) return;
    const obs = new MutationObserver(() => scan());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        scan();
        setupObserver();
      },
      { once: true }
    );
  } else {
    scan();
    setupObserver();
  }

  document.addEventListener("astro:page-load", scan);
  document.addEventListener("astro:after-swap", scan);
})();