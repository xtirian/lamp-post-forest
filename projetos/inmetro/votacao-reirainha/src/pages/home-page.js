import UUID from '../functions/generateUUID.js';
import LocalStorage from '../functions/localstorage.js';

class HomePage extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});       
        this.step = 0; 
        
        this.geradorSecao = new UUID();
        this.localStorage = new LocalStorage('secao');
    }

    connectedCallback() {
        const style = `<style>
            .home {
                animation: open 2s ease-out;
            }
            .container{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height:calc(100vh - 175px );
            }                     

            @keyframes open {
                0% {
                    opacity:0;
                }
                100% {
                    opacity:1;
                }
            }
        </style>
        `;

        const template = `
        <div class="home mobile-wrapper">
            <div class="container">
                <custom-button mode='votar' />
            </div>
        </div>
        `;

        this.shadowRoot.innerHTML = style + template;

        this.setButtonAction()
        this.newSesion()
    }

    nextPage(targetPage){
        const root = this.getRootNode().host;
        root.goToStep(parseInt(targetPage));
    }

    newSesion(){
        const secao = this.geradorSecao.generateUUID();
        this.localStorage.iniciarSecao(secao)
        return;
    }

    

    setButtonAction() {
        const btn = this.shadowRoot.querySelector('custom-button');
        if (btn) {
            btn.action = () => this.nextPage(2);
        }
    }
}

customElements.define('home-page', HomePage);