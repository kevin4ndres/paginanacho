// ===== Mobile Menu =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  nav.classList.toggle('open');
});

// Close menu on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ===== Header scroll effect =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// ===== Active nav on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat__number');
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Trigger counters when stats section is visible
const statsSection = document.querySelector('.stats');
let countersAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      animateCounters();
    }
  });
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// ===== Scroll Animations =====
const aosElements = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

aosElements.forEach(el => aosObserver.observe(el));

// ===== Project Filter =====
const filterBtns = document.querySelectorAll('.filtro-btn');
const projectCards = document.querySelectorAll('.proyecto-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'todos' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Form Handling with Google Calendar =====
const form = document.getElementById('cotizarForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const servicio = document.getElementById('servicio').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const mensaje = document.getElementById('mensaje').value.trim();

  // Validate required fields
  if (!nombre || !email || !telefono) {
    showMessage('Por favor completa todos los campos obligatorios.', 'error');
    return;
  }

  // Build WhatsApp message as fallback
  let whatsappMsg = `Hola, soy ${nombre}.%0A`;
  whatsappMsg += `Correo: ${email}%0A`;
  whatsappMsg += `Teléfono: ${telefono}%0A`;
  if (servicio) whatsappMsg += `Servicio: ${servicio}%0A`;
  if (fecha) whatsappMsg += `Fecha preferida: ${fecha}%0A`;
  if (hora) whatsappMsg += `Hora preferida: ${hora}%0A`;
  if (mensaje) whatsappMsg += `Proyecto: ${mensaje}%0A`;
  whatsappMsg += `%0AMe gustaría agendar una cotización.`;

  // Show success and open WhatsApp
  showMessage(
    '¡Solicitud recibida! Te redirigimos a WhatsApp para confirmar tu cita.',
    'success'
  );

  // Open WhatsApp with the form data
  setTimeout(() => {
    window.open(
      `https://wa.me/521234567890?text=${whatsappMsg}`,
      '_blank'
    );
  }, 1500);

  form.reset();
});

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  setTimeout(() => {
    formMessage.className = 'form-message';
    formMessage.style.display = 'none';
  }, 6000);
}

// ===== Set min date on date picker =====
const fechaInput = document.getElementById('fecha');
if (fechaInput) {
  const today = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', today);
}
