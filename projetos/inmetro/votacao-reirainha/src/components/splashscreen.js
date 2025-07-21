class SplashScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const style = `
      <style>
        .container{
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          height:calc(100vh - 175px );
        }
        .texto{
          color: #ffffff;
          font-size: 48px;
        }
      </style>
    `;

    const template = `
      <div class="splash mobile-wrapper">        
        <div class="container">
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
