// Seletores principais
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalConteudo = document.querySelector(".modal-conteudo");
const conteudoDireita = document.querySelector(".conteudo-direita");

let lastClickedImg = null;

// Abre o modal com animação
function abrirModal(img) {
    lastClickedImg = img;

    const rect = img.getBoundingClientRect();

    // cria clone da imagem clicada
    const clone = img.cloneNode();
    clone.classList.add("clone-img");
    document.body.appendChild(clone);

    // posição inicial (card)
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";

    // prepara modal no DOM, mas sem mostrar (sem .show)
    modal.style.display = "flex";
    modal.classList.remove("show");
    modalConteudo.classList.remove("reveal");

    // força reflow para garantir que o modal (embora invisível) esteja largado no layout
    modal.offsetHeight;

    // pega posição final (imagem do modal) já com o modal no DOM
    const modalRect = modalImg.getBoundingClientRect();

    // anima clone até a posição final
    requestAnimationFrame(() => {
        clone.style.top = modalRect.top + "px";
        clone.style.left = modalRect.left + "px";
        clone.style.width = modalRect.width + "px";
        clone.style.height = modalRect.height + "px";
    });

    // quando a animação do clone terminar → mostra modal real (após garantir que a imagem esteja carregada)
    clone.addEventListener("transitionend", () => {
        const imgSrc = img.src;

        // pré-carrega a imagem para evitar gap visual
        const pre = new Image();
        pre.src = imgSrc;

        const mostrarModal = () => {
            // seta imagem do modal
            modalImg.src = imgSrc;

            // monta o conteúdo lateral
            const ocupacao = img.getAttribute("data-ocupacao");
            const texto1 = img.getAttribute("data-texto1");
            const texto2 = img.getAttribute("data-texto2");
            const texto3 = img.getAttribute("data-texto3");

            conteudoDireita.innerHTML = `
                <div class="item alternado">
                    <img src="/img/${ocupacao}1.png" alt="">
                    <p>${texto1 || ""}</p>
                </div>

                <div class="item alternado invertido">
                    <p>${texto2 || ""}</p>
                    <img src="/img/${ocupacao}2.png" alt="">
                </div>

                <div class="item alternado">
                    <img src="/img/${ocupacao}3.png" alt="">
                    <p>${texto3 || ""}</p>
                </div>
            `;

            // mostra o modal e o conteúdo lateral
            modal.classList.add("show");
            modalConteudo.classList.add("reveal");

            // remove o clone pouco depois para evitar gap/flicker (o clone fica por cima por milissegundos)
            setTimeout(() => {
                if (clone && clone.parentNode) clone.remove();
            }, 40);
        };

        // se já carregou, mostra imediatamente; caso contrário espera o onload
        if (pre.complete) {
            mostrarModal();
        } else {
            pre.onload = mostrarModal;
            // em caso de erro de carregamento, ainda mostramos para não travar a UX
            pre.onerror = mostrarModal;
        }
    }, { once: true });
}

// Fecha o modal com animação reversa
function fecharModal() {
    if (!lastClickedImg) return;

    const rect = lastClickedImg.getBoundingClientRect();

    // cria clone da imagem do modal
    const clone = modalImg.cloneNode();
    clone.classList.add("clone-img");
    document.body.appendChild(clone);

    // posição inicial (imagem do modal)
    const modalRect = modalImg.getBoundingClientRect();
    clone.style.top = modalRect.top + "px";
    clone.style.left = modalRect.left + "px";
    clone.style.width = modalRect.width + "px";
    clone.style.height = modalRect.height + "px";

    // força reflow
    clone.getBoundingClientRect();

    // esconde o conteúdo real do modal (coluna lateral)
    modalConteudo.classList.remove("reveal");
    modal.classList.remove("show");

    // anima clone de volta ao card original
    requestAnimationFrame(() => {
        clone.style.top = rect.top + "px";
        clone.style.left = rect.left + "px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
    });

    // quando terminar → fecha modal e remove clone
    clone.addEventListener("transitionend", () => {
        setTimeout(() => {
            modal.style.display = "none";
            if (clone && clone.parentNode) clone.remove();
        }, 40);
    }, { once: true });
}

// Clique nas imagens abre modal
document.querySelectorAll(".img-competidor").forEach(img => {
    img.addEventListener("click", () => abrirModal(img));
});

// Clique fora do conteúdo fecha modal
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        fecharModal();
    }
});
