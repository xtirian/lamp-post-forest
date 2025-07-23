class Root extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.step = 0;
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

                .base_img {
                    position: absolute;
                    bottom: -1%;
                    left: 50%;
                    transform: translateX(-50%);
                    min-width: 120%;
                    max-width: 160%;
                    z-index: -10;
                    pointer-events: none; /* não vai bloquear cliques no conteúdo */
                }

                #navigation-root {
                    position: relative;
                    z-index: 10; /* maior que -10 */
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
                
            </style>
        `;

        const template = `
            <div class="container">
                <img class="background_img nuvem_direita" src="./public/images/nuvem_direita.svg" alt="nuvem direita"/>
                <img class="background_img nuvem_esquerda" src="./public/images/nuvem_esquerda.svg" alt="nuvem esquerda"/>
                <img class="background_img base_img" src="./public/images/base.svg" alt="base"/>
                    <div id="navigation-root">
                        <!-- ROOT NAVIGATION -->
                    </div>                    
            </div>
        `;

        this.shadowRoot.innerHTML = style + template;

        this.stepContainer = this.shadowRoot.querySelector('#navigation-root');
        this.renderStep();
    }

    renderStep() {
        this.stepContainer.innerHTML = '';        
        let component;
        if(!this.checkDevice()){
            this.step = 4
        }
        switch (this.step) {
        case 0:
            component = document.createElement('splash-screen');            
            setTimeout(() => this.nextStep(), 3000);
            break;
        case 1:
            component = document.createElement('home-page');
            break;
        case 2:
            component = document.createElement('votacao-page');
            break;        
        case 3:
            component = document.createElement('votacao-page');
            break;      
        case 4:
            component = document.createElement('only-mobile');
            break;     
        default:
            component = document.createElement('splash-screen');
        }

        this.stepContainer.appendChild(component);
    }

    nextStep() {
        this.step++;
        this.renderStep();
    }

    goToStep(n) {
        this.step = n;
        this.renderStep();
    }

    checkDevice(){
       const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

        return isMobile;
    }

}

customElements.define('root-voting', Root);