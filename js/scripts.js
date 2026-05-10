/*!
 * Start Bootstrap - Resume v7.0.4 (https://startbootstrap.com/theme/resume)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
 *
 * Extended 2026-05-10:
 *   - Dark mode toggle (data-bs-theme + localStorage + prefers-color-scheme)
 *   - IntersectionObserver-driven section reveals (respects prefers-reduced-motion)
 */

window.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------------
    // Bootstrap ScrollSpy on the top nav
    // -----------------------------------------------------------------------
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 80,
        });
    }

    // -----------------------------------------------------------------------
    // Navbar shrink-on-scroll — adds .is-scrolled class for tighter padding
    // and a soft shadow once the user scrolls past the hero fold.
    // -----------------------------------------------------------------------
    if (sideNav) {
        const updateScrolled = () => {
            sideNav.classList.toggle('is-scrolled', window.scrollY > 24);
        };
        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });
    }

    // -----------------------------------------------------------------------
    // Close the offcanvas mobile nav after a link is tapped
    //   - Bootstrap 5.3 responsive offcanvas (offcanvas-lg) only renders the
    //     drawer below the lg breakpoint; above it the same element stays as
    //     a normal sidebar, so hide() is a no-op on desktop.
    // -----------------------------------------------------------------------
    const offcanvasEl = document.getElementById('navbarResponsive');
    if (offcanvasEl) {
        document.querySelectorAll('#navbarResponsive .nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (instance) instance.hide();
            });
        });
    }

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

    // -----------------------------------------------------------------------
    // Horizontal-scroll card carousels (Certifications, Awards, ...)
    //   - Prev/Next buttons advance by track scroll-width / N visible cards
    //   - Auto-advance every data-autoplay ms (default 5000); pause on hover,
    //     focus-within, or when the user is interacting with the track
    //   - Disables prev/next buttons at scroll extremes
    // -----------------------------------------------------------------------
    document.querySelectorAll('[data-carousel]').forEach((root) => {
        const track = root.querySelector('.card-carousel-track');
        const prev = root.querySelector('[data-carousel-prev]');
        const next = root.querySelector('[data-carousel-next]');
        if (!track) return;

        const cardWidth = () => {
            const first = track.firstElementChild;
            if (!first) return 320;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap || style.gap || '0');
            return first.getBoundingClientRect().width + gap;
        };

        const updateButtons = () => {
            const max = track.scrollWidth - track.clientWidth - 1;
            if (prev) prev.disabled = track.scrollLeft <= 0;
            if (next) next.disabled = track.scrollLeft >= max;
        };

        track.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);
        updateButtons();

        prev?.addEventListener('click', () => track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
        next?.addEventListener('click', () => track.scrollBy({ left:  cardWidth(), behavior: 'smooth' }));

        // Autoplay
        const intervalMs = parseInt(root.dataset.autoplay || '0', 10);
        if (intervalMs > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            let paused = false;
            root.addEventListener('mouseenter', () => (paused = true));
            root.addEventListener('mouseleave', () => (paused = false));
            root.addEventListener('focusin', () => (paused = true));
            root.addEventListener('focusout', () => (paused = false));

            setInterval(() => {
                if (paused) return;
                const max = track.scrollWidth - track.clientWidth - 1;
                if (track.scrollLeft >= max) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
                }
            }, intervalMs);
        }
    });

    // -----------------------------------------------------------------------
    // Section reveal via IntersectionObserver (respects prefers-reduced-motion)
    // -----------------------------------------------------------------------
    const sections = document.querySelectorAll('.resume-section');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sections.length && !reduceMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
        );
        sections.forEach((s) => io.observe(s));
    } else {
        // Reduced-motion users (and old browsers) get content visible immediately
        sections.forEach((s) => s.classList.add('is-visible'));
    }
});
