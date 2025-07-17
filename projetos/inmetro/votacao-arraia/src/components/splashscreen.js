class SplashScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const style = `
      <style>
        .splash {
          padding-top: 16%;          
          height: 100vh;
          font-family: 'margem-rounded',sans-serif;
          font-weight: bold;
          font-size: 1.5rem;
          row-gap: 8px;
          animation: pulse 2s ease-out infinite alternate;
        }
        .container{
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .img_splash{
          width: 540px;
        }

        @keyframes pulse {
                0% {
                    opacity:1;
                }
                50% {
                    opacity:0;
                }
                100% {
                    opacity:1;
                }
            }
      </style>
    `;

    const template = `
      <div class="splash mobile-wrapper">
        <div class="container">
          <img class="img_splash" src="./public/images/splash.svg" alt="" />
          <div class="texto">Carregando.</div>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = style + template;

    this.waitForFullLoad().then(() => {
      const textoEl = this.shadowRoot.querySelector('.texto');
      let pontos = ".";

      const intervalo = setInterval(() => {
        pontos += ".";
        if (pontos.length > 3) pontos = ".";
        textoEl.textContent = "Carregando" + pontos;
      }, 500);

      setTimeout(() => {
        this.remove(); 
        clearInterval(intervalo); 
      }, 3000);     
    });
  }

  waitForFullLoad() {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
  }
}

customElements.define('splash-screen', SplashScreen);
