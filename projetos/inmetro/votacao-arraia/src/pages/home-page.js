class HomePage extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});       
        this.step = 0; 
    }

    connectedCallback() {
        const style = `<style>
            .home {
                margin-top:2.5vh;
                animation: open 2s ease-out;
            }
            .container{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            .img_splash{
                height: 33vh;
                margin-bottom:10vh;
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
                <img class="img_splash" src="./public/images/splash.svg" alt="" />

                <custom-button mode='votar' />
            </div>
        </div>
        `;

        this.shadowRoot.innerHTML = style + template;

        this.setButtonAction()
    }

    nextPage(targetPage){
        const root = this.getRootNode().host;
        root.goToStep(parseInt(targetPage));
    }

    setButtonAction() {
        const btn = this.shadowRoot.querySelector('custom-button');
        if (btn) {
            btn.action = () => this.nextPage(2);
        }
    }
}

customElements.define('home-page', HomePage);