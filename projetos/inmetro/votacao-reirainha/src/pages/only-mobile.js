class OnlyMobile extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback() {
        const template = `
            <style>
                .alert {
                    font-family: sans-serif;
                    padding: 2rem;
                    text-align: center;
                    color: #333;
                }
            </style>
            <div class="alert">
                <h2>Acesso restrito</h2>
                <p>Este site deve ser acessado por um dispositivo móvel.</p>
            </div>
        `;

        this.shadowRoot.innerHTML = template
    }
}

customElements.define('only-mobile',OnlyMobile)
