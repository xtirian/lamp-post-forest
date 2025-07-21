import { database } from '../firebaseConfig.js'; 
import { ref, push, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import LocalStorage from '../functions/localstorage.js'

class VotacaoPage extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});       
        this.step = 3; 
        this.localStorage = new LocalStorage('secao')
        this.secao = this.localStorage.getSecao();
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
            }

            .img_splash{
                width: 200px;
                margin-bottom:5vh;
            }      

            .votacao-container {
                display: flex;
                flex-wrap:wrap;
                gap: 1rem;
                justify-content: center;
                align-items:center;
                width:100%;
            }
                
            .opcao-voto {
                cursor: pointer;
                border-radius: 10px;
                overflow: hidden;
                transition: border 0.2s ease;
                width:47.5%;
                position: relative;
            }
            .opcao-voto img {
                width: 100%;
                height: 100%;
                min-height:112px;
                display: block;
                object-fit:cover;
                filter: grayscale(80%);
            }

            .opcao-voto span{
                position: absolute;
                bottom:0;
                left:0;
                padding-bottom: 8px;
                padding-left: 8px;
                width:100%;
                font-size: 1.4rem;
                color: white;
                font-weight: bold;
                background-color: #42291855;
            }

            input[type="radio"]:checked + .opcao-voto span{
                color: #FCD9A4;
                background-color: #42291855;
            }
            
            input[type="radio"] {
                display: none;
            }

            input[type="radio"]:checked + .opcao-voto img {
                filter: grayscale(0%);
            }

            @keyframes open {
                0% {
                    opacity:0;
                }
                100% {
                    opacity:1;
                }
            }

            #feedback{
                display: none;
                flex-direction:column;
                align-items: center;
                justify-content:center;  
                width:100%;              
            }

            .spinner {
                border: 8px solid #FFE6C2;
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
        </style>
        `;

        const regioes = [
            {
                regiao: "Sul",
                areas: ["Presi", "Ctinf", "Gabin", "Nuarp", "Cgcom", "SGQI", "Assessoria"],
                img: "./public/images/sul.jpg"
            },
            {
                regiao: "Sudeste",
                areas: ["Diraf", "Dimel"],
                img: "./public/images/sudeste.jpg"
            },
            {
                regiao: "Centro-Oeste",
                areas: ["Dimci", "Coger", "Audin"],
                img: "./public/images/centrooeste.webp"
            },
            {
                regiao: "Nordeste",
                areas: ["Dplan", "Cored", "Caint"],
                img: "./public/images/nordeste.webp"
            },
            {
                regiao: "Norte",
                areas: ["Dconf", "Cgcre"],
                img: "./public/images/norte.jpg"
            }
        ];

        

        const template = `
            <div class="home mobile-wrapper">
                <div class="container">
                    <img class="img_splash" src="./public/images/splash.svg" alt="" />

                    <div class="votacao-container" id="votacao-container">
                        ${regioes
                            .map(v => `
                                <input type="radio" name="voto" id="${v.regiao}" value="${v.regiao}" />
                                <label for="${v.regiao}" class="opcao-voto" >
                                    <img src="${v.img}" alt="Opção ${v.regiao}" />
                                    <span>${v.regiao}</span>
                                </label>
                            `).join('')}
                    </div>

                    
                    <div id="feedback" style="margin-top: 20px; gap: 8px;">
                        <div id="spinner" class="spinner"></div>
                        <img id="checkmark" src="./public/images/verifica.png" alt="Sucesso" style="display:none; width:60px; height:60px;" />
                        <span id="feedback-text" style="font-weight:bold; color:#422918;">Enviando...</span>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = style + template;  

        const radios = this.shadowRoot.querySelectorAll('input[name="voto"]');

        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if(confirm(`Seu voto será confirmado para a barraca: ${e.target.value}. Deseja confirmar?
                    `)){
                    this._submitCadastro(e.target.value)
                }
            });
        });


        this.setButtonAction()
    }

    async _verificarSessao(){
        if(!this.localStorage.getSecao()){            
            this.nextPage(1)
        }

        const votacaoSnap = await get(child(ref(database), 'votacao-barraca'));

        if(!votacaoSnap.exists()) return false;

        const votos = votacaoSnap.val();

        for (const key in votos) {
            if(Object.hasOwnProperty.call(votos, key)) {
                const voto = votos[key];
                if(voto.key && voto.key === this.secao.key){
                    if(confirm(`Você já votou. Deseja votar novamente?`)){
                        this.localStorage.limparCadastro();
                        this.nextPage(2);
                    } else{
                        this.nextPage(1);
                    }
                }
            }
        }
    }

    async _submitCadastro(voto) {
        const votacaoContainer = this.shadowRoot.getElementById('votacao-container');
        const feedbackContainer = this.shadowRoot.getElementById('feedback');
        const spinner = this.shadowRoot.getElementById('spinner');
        const checkmark = this.shadowRoot.getElementById('checkmark');
        const feedbackText = this.shadowRoot.getElementById('feedback-text');

        try {
            votacaoContainer.style.display= 'none';
            feedbackContainer.style.display= 'flex';
            spinner.style.display = 'block';
            checkmark.style.display = 'none';
            feedbackText.textContent = 'Enviando...';

            const votacaoSnap = await get(child(ref(database), 'votacao-barraca'));

            const votos = votacaoSnap.val();

            for (const key in votos) {
                if(Object.hasOwnProperty.call(votos, key)) {
                    const voto = votos[key];
                    if(voto.key && voto.key === this.secao.key){
                        alert("Este usuário já votou.")
                        return { success: false, message: "Este usuário já votou"};
                    }
                }
            }

            const novoCadastro = {
                criadoEm: Date.now(),
                key: this.secao.key,
                voto,
            };

            const cadastroRef = ref(database, 'votacao-barraca');

            await push(cadastroRef, novoCadastro);

            spinner.style.display = 'none';
            checkmark.style.display = 'block';
            feedbackText.textContent = 'Voto salvo com sucesso!';

            return { success: true, message: "Cadastro realizado com sucesso." };
        } catch (error) {
            spinner.style.display = 'none';
            checkmark.style.display = 'none';
            feedbackText.textContent = 'Erro ao realizar cadastro.';
            console.error("Erro ao submeter cadastro:", error);
            return { success: false, message: "Erro ao realizar cadastro." };
        }
    }

    setButtonAction() {
        const btn = this.shadowRoot.querySelector('custom-button');
        if (btn) {
            btn.action = () => this._submitCadastro();
        }
    }

    nextPage(targetPage){
        const root = this.getRootNode().host;
        root.goToStep(parseInt(targetPage));
    }

    
}

customElements.define('votacao-page', VotacaoPage);