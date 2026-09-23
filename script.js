document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const siteHeader = document.getElementById('siteHeader');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const hamburger = document.getElementById('hamburger');
  const navCenter = document.getElementById('navCenter');
  const navBackdrop = document.getElementById('navBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const navLinks = document.getElementById('navLinks');
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');
  const chatBubble = document.getElementById('chatBubble');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const sendChatButton = document.getElementById('sendChatButton');
  const yearEl = document.getElementById('year');

  const sunPath = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36-.7-.7M6.34 6.34l-.7-.7m12.02 0-.7.7M6.34 17.66l-.7.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>';
  const moonPath = '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>';

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('lt-theme', theme);
    themeIcon.innerHTML = theme === 'dark' ? moonPath : sunPath;
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem('lt-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }

  themeToggle.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    themeIcon.style.transform = 'rotate(90deg)';
    themeIcon.style.opacity = '0';
    setTimeout(() => {
      setTheme(nextTheme);
      themeIcon.style.transform = 'rotate(0deg)';
      themeIcon.style.opacity = '1';
    }, 150);
  });

  function updateHeaderOnScroll() {
    if (!siteHeader) return;
    siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  function openDrawer() {
    if (!navCenter || !navBackdrop || !hamburger) return;

    navCenter.classList.add('open');
    navBackdrop.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!navCenter || !navBackdrop || !hamburger) return;

    navCenter.classList.remove('open');
    navBackdrop.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = navCenter.classList.contains('open');
      if (isOpen) closeDrawer(); else openDrawer();
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (navBackdrop) navBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
  });

  if (navCenter) {
    navCenter.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
  }

  const navAnchors = Array.from(document.querySelectorAll('a[data-section]'));
  const spySections = navAnchors
    .map((anchor) => document.getElementById(anchor.dataset.section))
    .filter(Boolean);

  if ('IntersectionObserver' in window && spySections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const activeLink = navLinks.querySelector(`a[data-section="${entry.target.id}"]`);
        if (!activeLink) return;

        navAnchors.forEach((anchor) => anchor.classList.remove('active'));
        activeLink.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    spySections.forEach((section) => spyObserver.observe(section));
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      formSuccess.style.display = 'block';
      bookingForm.reset();
    });
  }

  if (chatBubble && chatWindow) {
    chatBubble.addEventListener('click', () => {
      const isOpen = chatWindow.classList.contains('open');
      chatWindow.classList.toggle('open', !isOpen);
    });
  }

  function addChatMessage(message, fromUser = false) {
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-msg';

    if (fromUser) {
      messageEl.style.marginLeft = 'auto';
      messageEl.style.background = 'var(--cyan)';
      messageEl.style.color = '#03222b';
      messageEl.style.borderRadius = '10px 10px 2px 10px';
    }

    messageEl.textContent = message;
    chatBody.appendChild(messageEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function sendChat() {
    if (!chatInput || !chatBody) return;

    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage(message, true);
    chatInput.value = '';

    setTimeout(() => {
      addChatMessage("Thanks for the message — I'll get back to you shortly. For urgent issues, feel free to call directly.");
    }, 700);
  }

  if (sendChatButton) sendChatButton.addEventListener('click', sendChat);
  if (chatInput) {
    chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendChat();
      }
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeDrawer();
  });

  applySavedTheme();
});
