function updateTimer() {
  const startDate = new Date("2025-06-13T21:30:00");
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

function carregarFotosCarrossel() {
  const container = document.getElementById("carousel-inner");
  let i = 1;
  const imagens = [];

  function carregarProxima() {
    const img = new Image();
    img.src = `fotos_convertidas/${i}.webp`;

    img.onload = () => {
      img.alt = `Foto ${i}`;
      img.className = "carousel-img";
      imagens.push(img);
      i++;
      carregarProxima();
    };

    img.onerror = () => {
      imagens.forEach(img => container.appendChild(img.cloneNode()));
      imagens.forEach(img => container.appendChild(img.cloneNode())); // 🔁 duplicado p/ looping
      iniciarScrollAutomatico(container);
      console.log(`✅ ${imagens.length} imagens carregadas e duplicadas para animação.`);
    };
  }

  carregarProxima();
}

function iniciarScrollAutomatico(container) {
  let scrollPos = 0;
  const velocidade = 1.5; // ⏩ ajuste aqui para controlar a velocidade

  function rolar() {
    scrollPos += velocidade;
    if (scrollPos >= container.scrollWidth / 2) {
      scrollPos = 0;
    }
    container.scrollLeft = scrollPos;
    requestAnimationFrame(rolar);
  }

  requestAnimationFrame(rolar);
}

window.onload = () => {
  updateTimer();
  setInterval(updateTimer, 1000);
  carregarFotosCarrossel();
};
