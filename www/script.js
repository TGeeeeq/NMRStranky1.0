function loadAnalytics() {
    if (document.getElementById('ga-script')) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-J1EYDZ6G3W');
    const s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-J1EYDZ6G3W';
    document.head.appendChild(s);
}

function deleteCookies() {
    const domain = location.hostname.replace(/^www\./, '');
    const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    ['_ga', '_gid'].forEach(name => {
        document.cookie = `${name}=; ${expired}; domain=.${domain}`;
        document.cookie = `${name}=; ${expired}`;
    });
    document.cookie.split(';').forEach(c => {
        const name = c.trim().split('=')[0];
        if (name.startsWith('_ga_')) {
            document.cookie = `${name}=; ${expired}; domain=.${domain}`;
        }
    });
}

function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('hidden');
}

// Main website functionality
class WebsiteManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'cs';
        this.init();
    }

    init() {
        this.injectCookieBanner();
        this.setupNavigation();
        this.setupNavbarScroll();
        this.setupLanguageSwitcher();
        this.setupAnimations();
        this.setupParallax();
        this.setupNewsletter();
        this.setupCookieBanner();
        this.applyLanguage(this.currentLang);
        this.updateCurrentYear();
        if (localStorage.getItem('cookieConsent') === 'accepted') {
            loadAnalytics();
        }
    }

    setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        let lastY = window.scrollY;
        let ticking = false;
        const onScroll = () => {
            const y = window.scrollY;
            if (y > 80) navbar.classList.add('is-scrolled');
            else navbar.classList.remove('is-scrolled');
            if (y > lastY && y > 240) navbar.classList.add('is-hidden');
            else navbar.classList.remove('is-hidden');
            lastY = y;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    setupParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const targets = document.querySelectorAll('[data-parallax], .hero-bg, .page-hero .hero-image img');
        if (!targets.length) return;
        let ticking = false;
        const update = () => {
            const y = window.scrollY;
            targets.forEach(el => {
                const speed = parseFloat(el.dataset.parallax || '0.18');
                el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
            });
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    setupNewsletter() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        const messageEl = document.getElementById('newsletter-message');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn && submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn && submitBtn.querySelector('.btn-loading');

        const showMessage = (text, type) => {
            if (!messageEl) return;
            messageEl.textContent = text;
            messageEl.className = 'newsletter-message ' + type;
            messageEl.hidden = false;
            setTimeout(() => { messageEl.hidden = true; }, 5000);
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.elements['name'].value.trim();
            const email = form.elements['email'].value.trim();
            const consent = form.elements['gdpr_consent'].checked;
            const lang = this.currentLang;
            const msgs = {
                cs: {
                    missing: 'Prosím vyplňte všechna pole.',
                    invalid: 'Prosím zadejte platnou e-mailovou adresu.',
                    consent: 'Pro odběr novinek je nutný souhlas.',
                    success: 'Děkujeme! Byli jste úspěšně přihlášeni k odběru novinek. 🎉',
                    error: 'Došlo k chybě při odesílání. Zkuste to prosím později.'
                },
                en: {
                    missing: 'Please fill in all fields.',
                    invalid: 'Please enter a valid email address.',
                    consent: 'Consent is required to receive the newsletter.',
                    success: 'Thanks! You are now subscribed to the newsletter. 🎉',
                    error: 'Something went wrong. Please try again later.'
                }
            }[lang] || msgs.cs;

            if (!name || !email) return showMessage(msgs.missing, 'error');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage(msgs.invalid, 'error');
            if (!consent) return showMessage(msgs.consent, 'error');

            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.hidden = true;
            if (btnLoading) btnLoading.hidden = false;

            try {
                const res = await fetch('/newsletter_signup_api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, action: 'subscribe' })
                });
                const data = await res.json();
                if (data.success) {
                    showMessage(msgs.success, 'success');
                    form.reset();
                } else {
                    showMessage(data.message || msgs.error, 'error');
                }
            } catch (err) {
                console.error('Newsletter error:', err);
                showMessage(msgs.error, 'error');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.hidden = false;
                if (btnLoading) btnLoading.hidden = true;
            }
        });
    }

    injectCookieBanner() {
        if (document.getElementById('cookie-banner')) return;
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner hidden';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Souhlas s cookies');
        banner.innerHTML = `
            <div class="cookie-content">
                <p data-cs="Tento web používá analytické cookies (Google Analytics) pro sledování návštěvnosti. Spouštíme je pouze s vaším souhlasem. <a href='gdpr' class='cookie-link'>Více informací</a>" data-en="This website uses analytics cookies (Google Analytics) to track traffic. We only activate them with your consent. <a href='gdpr' class='cookie-link'>More information</a>">
                    Tento web používá analytické cookies (Google Analytics) pro sledování návštěvnosti. Spouštíme je pouze s vaším souhlasem.
                    <a href="gdpr" class="cookie-link">Více informací</a>
                </p>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="btn btn-accept" data-cs="Přijmout" data-en="Accept">Přijmout</button>
                    <button id="reject-cookies" class="btn btn-reject" data-cs="Odmítnout" data-en="Reject">Odmítnout</button>
                </div>
            </div>`;
        document.body.appendChild(banner);
    }

    updateCurrentYear() {
        document.querySelectorAll('.current-year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            // Remove any existing listeners by cloning
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);

            newHamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = newHamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                newHamburger.setAttribute('aria-expanded', isActive);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!newHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    newHamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    newHamburger.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    newHamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    newHamburger.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    setupLanguageSwitcher() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            const langText = langToggle.querySelector('.lang-text');
            
            const updateToggleText = (lang) => {
                if (langText) langText.textContent = lang === 'cs' ? 'EN' : 'CZ';
            };

            updateToggleText(this.currentLang);

            langToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentLang = this.currentLang === 'cs' ? 'en' : 'cs';
                localStorage.setItem('language', this.currentLang);
                this.applyLanguage(this.currentLang);
                updateToggleText(this.currentLang);
            });
        }
    }

    applyLanguage(lang) {
        document.documentElement.lang = lang;
        const elements = document.querySelectorAll('[data-cs][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                    element.value = text;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (element.classList.contains('event-description')) {
                    element.innerHTML = renderEventMarkdown(text);
                } else {
                    element.innerHTML = text;
                }
            }
        });

        this.updatePageTitle(lang);
        setupEventCards(lang);
    }

    updatePageTitle(lang) {
        const titleMap = {
            'index': { cs: 'Nech mě růst - Domů', en: 'Let Me Grow - Home' },
            'o-nas': { cs: 'Nech mě růst - O nás', en: 'Let Me Grow - About Us' },
            'landing': { cs: 'Nech mě růst - Rozcestník', en: 'Let Me Grow - Navigation' },
            'jak-se-zapojit': { cs: 'Nech mě růst - Jak se zapojit', en: 'Let Me Grow - Get Involved' },
            'novinky': { cs: 'Nech mě růst - Novinky', en: 'Let Me Grow - News' },
            'zvireci-obyvatele': { cs: 'Nech mě růst - Zvířecí obyvatelé', en: 'Let Me Grow - Animal Residents' },
            'udalosti': { cs: 'Nech mě růst - Události', en: 'Let Me Grow - Events' },
            'kontakt': { cs: 'Nech mě růst - Kontakt', en: 'Let Me Grow - Contact' },
            'galerie': { cs: 'Nech mě růst - Galerie', en: 'Let Me Grow - Gallery' }
        };

        let path = window.location.pathname;
        let page = path.split('/').pop().replace('.html', '') || 'index';
        
        if (titleMap[page]) {
            document.title = titleMap[page][lang];
        }
    }

    setupAnimations() {
        if (!('IntersectionObserver' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('[data-reveal], .card, .value-card, .animal-card, .event-card, .team-card')
                .forEach(el => el.classList.add('is-revealed', 'visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.card, .value-card, .animal-card, .team-card').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
        document.querySelectorAll('[data-reveal]').forEach(el => {
            observer.observe(el);
        });

        const eventCards = document.querySelectorAll('.event-card');
        if (eventCards.length) {
            document.querySelectorAll('.upcoming-events[data-reveal]').forEach(section => {
                section.classList.add('is-revealed');
            });
            eventCards.forEach(el => el.classList.add('fade-in'));
            requestAnimationFrame(() => {
                eventCards.forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), 100 + i * 80);
                });
            });
        }
    }

    setupCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const rejectBtn = document.getElementById('reject-cookies');
        if (!banner || !acceptBtn || !rejectBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.remove('hidden'), 800);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.add('hidden');
            loadAnalytics();
        });

        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            banner.classList.add('hidden');
            deleteCookies();
        });
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderEventMarkdown(raw) {
    if (!raw) return '';
    const blocks = raw.replace(/\r\n/g, '\n').split(/\n{2,}/);
    const html = blocks.map(block => {
        const lines = block.split('\n');
        const isList = lines.every(l => /^\s*-\s+/.test(l));
        if (isList) {
            const items = lines.map(l => {
                const item = l.replace(/^\s*-\s+/, '');
                return `<li>${formatInline(item)}</li>`;
            }).join('');
            return `<ul>${items}</ul>`;
        }
        const parts = [];
        let buffer = [];
        const flushBuffer = () => {
            if (buffer.length) {
                parts.push(`<p>${buffer.map(formatInline).join('<br>')}</p>`);
                buffer = [];
            }
        };
        let listItems = [];
        const flushList = () => {
            if (listItems.length) {
                parts.push(`<ul>${listItems.map(i => `<li>${formatInline(i)}</li>`).join('')}</ul>`);
                listItems = [];
            }
        };
        lines.forEach(line => {
            const listMatch = line.match(/^\s*-\s+(.*)$/);
            if (listMatch) {
                flushBuffer();
                listItems.push(listMatch[1]);
            } else {
                flushList();
                if (line.trim()) buffer.push(line);
            }
        });
        flushList();
        flushBuffer();
        return parts.join('');
    }).join('');
    return html;
}

