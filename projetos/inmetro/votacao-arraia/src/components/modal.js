class ConfirmModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const message = this.getAttribute('message') || 'Tem certeza?';
        const yesText = this.getAttribute('yes-text') || 'Sim';
        const noText = this.getAttribute('no-text') || 'Não';

        const style = `
            <style>
                .overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .modal {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    font-family: sans-serif;
                    max-width: 90%;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .modal p {
                    margin-bottom: 1.5rem;
                    color: #333;
                }
                button {
                    margin: 0 0.5rem;
                    padding: 0.5rem 1.2rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .yes-btn {
                    background-color: #2e7d32;
                    color: white;
                }
                .no-btn {
                    background-color: #c62828;
                    color: white;
                }
            </style>
        `;

        const template = `
            <div class="overlay">
                <div class="modal">
                    <p>${message}</p>
                    <button class="yes-btn">${yesText}</button>
                    <button class="no-btn">${noText}</button>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = style + template;

        const yesButton = this.shadowRoot.querySelector('.yes-btn');
        const noButton = this.shadowRoot.querySelector('.no-btn');

        yesButton.addEventListener('click', () => {
            this._resolve(true);
            this.remove();
        });

        noButton.addEventListener('click', () => {
            this._resolve(false);
            this.remove();
        });
    }

    show() {
        return new Promise((resolve) => {
            this._resolve = resolve;
            document.body.appendChild(this);
        });
    }
}

customElements.define('confirm-modal', ConfirmModal);
