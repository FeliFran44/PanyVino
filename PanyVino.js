// ============ MENU DATA ============
const menuData = {
  entrantes: [
    { name: 'Burrata de campo', desc: 'Tomates asados, albahaca fresca, aceite de oliva extra virgen y pan de masa madre', price: '$480' },
    { name: 'Tartar de lomo', desc: 'Corte a cuchillo, yema curada, alcaparras y brioche tostado', price: '$620' },
    { name: 'Provoleta al romero', desc: 'Provolone artesanal, romero fresco, miel de la sierra y almendras tostadas', price: '$390' },
    { name: 'Ensalada de hinojos', desc: 'Hinojo laminado, naranja sanguina, queso azul y nueces caramelizadas', price: '$420' }
  ],
  platos: [
    { name: 'Cordero al horno de barro', desc: 'Cocinado 8 horas, puré de papa ahumado y reducción de su jugo con menta', price: '$1.280' },
    { name: 'Risotto de hongos de bosque', desc: 'Arroz carnaroli, porcini, parmesano añejado y aceite de trufa blanca', price: '$980' },
    { name: 'Ojo de bife de pastura', desc: 'A la plancha, chimichurri de hierbas y papas confitadas en grasa de pato', price: '$1.450' },
    { name: 'Merluza negra', desc: 'Con risotto de espinaca, cítricos y almendra fileteada', price: '$1.180' }
  ],
  postres: [
    { name: 'Tiramisú de la casa', desc: 'Preparado al momento con café de tueste local y licor de amaretto', price: '$380' },
    { name: 'Torta tibia de chocolate', desc: 'Chocolate 70%, helado de vainilla bourbon y frutos rojos', price: '$420' },
    { name: 'Crème brûlée de vainilla', desc: 'Vainilla de Madagascar y galleta de almendras caseras', price: '$360' },
    { name: 'Tabla de quesos', desc: 'Selección de cuatro quesos uruguayos, dulces caseros y frutos secos', price: '$580' }
  ],
  bebidas: [
    { name: 'Tannat reserva', desc: 'Bodega Bouza 2020 · copa / botella', price: '$320 / $1.680' },
    { name: 'Albariño de autor', desc: 'Garzón Single Vineyard · fresco, mineral, costero', price: '$380 / $1.950' },
    { name: 'Gin Tónica de la casa', desc: 'Gin artesanal, botánicos de la huerta, tónica Fever Tree', price: '$420' },
    { name: 'Café de finca', desc: 'Tueste medio · grano seleccionado de productor uruguayo', price: '$180' }
  ]
};

function renderMenu(cat) {
  const list = document.getElementById('menu-list');
  list.innerHTML = menuData[cat].map(item => `
    <div class="menu-item reveal visible">
      <div class="flex items-end mb-2">
        <h3 class="serif text-2xl flex-shrink-0">${item.name}</h3>
        <div class="dots"></div>
        <span class="menu-price serif text-xl font-medium transition-colors flex-shrink-0">${item.price}</span>
      </div>
      <p class="text-sm opacity-70 italic serif">${item.desc}</p>
    </div>
  `).join('');
}
renderMenu('entrantes');

document.querySelectorAll('.menu-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });
});

// ============ SCROLL REVEAL ============
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============ STARS ============
let rating = 5;
const stars = document.querySelectorAll('#stars span');
function paintStars(n) {
  stars.forEach((s, i) => {
    s.style.opacity = i < n ? '1' : '0.25';
  });
}
paintStars(5);
stars.forEach(s => {
  s.addEventListener('click', () => {
    rating = parseInt(s.dataset.star);
    paintStars(rating);
  });
});

document.getElementById('reviewForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert(`¡Gracias por tu reseña de ${rating} estrella${rating>1?'s':''}! Tu opinión nos ayuda a seguir mejorando.`);
  e.target.reset();
  paintStars(5);
});

// ============ CHATBOT ============
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const iconOpen = document.getElementById('chatIconOpen');
const iconClose = document.getElementById('chatIconClose');

chatToggle.addEventListener('click', () => {
  chatPanel.classList.toggle('open');
  iconOpen.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
  if (chatPanel.classList.contains('open') && chatBody.children.length === 0) {
    setTimeout(() => botFlow('start'), 300);
  }
});

