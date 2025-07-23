import { database } from '../firebaseConfig.js'; 
import { ref, push, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import LocalStorage from '../functions/localstorage.js'

class VotacaoRainha extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});       
        this.step = 3; 
        this.localStorage = new LocalStorage('secao')
        this.secao = this.localStorage.getSecao();
        this.votoEscolhido = null;
    }

    connectedCallback() {
        this._verificarSessao();

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
                height:calc(100vh - 175px );
            }

            .votacao-container {
                display: flex;
                flex-wrap:wrap;
                gap: 1rem;
                row-gap: 2rem;
                justify-content: center;
                align-items:center;
                width:100%;
            }

            .opcao-voto {
                cursor: pointer;
                overflow: hidden;
                transition: border 0.2s ease;
                width:47.5%;
                position: relative;
                display:flex;
                flex-direction:column;
                align-items:center;
                overflow: visible; 
            }

            .opcao-voto img {
                border-radius: 100%;
                width: 100px;
                height: 100px;
                min-height:112px;
                display: block;
                object-fit:cover;
                object-position: top center;
            }
            
            .opcao-voto .chapeu{
                transform: rotate(-45deg);
                width: 80%; 
                object-fit: contain;
                top: -40px;  
                left: -20px;
                z-index:9999999999;
                position:absolute;
            }

            .opcao-voto span {
                font-size: 1.4rem;
                color: white;
                font-weight: bold;
                font-family: 'xilosa';
                text-align:center;
            }

            input[type="radio"]:checked + .opcao-voto img {
                filter: grayscale(0%);
            }

            input[type="radio"] {
                display: none;
            }

            @keyframes open {
                0% { opacity:0; }
                100% { opacity:1; }
            }

            #avaliacao-container label {
                color: #ffffff;
                font-size: 1.4rem;
            }

            #btn-confirmar-voto {
                background-color: #FFE6C2;
                border: 2px solid #422918;
                color: #422918;
                border-radius: 40px;
                cursor: pointer;
                transition: background 0.3s ease;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                width:300px;
                font-size:1.8rem;
                font-family: 'xilosa';
                margin-top: 1rem;
            }

            #feedback {
                display: none;
                flex-direction:column;
                align-items: center;
                justify-content:center;
                margin-top: 20px;
                gap: 8px;
                color: #FFFFFF;
            }

            .spinner {
                border: 8px solid #FFFFFF;
                border-top: 8px solid #422918;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s ease-out infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>`;

        const rainhas = [
            { nome: "Michelle", area: "Cgcom", img: "./public/candidatos/Michelle.jpeg" },
            { nome: "Beatriz", area: "Dplan", img: "./public/candidatos/Beatriz.jpeg" },
            { nome: "Luzinete", area: "Dconf", img: "./public/candidatos/Luzinete.jpeg" },
            { nome: "Roberta", area: "Dimci", img: "./public/candidatos/Roberta.jpg" }
        ];

        const template = `
            <div class="home mobile-wrapper">
                <div class="container">

                    <div class="votacao-container" id="votacao-container">
                        ${rainhas.map(v => `
                            <input type="radio" name="voto" id="${v.nome}" value="${v.nome}" />
                            <label for="${v.nome}" class="opcao-voto">
                                <img src="${v.img}" alt="Opção ${v.nome}" />
                                <span>${v.nome} - ${v.area}</span>
                                <img src="./public/images/chapeu.png" alt="chapeu" class="chapeu" />
                            </label>
                        `).join('')}
                    </div>

                    <div id="avaliacao-container" style="display:none; flex-direction:column; gap:12px; margin-top: 2rem;">
                        <label>Simpatia: <input type="range" min="1" max="5" value="3" name="simpatia" /></label>
                        <label>Traje: <input type="range" min="1" max="5" value="3" name="traje" /></label>
                        <label>Animação: <input type="range" min="1" max="5" value="3" name="animacao" /></label>
                        <label>Participação: <input type="range" min="1" max="5" value="3" name="participacao" /></label>
                        <label>Colaboração: <input type="range" min="1" max="5" value="3" name="colaboracao" /></label>

                        <button id="btn-confirmar-voto">Confirmar voto</button>
                    </div>

                    <div id="feedback">
                        <div id="spinner" class="spinner"></div>
                        <img id="checkmark" src="./public/images/verifica.png" alt="Sucesso" style="display:none; width:60px; height:60px;" />
                        <span id="feedback-text" style="font-weight:bold;">Enviando...</span>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = style + template;

        const radios = this.shadowRoot.querySelectorAll('input[name="voto"]');

        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.votoEscolhido = e.target.value;

                // Esconde a votação
                this.shadowRoot.getElementById('votacao-container').style.display = 'none';

                // Mostra os sliders
                this.shadowRoot.getElementById('avaliacao-container').style.display = 'flex';
            });
        });

        this.shadowRoot.querySelector('#btn-confirmar-voto').addEventListener('click', () => {
            const criterios = ['simpatia', 'traje', 'animacao', 'participacao', 'colaboracao'];
            const valores = {};

            criterios.forEach(c => {
                const input = this.shadowRoot.querySelector(`input[name="${c}"]`);
                valores[c] = parseInt(input.value);
            });

            this._submitVoto(this.votoEscolhido, valores);
        });

        this.setButtonAction();
    }

    async _verificarSessao(){
        if(!this.localStorage.getSecao()){
            this.nextPage(1);
        }

        const votacaoSnap = await get(child(ref(database), 'rainha'));

        if(!votacaoSnap.exists()) return;

        const votos = votacaoSnap.val();

        for (const key in votos) {
            if(votos[key].key === this.secao.key){
                if(confirm(`Você já votou. Deseja votar novamente?`)){
                    this.localStorage.limparCadastro();
                    this.nextPage(2);
                } else {
                    this.nextPage(1);
                }
            }
        }
    }

    async _submitVoto(voto, criterios) {
        const votacaoContainer = this.shadowRoot.getElementById('votacao-container');
        const avaliacaoContainer = this.shadowRoot.getElementById('avaliacao-container');
        const feedbackContainer = this.shadowRoot.getElementById('feedback');
        const spinner = this.shadowRoot.getElementById('spinner');
        const checkmark = this.shadowRoot.getElementById('checkmark');
        const feedbackText = this.shadowRoot.getElementById('feedback-text');

        try {
            avaliacaoContainer.style.display = 'none';
            feedbackContainer.style.display = 'flex';
            spinner.style.display = 'block';
            checkmark.style.display = 'none';
            feedbackText.textContent = 'Enviando...';

            const votacaoSnap = await get(child(ref(database), 'rainha'));
            const votos = votacaoSnap.val();

            for (const key in votos) {
                if(votos[key].key === this.secao.key){
                    alert("Este usuário já votou.");
                    return;
                }
            }

            const novoCadastro = {
                criadoEm: Date.now(),
                key: this.secao.key,
                voto,
                criterios
            };

            const cadastroRef = ref(database, 'rainha');
            await push(cadastroRef, novoCadastro);

            this.localStorage.computarVotoRainha();

            spinner.style.display = 'none';
            checkmark.style.display = 'block';
            feedbackText.textContent = 'Voto salvo com sucesso!';
        } catch (error) {
            spinner.style.display = 'none';
            checkmark.style.display = 'none';
            feedbackText.textContent = 'Erro ao realizar cadastro.';
            console.error("Erro ao submeter cadastro:", error);
        }
    }

    setButtonAction() {
        const btn = this.shadowRoot.querySelector('custom-button');
        if (btn) {
            btn.action = () => this._submitVoto();
        }
    }

    nextPage(targetPage){
        const root = this.getRootNode().host;
        root.goToStep(parseInt(targetPage));
    }
}

customElements.define('votacao-rainha', VotacaoRainha);
