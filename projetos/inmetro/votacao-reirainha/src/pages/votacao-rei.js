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

            .img_splash{
                width: 200px;
                margin-bottom:5vh;
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
            }

            .opcao-voto span{
                bottom:0;
                left:0;
                padding-bottom: 8px;
                padding-left: 8px;
                width:100%;
                font-size: 1.4rem;
                color: white;
                font-weight: bold;
                font-family: 'xilosa';
                text-align:center;
            }
             .opcao-voto .chapeu{
                transform: rotate(45deg);
                width: 80%; 
                object-fit: contain;
                top: -40px;  
                right: -20px;
                z-index:9999999999;
                position:absolute;
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
                color: #FFFFFF         
            }

            .spinner {
                border: 8px solid #FFFFFF;
                border-top: 8px solid #422918;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s ease-out infinite;
            }

            #btn-confirmar-voto{
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
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            #avaliacao-container label {
                color: #ffffff;
                font-size: 1.4rem;
            }
        </style>
        `;

        const reis = [
            {
                nome: "Leandro",
                area: "Gabin",
                img: "./public/candidatos/Leandro.jpeg"
            },
            {
                nome: "Matheus",
                area: "Cgcom",
                img: "./public/candidatos/Matheus.jpeg"
            },
            {
                nome: "Renato",
                area: "Dconf",
                img: "./public/candidatos/Renato.jpeg"
            },    
            {
                nome: "Francis",
                area: "Dplan",
                img: "./public/candidatos/Francis.png"
            },         
        ];

        

        const template = `
            <div class="home mobile-wrapper">
                <div class="container">

                    <div class="votacao-container" id="votacao-container">
                        ${reis
                            .map(v => `
                                <input type="radio" name="voto" id="${v.nome}" value="${v.nome}" />
                                <label for="${v.nome}" class="opcao-voto" >
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
                    
                    <div id="feedback" style="margin-top: 20px; gap: 8px;">
                        <div id="spinner" class="spinner"></div>
                        <img id="checkmark" src="./public/images/verifica.png" alt="Sucesso" style="display:none; width:60px; height:60px;" />
                        <span id="feedback-text" style="font-weight:bold; color:#FFFFFF;">Enviando...</span>
                    </div>

                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = style + template;  

        const radios = this.shadowRoot.querySelectorAll('input[name="voto"]');

        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.votoEscolhido = e.target.value;

                // esconde o container de votação
                this.shadowRoot.querySelector('#votacao-container').style.display = 'none';

                // mostra o container de avaliação
                this.shadowRoot.querySelector('#avaliacao-container').style.display = 'flex';
            });

        });

        this.shadowRoot.querySelector('#btn-confirmar-voto').addEventListener('click', () => {
            const criterios = ['simpatia', 'traje', 'animacao', 'participacao', 'colaboracao'];
            const valores = {};

            criterios.forEach(c => {
                const input = this.shadowRoot.querySelector(`input[name="${c}"]`);
                valores[c] = parseInt(input.value);
            });

            // envia voto e critérios
            this._submitVoto(this.votoEscolhido, valores);
        });



        this.setButtonAction()
    }

    async _verificarSessao(){
        if(!this.localStorage.getSecao()){            
            this.nextPage(1)
        }

        const votacaoSnap = await get(child(ref(database), 'rei'));

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

    async _submitVoto(voto, criterios) {
        try {
            const votacaoSnap = await get(child(ref(database), 'rei'));

            const votos = votacaoSnap.val();

            for (const key in votos) {
                if (Object.hasOwnProperty.call(votos, key)) {
                    const votoExistente = votos[key];
                    if (this.secao.rei) {
                        this.nextPage(3);
                        return { success: false, message: "Este usuário já votou" };
                    }
                }
            }

            const novoCadastro = {
                criadoEm: Date.now(),
                key: this.secao.key,
                voto,
                criterios // aqui salva os critérios no Firebase
            };

            const cadastroRef = ref(database, 'rei');
            await push(cadastroRef, novoCadastro);

            this.localStorage.computarVotoRei();
            this.nextPage(3);
            return { success: true, message: "Cadastro realizado com sucesso." };
        } catch (error) {
            console.error("Erro ao submeter cadastro:", error);
            return { success: false, message: "Erro ao realizar cadastro." };
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

customElements.define('votacao-rei', VotacaoPage);