function addBubble(text, type='bot') {
  const div = document.createElement('div');
  div.className = `bubble-msg ${type === 'bot' ? 'bubble-bot self-start' : 'bubble-user self-end ml-auto'} px-4 py-3 max-w-[85%] text-sm leading-relaxed`;
  div.style.display = 'block';
  div.innerHTML = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.id = 'typing';
  div.className = 'bubble-bot px-4 py-3 max-w-[85%]';
  div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

// Conversation state
let chatState = { step: 'start', data: {} };

function botSay(msgs, thenStep) {
  showTyping();
  setTimeout(() => {
    removeTyping();
    msgs.forEach(m => addBubble(m, 'bot'));
    chatState.step = thenStep;
  }, 900);
}

function botFlow(step, userMsg=null) {
  if (userMsg) addBubble(userMsg, 'user');
  switch(step) {
    case 'start':
      botSay([
        '¡Hola! 👋 Soy el asistente de Pan y Vino.',
        'Te ayudo a reservar tu mesa en un minuto. ¿Para qué <strong>fecha</strong> querés la reserva? (ej: 25 de abril)'
      ], 'fecha');
      break;
    case 'fecha':
      chatState.data.fecha = userMsg;
      botSay([`Perfecto, anotado para el <strong>${userMsg}</strong>. ¿Para cuántas personas?`], 'personas');
      break;
    case 'personas':
      chatState.data.personas = userMsg;
      botSay([`Ideal, mesa para <strong>${userMsg}</strong>. ¿A qué hora preferís? Tenemos turnos de 12:00–15:00 y 20:00–00:00.`], 'hora');
      break;
    case 'hora':
      chatState.data.hora = userMsg;
      botSay([`Reservado a las <strong>${userMsg}</strong>. ¿Me pasás tu <strong>nombre</strong>?`], 'nombre');
      break;
    case 'nombre':
      chatState.data.nombre = userMsg;
      botSay([`Gracias, ${userMsg}. Por último, un <strong>teléfono de contacto</strong>.`], 'telefono');
      break;
    case 'telefono':
      chatState.data.telefono = userMsg;
      botSay([
        '✨ ¡Listo! Tu reserva quedó registrada:',
        `<div class="mt-1 p-3 bg-white rounded border border-[rgba(26,29,23,0.1)]">
          <p class="text-xs uppercase tracking-widest opacity-60 mb-1">Resumen</p>
          <p><strong>Fecha:</strong> ${chatState.data.fecha}</p>
          <p><strong>Personas:</strong> ${chatState.data.personas}</p>
          <p><strong>Hora:</strong> ${chatState.data.hora}</p>
          <p><strong>A nombre de:</strong> ${chatState.data.nombre}</p>
        </div>`,
        'Te contactaremos al teléfono que nos diste para confirmar. ¡Gracias por elegirnos! 🍷'
      ], 'done');
      break;
    case 'done':
      botSay(['¿Querés hacer otra reserva o consulta? Escribí <strong>"sí"</strong> para empezar de nuevo.'], 'restart');
      break;
    case 'restart':
      if (userMsg.toLowerCase().includes('s')) {
        chatState = { step: 'start', data: {} };
        botFlow('start');
      } else {
        botSay(['¡Perfecto! Cualquier cosa estamos acá. Nos vemos en la mesa. 🌿'], 'end');
      }
      break;
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = chatInput.value.trim();
  if (!val) return;
  chatInput.value = '';
  botFlow(chatState.step, val);
});

// Reserve buttons -> open chatbot
function openChatbot() {
  if (!chatPanel.classList.contains('open')) {
    chatPanel.classList.add('open');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
    if (chatBody.children.length === 0) {
      setTimeout(() => botFlow('start'), 300);
    }
  }
  // Scroll chatbot into view on mobile
  chatPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
}
document.getElementById('navReserveBtn').addEventListener('click', openChatbot);
document.getElementById('heroReserveBtn').addEventListener('click', openChatbot);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Trigger hero reveals on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-bg .reveal').forEach(el => el.classList.add('visible'));
});

// ============ LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxCaption.textContent = caption || alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}

document.querySelectorAll('.gallery-item').forEach(el => {
  el.addEventListener('click', (e) => {
    // Ignore clicks on the caption overlay text (still bubble normally)
    const img = el.querySelector('img');
    if (!img) return;
    const caption = el.dataset.caption || img.alt || '';
    openLightbox(img.src, img.alt, caption);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  // Click on backdrop (not image) closes
  if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});
