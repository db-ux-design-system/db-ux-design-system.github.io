(function () {
	const root = document.querySelector('[data-demo-root]');
	if (!root) return;

	const state = root.querySelector('[data-demo-state]');
	const content = root.querySelector('[data-demo-content]');
	const buttons = root.querySelectorAll('[data-demo-button]');
	const toggleDark = root.querySelector('[data-demo-toggle-to="dark"]');
	const toggleLight = root.querySelector('[data-demo-toggle-to="light"]');
	const fullscreenBtn = root.querySelector('[data-demo-fullscreen]');

	if (!state || !content) return;

	let currentMode = state.getAttribute('data-mode') || 'light';
	let currentTheme = root.getAttribute('data-active-id') || 'db';
	let isFullscreen = false;

	const fullscreenBtn = root.querySelector('[data-demo-fullscreen]');
	let isFullscreen = false;

	function updateMode(mode) {
		currentMode = mode;
		state.setAttribute('data-mode', mode);
		content.setAttribute('data-mode', mode);

		if (mode === 'dark') {
			toggleDark.style.display = 'none';
			toggleLight.style.display = 'inline-flex';
		} else {
			toggleDark.style.display = 'inline-flex';
			toggleLight.style.display = 'none';
		}
	}

	function updateTheme(themeId, theme) {
		currentTheme = themeId;
		root.setAttribute('data-active-id', themeId);
		content.setAttribute('data-theme', theme);

		buttons.forEach((btn) => {
			if (btn.getAttribute('data-demo-id') === themeId) {
				btn.setAttribute('data-active', 'true');
			} else {
				btn.removeAttribute('data-active');
			}
		});
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
		if (isFullscreen) {
			root.setAttribute('data-fullscreen', 'true');
			document.body.style.overflow = 'hidden';
		} else {
			root.removeAttribute('data-fullscreen');
			document.body.style.overflow = '';
		}
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
		if (isFullscreen) {
			root.setAttribute('data-fullscreen', 'true');
			document.body.style.overflow = 'hidden';
		} else {
			root.removeAttribute('data-fullscreen');
			document.body.style.overflow = '';
		}
	}

	buttons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const themeId = btn.getAttribute('data-demo-id');
			const theme = btn.getAttribute('data-demo-theme');
			if (themeId && theme) {
				updateTheme(themeId, theme);
			}
		});
	});

	if (toggleDark) {
		toggleDark.addEventListener('click', () => updateMode('dark'));
	}

	if (toggleLight) {
		toggleLight.addEventListener('click', () => updateMode('light'));
	}

	if (fullscreenBtn) {
		fullscreenBtn.addEventListener('click', toggleFullscreen);
	}

	// ESC key to exit fullscreen
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isFullscreen) {
			toggleFullscreen();
		}
	});

	if (fullscreenBtn) {
		fullscreenBtn.addEventListener('click', toggleFullscreen);
	}

	// ESC key to exit fullscreen
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isFullscreen) {
			toggleFullscreen();
		}
	});
})();
