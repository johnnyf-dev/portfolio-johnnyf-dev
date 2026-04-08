/* 
Fluxograma da lógica do arquivo scripts.js
------------------------------------------
INÍCIO
  |
  |--> Efeito Matrix
  |       |--> Configura canvas
  |       |--> Define caracteres
  |       |--> Loop de animação (setInterval)
  |
  |--> Interação com imagens de projetos
  |       |--> Clique: aumenta e volta ao normal
  |       |--> Toque: aumenta ao segurar, volta ao soltar
  |
  |--> Carrossel de destaques
  |       |--> Auto-scroll infinito
  |       |--> Pausa ao interagir
  |       |--> Retoma após 3s
  |
  |--> Carrossel de depoimentos
  |       |--> Duplica itens para simular infinito
  |       |--> Auto-scroll suave
  |       |--> Pausa ao interagir
  |       |--> Retoma após 3s
  |
FIM
*/

// =========================
// Efeito Matrix no fundo
// =========================

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const fontSize = 14;
const letters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const matrix = letters.split("");

let columns;
let drops;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}
resizeCanvas(); // Ajusta ao carregar
window.addEventListener("resize", resizeCanvas);


function drawMatrix() {
    console.log("Desenhando Matrix..."); // teste
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";

    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 100);

// =========================
// Interação com imagens
// =========================

// Seleciona todas as imagens de projetos
const imagensProjetos = document.querySelectorAll(".projeto");

// Função para aumentar imagem
function aumentarImagem(img) {
    img.style.transform = "scale(1.5)";
    img.style.transition = "transform 0.3s ease";
}

// Função para voltar ao normal
function normalImagem(img) {
    img.style.transform = "scale(1)";
}

// Adiciona eventos para cada imagem
imagensProjetos.forEach((img) => {
    // Clique com mouse
    img.addEventListener("click", () => {
        aumentarImagem(img);
        setTimeout(() => normalImagem(img), 1000); // Volta ao normal após 1s
    });

    // Segurar no celular (touchstart)
    img.addEventListener("touchstart", () => {
        aumentarImagem(img);
    });

    // Soltar no celular (touchend)
    img.addEventListener("touchend", () => {
        normalImagem(img);
    });
});

// =========================
// Carrossel interativo
// =========================

const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel-track");

// DUPLICA os itens para simular infinito
track.innerHTML += track.innerHTML;

let isDown = false;   // <--- declaração que faltava
let startX;
let scrollLeft;
let autoScroll;

function startAutoScroll() {
  stopAutoScroll();
  autoScroll = setInterval(() => {
    carousel.scrollLeft += 1; // velocidade lenta
    if (carousel.scrollLeft >= track.scrollWidth / 2) {
      carousel.scrollLeft = 0; // volta suavemente ao início
    }
  }, 30);
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

startAutoScroll();

// Mouse
carousel.addEventListener("mousedown", (e) => {
  isDown = true;
  stopAutoScroll();
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("mouseup", () => {
  isDown = false;
  setTimeout(startAutoScroll, 3000);
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2;
  carousel.scrollLeft = scrollLeft - walk;
});
// =========================
// Toque no celular
// =========================
carousel.addEventListener("touchstart", (e) => {
  isDown = true;
  stopAutoScroll();
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("touchend", () => {
  isDown = false;
  setTimeout(startAutoScroll, 3000);
});

carousel.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2;
  carousel.scrollLeft = scrollLeft - walk;
});

// =========================
/* Depoimentos */
// =========================
const depoimentosCarousel = document.querySelector(".depoimentos-carousel");
const depoimentosTrack = document.querySelector(".depoimentos-track");

// DUPLICA os depoimentos para simular infinito
depoimentosTrack.innerHTML += depoimentosTrack.innerHTML;

let depoimentosScroll;

function startDepoimentosScroll() {
  stopDepoimentosScroll();
  depoimentosScroll = setInterval(() => {
    depoimentosCarousel.scrollLeft += 1;
    if (depoimentosCarousel.scrollLeft >= depoimentosTrack.scrollWidth / 2) {
      depoimentosCarousel.scrollLeft = 0; // reinicia suavemente
    }
  }, 90);
}

function stopDepoimentosScroll() {
  clearInterval(depoimentosScroll);
}

startDepoimentosScroll();

// Pausar ao interagir
depoimentosCarousel.addEventListener("mousedown", stopDepoimentosScroll);
depoimentosCarousel.addEventListener("touchstart", stopDepoimentosScroll);

// Retomar após 3s
depoimentosCarousel.addEventListener("mouseup", () => setTimeout(startDepoimentosScroll, 3000));
depoimentosCarousel.addEventListener("touchend", () => setTimeout(startDepoimentosScroll, 3000));



// Cada atualização soma +1 no contador global
fetch('https://api.countapi.xyz/hit/johnnyf/portfolio')
  .then(res => res.json())
  .then(res => {
    document.getElementById("contador").innerText = "Visitas: " + res.value;
  })
  .catch(err => console.error("Erro no contador:", err));


// =========================
// Assinatura
// =========================


/*   
      ██╗ ██████╗ 
      ██║██╔═══██╗
      ██║██║    ██║
██    ██║██║   ██║
╚█████╔╝╚██████╔╝
 ╚════╝  ╚═════╝ 
 JohnnyF. Dev
 */ 