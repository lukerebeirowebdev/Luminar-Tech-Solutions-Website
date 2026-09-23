  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;
  const sunPath = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36-.7-.7M6.34 6.34l-.7-.7m12.02 0-.7.7M6.34 17.66l-.7.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>';
  const moonPath = '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>';
  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    themeIcon.style.transform = 'rotate(90deg)';
    themeIcon.style.opacity = '0';
    setTimeout(() => {
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeIcon.innerHTML = isDark ? sunPath : moonPath;
      themeIcon.style.transform = 'rotate(0deg)';
      themeIcon.style.opacity = '1';
    }, 150);
  });

  // Sticky header shrink-on-scroll
  const siteHeader = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  // Mobile nav drawer
  const hamburger = document.getElementById('hamburger');
  const navCenter = document.getElementById('navCenter');
  const navBackdrop = document.getElementById('navBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const navLinks = document.getElementById('navLinks');

  function openDrawer(){
    navCenter.classList.add('open');
    navBackdrop.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-label','Close menu');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){
    navCenter.classList.remove('open');
    navBackdrop.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-label','Open menu');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    if(navCenter.classList.contains('open')) closeDrawer(); else openDrawer();
  });
  drawerClose.addEventListener('click', closeDrawer);
  navBackdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeDrawer(); });
  navCenter.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Scrollspy — highlight active nav link based on section in view
  const navAnchors = Array.from(navLinks.querySelectorAll('a[data-section]'));
  const spySections = navAnchors
    .map(a => document.getElementById(a.dataset.section))
    .filter(Boolean);
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navLinks.querySelector(`a[data-section="${entry.target.id}"]`);
      if(!link) return;
      if(entry.isIntersecting){
        navAnchors.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  spySections.forEach(sec => spyObserver.observe(sec));

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Booking form
  function handleBooking(e){
    e.preventDefault();
    document.getElementById('formSuccess').style.display = 'block';
    e.target.reset();
    return false;
  }

  // Chat widget
  const chatBubble = document.getElementById('chatBubble');
  const chatWindow = document.getElementById('chatWindow');
  chatBubble.addEventListener('click', () => chatWindow.classList.toggle('open'));
  function sendChat(){
    const input = document.getElementById('chatInput');
    const body = document.querySelector('.chat-body');
    if(!input.value.trim()) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg';
    userMsg.style.marginLeft = 'auto';
    userMsg.style.background = 'var(--cyan)';
    userMsg.style.color = '#03222b';
    userMsg.style.borderRadius = '10px 10px 2px 10px';
    userMsg.textContent = input.value;
    body.appendChild(userMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'chat-msg';
      reply.textContent = "Thanks for the message — I'll get back to you shortly. For urgent issues, feel free to call directly.";
      body.appendChild(reply);
      body.scrollTop = body.scrollHeight;
    }, 700);
  }
  document.getElementById('chatInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendChat(); });