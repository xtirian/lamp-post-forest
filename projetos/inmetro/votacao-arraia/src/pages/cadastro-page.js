import { database } from '../firebaseConfig.js'; 
import { ref, push, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import LocalStorage from '../functions/localstorage.js'


class CadastroPage extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});       
        this.step = 2; 
        this.localStorage = new LocalStorage('cadastro')
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
                width: 540px;
                margin-bottom:5vh;
            }      
                
            input, select {
                height: 52px;
                width: 100%;
                font-size: 24px;
                padding: 0 12px;
                border: 3px solid #422918;
                border-radius: 40px;
                box-sizing: border-box;
                font-family: 'margem-rounded', sans-serif;
                outline: none;
                transition: border-color 0.3s ease;
                background-color: #FFE6C2;
                cursor: pointer;
                text-align: center;
                color: #422918;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 18px
            }
            input:focus, select:focus {
                border-color: #796342;
                background-color: #fff8dc;
            }
            input::placeholder {
                font-weight:bold;
                color: #422918;
                opacity: 1;
                text-transform: uppercase;
                text-align: center;
            }

            select option[disabled] {
                color: #422918;
                opacity: 1;
                font-weight: bold;
                text-transform: uppercase;
                text-align: center;
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

         const areasValidas = [
            "Presi", "Ctinf", "Gabin", "Nuarp", "Cgcom", "SGQI", "Assessoria",
            "Diraf", "Dimel", "Ouvid", "Profe",
            "Dimci", "Coger", "Audin",
            "Dplan", "Cored", "Caint",
            "Dconf", "Cgcre"
            ];

        const template = `
        <div class="home mobile-wrapper">
            <div class="container">
                <img class="img_splash" src="./public/images/splash.svg" alt="" />
                
                    <input type="email" placeholder="E-mail" id="email-input" />              
                    <select id="up-input">
                        <option value="" disabled selected>Área / UP</option>
                        ${areasValidas.map(area => `<option value="${area.toLowerCase()}">${area}</option>`).join('')}
                        <option value="outra" disabled>Outra Área não listada</option>
                    </select>

                <custom-button mode='salvar' />
                
            </div>
        </div>
        `;

        this.shadowRoot.innerHTML = style + template;  

        this.setButtonAction()
    }

    _verificarSessao(){
        if(this.localStorage.existeCadastro()){            
            this.nextPage(3)
        }
    }

    async _verificarCadastro(email){
        try {
            const cadastroSnap = await get(child(ref(database), 'cadastro'));
            if (!cadastroSnap.exists()) return false;

            const cadastros = cadastroSnap.val();            
            for (const key in cadastros) {
                if (Object.hasOwnProperty.call(cadastros, key)) {
                    const cadastro = cadastros[key];
                    if (cadastro.email && cadastro.email.toLowerCase() === email.toLowerCase()) {
                        return true;                         
                    }
                }
            }
            return false;
        } catch (error) {
            console.error("Erro ao verificar cadastro:", error);
            return false;
        }
    }

    async _submitCadastro() {
        try {
            const email = this.shadowRoot.getElementById('email-input').value;
            const area = this.shadowRoot.getElementById('up-input').value;

            const regex = /^[a-zA-Z0-9._%+-]+@(colaborador\.)?inmetro\.gov\.br$/i;

            if(!regex.test(email)){                
                alert(`Use um e-mail institucional do Inmetro`)
                return { success: false, message: "Email já cadastrado." };
            }

            const jaCadastrado = await this._verificarCadastro(email);
            if (jaCadastrado) {
                console.warn("Email já cadastrado:", email);
                return { success: false, message: "Email já cadastrado." };
            }

            const novoCadastro = {
                criadoEm: Date.now(),
                email: email,
                area: area,
            };

            const cadastroRef = ref(database, 'cadastro');

            await push(cadastroRef, novoCadastro);

            this.localStorage.cadastrar(email, area);

            return { success: true, message: "Cadastro realizado com sucesso." };
        } catch (error) {
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

customElements.define('cadastro-page', CadastroPage);