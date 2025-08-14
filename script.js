function updateTimer() {
  const startDate = new Date("2025-06-13T00:00:00");
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0); // último dia do mês anterior
    days += previousMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const partes = [];
  const formatar = (v, s, p) => v === 1 ? `1 ${s}` : `${v} ${p}`;

  if (years > 0) partes.push(formatar(years, "ano", "anos"));
  if (months > 0 || years > 0) partes.push(formatar(months, "mês", "meses"));
  if (days > 0 || months > 0 || years > 0) partes.push(formatar(days, "dia", "dias"));
  if (hours > 0 || partes.length > 0) partes.push(formatar(hours, "hora", "horas"));
  if (minutes > 0 || partes.length > 0) partes.push(formatar(minutes, "minuto", "minutos"));
  partes.push(formatar(seconds, "segundo", "segundos"));

  document.getElementById("timer").textContent = partes.join(", ");
}

async function carregarFotosSwiper() {
  const wrapper = document.getElementById("swiper-wrapper");
  let i = 1;

  while (true) {
    const img = new Image();
    img.src = `fotos_convertidas/${i}.webp`;

    const carregada = await new Promise(resolve => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });

    if (!carregada) break;

    img.alt = `Foto ${i}`;
    img.className = "carousel-img";

    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.appendChild(img);

    wrapper.appendChild(slide);
    i++;
  }

  console.log(`✅ Carregadas ${i - 1} imagens.`);

  new Swiper(".swiper-container", {
    slidesPerView: 3,
    spaceBetween: 5,
    loop: true,
    autoplay: {
      delay: 10,
      disableOnInteraction: false,
    },
    speed: 1100,
    grabCursor: true,
    breakpoints: {
      0:     { slidesPerView: 3 },
      480:   { slidesPerView: 3 },
      768:   { slidesPerView: 3 }
    }
  });
}

/* ========= Carrossel de mensagens ========= */

const REL_START = new Date("2025-06-13T21:30:00");

function mesesDesdeInicio(ref = new Date()) {
  let m = (ref.getFullYear() - REL_START.getFullYear()) * 12 +
          (ref.getMonth() - REL_START.getMonth());
  if (ref.getDate() < REL_START.getDate()) m -= 1;
  return Math.max(0, m);
}

async function carregarMensagensSwiper() {
  const wrapper = document.getElementById("mensagens-wrapper");
  if (!wrapper) return;

  try {
    const resp = await fetch("mensagens/mensagens.json");
    const mensagens = await resp.json();

    mensagens.forEach((msg, idx) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <article class="msg-card">
          <header class="msg-headline">
            <span class="badge-mes">${idx + 1}º mês</span>
            <h3 class="msg-title">${msg.titulo}</h3>
          </header>
          <p class="msg-text">${msg.texto}</p>
        </article>
      `;
      wrapper.appendChild(slide);
    });

    const mesAtualIndex = Math.min(
      mensagens.length - 1,
      mesesDesdeInicio(new Date())
    );

    new Swiper(".mensagens-swiper", {
      slidesPerView: 1,
      spaceBetween: 12,
      loop: false,
      allowTouchMove: true,
      navigation: {
        nextEl: ".mensagens .swiper-button-next",
        prevEl: ".mensagens .swiper-button-prev",
      },
      pagination: {
        el: ".mensagens .swiper-pagination",
        clickable: true,
      },
      speed: 400,
      initialSlide: mesAtualIndex
    });

  } catch (err) {
    console.error("Erro ao carregar mensagens:", err);
  }
}

window.onload = () => {
  updateTimer();
  setInterval(updateTimer, 1000);
  carregarFotosSwiper();
  carregarMensagensSwiper(); // <— novo
};

