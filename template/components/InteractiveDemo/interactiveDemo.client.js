(function () {
  const initializedRoots = new WeakSet();

  const initRoot = (root) => {
    if (initializedRoots.has(root)) return;
    initializedRoots.add(root);

    const buttons = root.querySelectorAll('[data-image-toggle-button]');
    const img = root.querySelector('[data-image-toggle-target]');
    const toggleLight = root.querySelector('[data-image-toggle-light]');
    const toggleDark = root.querySelector('[data-image-toggle-dark]');

    let cardEl = root.querySelector('[data-image-card]');
    if (!cardEl) cardEl = root; // fallback to root if card not found

    const getLocalMode = () => {
      const attr = cardEl.getAttribute('data-local-mode');
      if (attr === 'dark' || attr === 'light') return attr;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    };

    const setLocalMode = (mode) => {
      cardEl.setAttribute('data-local-mode', mode);
    };

    const updateToggleVisibility = () => {
      const mode = getLocalMode();
      const isLight = mode === 'light';
      if (toggleLight) toggleLight.style.display = isLight ? '' : 'none';
      if (toggleDark) toggleDark.style.display = isLight ? 'none' : '';
    };

    const applyModeToImage = () => {
      if (!img) return;
      const mode = getLocalMode();
      const s = img.getAttribute('src') || '';
      const next = s.replace(
        /--(Light|Dark)mode--/,
        mode === 'dark' ? '--Darkmode--' : '--Lightmode--',
      );
      if (next !== s) img.setAttribute('src', next);
      updateToggleVisibility();
    };

    const setActiveButton = (activeId) => {
      buttons.forEach((btn) => {
        if (btn.getAttribute('data-image-id') === activeId) {
          btn.setAttribute('data-active', '');
        } else {
          btn.removeAttribute('data-active');
        }
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const srcTemplate = button.getAttribute('data-image-src');
        const alt = button.getAttribute('data-image-alt') ?? '';
        if (img && srcTemplate) {
          const mode = getLocalMode();
          const next = srcTemplate.replace(
            /--(Light|Dark)mode--/,
            mode === 'dark' ? '--Darkmode--' : '--Lightmode--',
          );
          img.setAttribute('src', next);
          img.setAttribute('alt', alt);
          updateToggleVisibility();
          try {
            img.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (e) {}
          const id = button.getAttribute('data-image-id');
          if (id) setActiveButton(id);
        }
      });
    });

    toggleLight &&
      toggleLight.addEventListener('click', () => {
        if (!img) return;
        setLocalMode('dark');
        applyModeToImage();
        try {
          img.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
      });

    toggleDark &&
      toggleDark.addEventListener('click', () => {
        if (!img) return;
        setLocalMode('light');
        applyModeToImage();
        updateToggleVisibility();
      });

    applyModeToImage();

    const currentSrc = img?.getAttribute('src') || '';
    const preMarked = Array.from(buttons).find((b) => b.hasAttribute('data-active'));
    if (!preMarked && currentSrc) {
      const match = Array.from(buttons).find((b) => {
        const tpl = b.getAttribute('data-image-src') || '';
        const normalizedTpl = tpl.replace(
          /--(Light|Dark)mode--/,
          currentSrc.includes('--Darkmode--') ? '--Darkmode--' : '--Lightmode--',
        );
        return normalizedTpl === currentSrc;
      });
      const id = match?.getAttribute('data-image-id');
      if (id) setActiveButton(id);
    }
  };

  const scanRoots = () => {
    const roots = document.querySelectorAll('[data-image-toggle-root]');
    roots.forEach((root) => initRoot(root));
  };

  const setup = () => {
    scanRoots();
    const observer = new MutationObserver(() => {
      scanRoots();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  let setupTimer;
  const scheduleSetup = () => {
    if (setupTimer) window.clearTimeout(setupTimer);
    setupTimer = window.setTimeout(() => {
      requestAnimationFrame(() => setup());
    }, 0);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }

  document.addEventListener('astro:page-load', scheduleSetup);
  document.addEventListener('astro:after-swap', scheduleSetup);
})();
