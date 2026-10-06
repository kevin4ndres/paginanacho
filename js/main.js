// ===== CONFIGURACIÓN =====
// Cambia aquí el número de WhatsApp (formato internacional, sin + ni espacios).
// Recuerda actualizar también el teléfono y correo visibles en index.html.
const WHATSAPP_NUMERO = '56912345678';
const WHATSAPP_MENSAJE = 'Hola, me interesa solicitar una cotización para un proyecto de construcción.';

function whatsappUrl(texto) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = whatsappUrl(WHATSAPP_MENSAJE);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// ===== Calculadora de proyecto =====
// Valores referenciales de costo directo en UF/m² (fuente: rangos de mercado Chile 2026:
// ~22 UF económica, ~30 UF media, ~42 UF premium). Ajusta aquí los valores del negocio.
const CALC = {
  valorUF: 41106,              // valor UF en pesos (actualizar periódicamente)
  ufPorM2: { economica: 22, media: 30, premium: 42 },
  factorMaterial: { albanileria: 1.0, hormigon: 1.15, metalcon: 0.92, madera: 0.85, prefabricada: 0.75 },
  factorObra: { nueva: 1.0, ampliacion: 1.08, remodelacion: 0.55 },
  margen: 0.10,                // ± rango mostrado
  nombres: {
    obra: { nueva: 'Obra nueva', ampliacion: 'Ampliación', remodelacion: 'Remodelación' },
    material: { albanileria: 'Albañilería', hormigon: 'Hormigón armado', metalcon: 'Metalcon', madera: 'Madera', prefabricada: 'Prefabricada (SIP)' },
    terminacion: { economica: 'Económica', media: 'Media', premium: 'Premium' }
  }
};

const calcState = { obra: 'nueva', material: 'metalcon', terminacion: 'media', m2: 80 };
const clp = n => '$' + (Math.round(n / 1000) * 1000).toLocaleString('es-CL');
const uf = n => n.toLocaleString('es-CL', { maximumFractionDigits: 1 }) + ' UF';

function calcular() {
  const s = calcState;
  const porM2 = CALC.ufPorM2[s.terminacion] * CALC.factorMaterial[s.material] * CALC.factorObra[s.obra];
  const totalUF = porM2 * s.m2;
  const total = totalUF * CALC.valorUF;
  // plazo: ~2 meses base + ~1 mes cada 30 m² (más rápido en sistemas livianos)
  const rapidez = { prefabricada: 0.6, madera: 0.8, metalcon: 0.8, albanileria: 1, hormigon: 1.15 }[s.material];
  const meses = Math.max(1, Math.round((2 + s.m2 / 30) * rapidez * (s.obra === 'remodelacion' ? 0.6 : 1)));
  return { porM2, totalUF, total, meses };
}

function renderCalc() {
  const r = calcular();
  const totalEl = document.getElementById('calcTotal');
  if (!totalEl) return;
  totalEl.textContent = clp(r.total);
  totalEl.classList.remove('bump'); void totalEl.offsetWidth; totalEl.classList.add('bump');
  document.getElementById('calcRange').textContent =
    `Entre ${clp(r.total * (1 - CALC.margen))} y ${clp(r.total * (1 + CALC.margen))}`;
  document.getElementById('calcPerM2').textContent = `${uf(r.porM2)} · ${clp(r.porM2 * CALC.valorUF)}`;
  document.getElementById('calcUF').textContent = uf(r.totalUF);
  document.getElementById('calcPlazo').textContent = `${r.meses} ${r.meses === 1 ? 'mes' : 'meses'} aprox.`;
}

function resumenCalc() {
  const s = calcState, n = CALC.nombres, r = calcular();
  return `${n.obra[s.obra]} de ${s.m2} m² en ${n.material[s.material]}, terminación ${n.terminacion[s.terminacion]}. ` +
         `Estimación web: ${clp(r.total)} (${uf(r.totalUF)}).`;
}

