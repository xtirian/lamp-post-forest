class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const mode = this.getAttribute('mode') || 'votar';

    const style = `
      <style>
        .container {
          display: flex;
        }

        button {
          display:flex;
          justify-content:center;
          align-items:center;
          background-color: #FFE6C2;
          border: 3px solid #422918;
          border-radius: 40px;
          cursor: pointer;
          transition: background 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width:300px;
          height:80px;

          font-family: 'xilosa', sans-serif;
          color: #422918;
          font-size: 48px
        }

        button:active {
          background-color: #422918;
        }
      </style>
    `;

    const votar = `<button id="customBtn" class="votar">VOTAR</button>`;
    const salvar = `<button id="customBtn" class="salvar"><img src="./public/images/salvar.svg" alt="Ícone Votar" /></button>`;

    const template = `
      <div class="container">
        ${mode === 'votar' ? votar : salvar}
      </div>
    `;

    this.shadowRoot.innerHTML = style + template;
  }

  /**
   * @param {() => void} callback
   */
  set action(callback) {
    const btn = this.shadowRoot.querySelector('#customBtn');
    if (!btn || typeof callback !== 'function') return;

    if (this._boundAction) {
      btn.removeEventListener('click', this._boundAction);
    }

    this._boundAction = callback;
    btn.addEventListener('click', this._boundAction);
  }
}

customElements.define('custom-button', CustomButton);
