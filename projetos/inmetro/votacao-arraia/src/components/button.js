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
          border-radius: 100%;
          cursor: pointer;
          transition: background 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width:300px;
          height:80px;
        }

        button:hover {
          background-color: #422918;
        }
      </style>
    `;

    const votar = `<button class="votar"><img src="../assets/images/votar.svg" alt="Ícone Votar" /></button>`;
    const salvar = `<button class="salvar"><img src="../assets/images/salvar.svg" alt="Ícone Votar" /></button>`;

    const template = `
      <div class="container">
        ${mode === 'votar' ? votar : salvar}
      </div>
    `;

    this.shadowRoot.innerHTML = style + template;
  }
}

customElements.define('custom-button', CustomButton);