function formatInline(text) {
    let out = escapeHtml(text);
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|[\s(])\*([^*\s][^*]*[^*\s]|[^*\s])\*(?=$|[\s.,!?;:)])/g, '$1<em>$2</em>');
    return out;
}

function filterPastEvents() {
    const cards = document.querySelectorAll('.event-card');
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    let visibleCount = 0;
    cards.forEach(card => {
        if (card.dataset.eventStatus === 'postponed') {
            card.classList.remove('is-past');
            visibleCount++;
            return;
        }
        const iso = card.dataset.eventDate;
        if (!iso) {
            visibleCount++;
            return;
        }
        const eventDate = new Date(iso).getTime();
        if (isNaN(eventDate)) {
            visibleCount++;
            return;
        }
        if (eventDate + dayMs < now) {
            card.classList.add('is-past');
        } else {
            card.classList.remove('is-past');
            visibleCount++;
            if (eventDate - now < 7 * dayMs && eventDate >= now) {
                const badge = card.querySelector('.event-status--upcoming');
                if (badge) {
                    badge.classList.remove('event-status--upcoming');
                    badge.classList.add('event-status--soon');
                }
            }
        }
    });

    const grid = document.getElementById('events-list');
    if (grid) {
        let empty = grid.querySelector('.events-empty');
        if (visibleCount === 0) {
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'events-empty';
                empty.setAttribute('data-cs', 'Momentálně nemáme naplánované žádné akce. Sleduj nás na Instagramu @nech_me_rust pro nejnovější informace.');
                empty.setAttribute('data-en', 'No upcoming events at the moment. Follow us on Instagram @nech_me_rust for the latest updates.');
                grid.appendChild(empty);
            }
            const lang = document.documentElement.lang === 'en' ? 'en' : 'cs';
            empty.textContent = empty.getAttribute(`data-${lang}`);
        } else if (empty) {
            empty.remove();
        }
    }
}

