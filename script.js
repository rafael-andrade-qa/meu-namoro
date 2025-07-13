function updateTimer() {
  const startDate = new Date("2025-06-13T00:00:00");
  const now = new Date();
  const diff = now - startDate;

  let seconds = Math.floor(diff / 1000);
  const years = Math.floor(seconds / (365.25 * 24 * 60 * 60));
  seconds -= years * 365.25 * 24 * 60 * 60;

  const months = Math.floor(seconds / (30.44 * 24 * 60 * 60));
  seconds -= months * 30.44 * 24 * 60 * 60;

  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

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

window.onload = () => {
  updateTimer();
  setInterval(updateTimer, 1000);
  carregarFotosSwiper();
};
