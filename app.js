const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const conteudoDireita = document.querySelector(".conteudo-direita");

// ao clicar em qualquer competidor
document.querySelectorAll(".img-competidor").forEach(img => {
    img.addEventListener("click", () => {
        modal.style.display = "flex";

        // pega a ocupação do atributo data
        const ocupacao = img.getAttribute("data-ocupacao");
        const texto1 = img.getAttribute("data-texto1");
        const texto2 = img.getAttribute("data-texto2");
        const texto3 = img.getAttribute("data-texto3");

        // imagem principal (a do card clicado)
        modalImg.src = img.src;

        // monta dinamicamente os 3 blocos alternados
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
    });
});

// fechar modal clicando fora
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