function setupShowMore(lang) {
    const descriptions = document.querySelectorAll('.event-description');
    descriptions.forEach(desc => {
        const next = desc.nextElementSibling;
        if (next && next.classList.contains('show-more-btn')) {
            next.remove();
        }
        desc.classList.remove('is-collapsible', 'is-collapsed');
        desc.style.removeProperty('max-height');
    });

    requestAnimationFrame(() => {
        descriptions.forEach(desc => {
            const fullText = desc.textContent.trim();
            if (fullText.length < 240) return;

            desc.classList.add('is-collapsible', 'is-collapsed');

            const labels = {
                cs: { more: 'Zobrazit více', less: 'Zobrazit méně' },
                en: { more: 'Show more', less: 'Show less' }
            };
            const l = labels[lang] || labels.cs;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'show-more-btn';
            btn.innerHTML = `<span class="show-more-label">${l.more}</span> <i class="fas fa-chevron-down" aria-hidden="true"></i>`;
            btn.setAttribute('aria-expanded', 'false');

            btn.addEventListener('click', () => {
                const isCollapsed = desc.classList.toggle('is-collapsed');
                btn.classList.toggle('is-expanded', !isCollapsed);
                btn.setAttribute('aria-expanded', !isCollapsed);
                btn.querySelector('.show-more-label').textContent = isCollapsed ? l.more : l.less;
            });

            desc.insertAdjacentElement('afterend', btn);
        });
    });
}

function setupEventCards(lang) {
    if (!document.querySelector('.event-card')) return;
    filterPastEvents();
    setupShowMore(lang || 'cs');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.websiteManager = new WebsiteManager();

    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
});
