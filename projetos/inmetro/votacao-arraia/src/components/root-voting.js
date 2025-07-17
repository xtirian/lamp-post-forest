
class Root extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback(){
        const style = `
            <style>
                .container{
                    overflow-y:hidden;
                    overflow-x:hidden;
                }
                .background_img{
                    position: absolute;
                }
                .nuvem_esquerda{
                    top:64%;
                    left:0;
                    transform: translatex(-20%);
                    animation: moverNuvemEsquerda 5s ease-in-out infinite alternate;
                }

                @keyframes moverNuvemEsquerda {
                    0% {
                        transform: translateX(-20%);
                    }
                    50% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-20%);
                    }
                }

                .nuvem_direita{
                    top:49%;
                    right:0;
                    transform: translatex(50%);
                    animation: moverNuvemDireita 8s ease-in-out infinite alternate;
                }

                @keyframes moverNuvemDireita {
                    0% {
                        transform: translateX(50%);
                    }
                    50% {
                        transform: translateX(30%);
                    }
                    100% {
                        transform: translateX(50%);
                    }
                }

                .base_img{
                    position:absolute;
                    bottom:-4%;
                    left:50%;
                    transform:translatex(-50%);                    
                }
            </style>
        `;

        const template = `
            <div class="container">
                <img class="background_img nuvem_direita" src="./public/images/nuvem_direita.svg" alt="nuvem direita"/>
                <img class="background_img nuvem_esquerda" src="./public/images/nuvem_esquerda.svg" alt="nuvem esquerda"/>
                <slot>
                  <!-- ROOT: don't use this part -->
                </slot>
                <img class="background_img base_img" src="./public/images/base.svg" alt="base"/>
            </div>
        `;

        this.shadowRoot.innerHTML = style + template;
    }
}

customElements.define('root-voting', Root);