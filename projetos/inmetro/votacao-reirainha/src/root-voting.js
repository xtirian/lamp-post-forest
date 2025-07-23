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

                .navigation-root{
                    height:100%;
                }
                

                .estrelas{
                    width:110%;
                    top:0;
                    right:0;
                    animation: estrelas 30s ease-in-out infinite alternate;
                    z-index: -1;
                }

                @keyframes estrelas {
                    0% {
                        transform: translateX(-10%);
                    }
                    50% {
                        transform: translateY(10%);
                    }
                    100% {
                        transform: translateX(-5%);
                    }
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

                .reierainha{
                    position:absolute;                    
                    width: 50vw;
                    bottom: 10%;
                    left: 8px;
                    z-index: -9;
                    animation: danca 1s ease-in-out infinite alternate;
                }

                #navigation-root {
                    position: relative;
                    z-index: 10; /* maior que -10 */
                }
                @keyframes danca {
                    0%{
                        transform:rotate(-5deg)
                    }
                    100%{
                        transform: rotate(3deg)
                    }
                }

                .lampadas{
                    position:absolute;
                    top:0;
                    width:100%;
                    height:200px;
                    object-fit: cover;
                }

                .flag{
                    position:absolute;
                    top:16px;
                    width:100%;
                }


            </style>
        `;

        const template = `
        <div class="container">        
            <img class="background_img estrelas" src="./public/images/estrelas.png" alt="nuvem direita"/>
            <img class="background_img flag" src="./public/images/flags.png" alt="lampadas" />
            <img class="background_img lampadas" src="./public/images/lampadas.png" alt="lampadas" />
            <img class="background_img reierainha" src="./public/images/rei_e_rainha.png" alt="nuvem direita"/>
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
            component = document.createElement('votacao-rei');
            break;        
        case 3:
            component = document.createElement('votacao-rainha');
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