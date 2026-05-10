/*!
 * Start Bootstrap - Resume v7.0.4 (https://startbootstrap.com/theme/resume)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
 *
 * Extended 2026-05-10:
 *   - Dark mode toggle (data-bs-theme + localStorage + prefers-color-scheme)
 */

window.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------------
    // Bootstrap ScrollSpy on the side nav
    // -----------------------------------------------------------------------
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    }

    // -----------------------------------------------------------------------
    // Collapse the responsive navbar after a link is clicked on mobile
    // -----------------------------------------------------------------------
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    document.querySelectorAll('#navbarResponsive .nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // -----------------------------------------------------------------------
    // Dark mode toggle
    //   - Initial theme is set by an inline <head> script before paint to
    //     avoid FOUC. This block only handles user-driven changes thereafter.
    //   - Persists choice in localStorage; falls back to system preference.
    // -----------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const setTheme = (theme) => {
            document.documentElement.setAttribute('data-bs-theme', theme);
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            try {
                localStorage.setItem('theme', theme);
            } catch (e) { /* private mode */ }
        };

        // Initialise aria-pressed from whatever the inline script applied
        const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
        themeToggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');

        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });

        // Reflect system theme changes only when the user hasn't set a manual preference
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        mql.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
});