document.querySelectorAll('[data-calc]').forEach(group => {
  const key = group.dataset.calc;
  group.querySelectorAll('button').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active'));
    btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      calcState[key] = btn.dataset.value;
      renderCalc();
    });
  });
});

const m2Range = document.getElementById('calcM2Range');
const m2Input = document.getElementById('calcM2');
if (m2Range && m2Input) {
  m2Range.addEventListener('input', () => {
    m2Input.value = m2Range.value;
    calcState.m2 = +m2Range.value;
    renderCalc();
  });
  m2Input.addEventListener('input', () => {
    const v = Math.min(2000, Math.max(0, parseInt(m2Input.value, 10) || 0));
    if (v < 10) return;
    calcState.m2 = v;
    m2Range.value = Math.min(500, v);
    renderCalc();
  });
  m2Input.addEventListener('blur', () => {
    const v = Math.min(2000, Math.max(10, parseInt(m2Input.value, 10) || 10));
    m2Input.value = v; calcState.m2 = v; m2Range.value = Math.min(500, v); renderCalc();
  });
}

const calcCotizar = document.getElementById('calcCotizar');
if (calcCotizar) {
  calcCotizar.addEventListener('click', () => {
    const mapServicio = { nueva: 'construccion', ampliacion: 'construccion', remodelacion: 'remodelacion' };
    document.getElementById('servicio').value = mapServicio[calcState.obra];
    const msg = document.getElementById('mensaje');
    msg.value = resumenCalc() + (msg.value ? '\n\n' + msg.value : '');
    document.getElementById('estimacion').value = resumenCalc();
    setTimeout(() => document.getElementById('nombre').focus({ preventScroll: true }), 700);
  });
}

const calcUFValor = document.getElementById('calcUFValor');
if (calcUFValor) calcUFValor.textContent = clp(CALC.valorUF);
renderCalc();

// ===== Formulario de cotización =====
const form = document.getElementById('cotizarForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const servicioSel = document.getElementById('servicio');
  const servicio = servicioSel.value ? servicioSel.options[servicioSel.selectedIndex].text : '';
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !telefono) {
    showMessage('Por favor completa todos los campos obligatorios.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn__text').style.display = 'none';
  submitBtn.querySelector('.btn__loading').style.display = 'inline';

  // Enviar a Netlify Forms (llega al panel de Netlify y por correo si se configura)
  let enviado = false;
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    enviado = res.ok;
  } catch (err) {
    enviado = false;
  }

  // Mensaje de WhatsApp con los datos del formulario
  const fechaTxt = fecha ? fecha.split('-').reverse().join('-') : '';
  const lineas = [
    `Hola, soy ${nombre}.`,
    `Correo: ${email}`,
    `Teléfono: ${telefono}`,
    servicio && `Servicio: ${servicio}`,
    fechaTxt && `Fecha preferida: ${fechaTxt}`,
    hora && `Hora preferida: ${hora}`,
    mensaje && `Proyecto: ${mensaje}`
  ].filter(Boolean);
  const waLink = whatsappUrl(lineas.join('\n') + '\n\nMe gustaría agendar una cotización.');

  formMessage.innerHTML = '';
  const texto = document.createElement('span');
  texto.textContent = enviado
    ? '¡Solicitud recibida! Te contactaremos pronto. Si quieres, confírmala por WhatsApp: '
    : 'No pudimos enviar el formulario. Envíanos tu solicitud por WhatsApp: ';
  const link = document.createElement('a');
  link.href = waLink;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'abrir WhatsApp';
  formMessage.append(texto, link);
  formMessage.className = `form-message ${enviado ? 'success' : 'error'}`;
  formMessage.style.display = '';

  submitBtn.disabled = false;
  submitBtn.querySelector('.btn__text').style.display = '';
  submitBtn.querySelector('.btn__loading').style.display = 'none';
  if (enviado) form.reset();
});

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = '';
}

// ===== Set min date on date picker =====
const fechaInput = document.getElementById('fecha');
if (fechaInput) {
  const today = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', today);
}
