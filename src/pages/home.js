/**
 * Web Component <home-view>
 * 
 * This component displays the homepage with the logo and personal introduction.
 * 
 * @customElement
 */
class Home extends HTMLElement {
    /**
     * Constructs the Home component and attaches Shadow DOM.
     */
    constructor(){
        super()
        this.attachShadow({mode: 'open'})    
    }
    /**
     * Called automatically when the element is added to the DOM.
     * Renders the homepage layout with logo and introduction.
     * 
     * @returns {void}
     */
    connectedCallback(){
        const style = `
            <style>
                section {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
                      padding: 1rem;
                      box-sizing: border-box;
                      text-align: center;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    
                    .logo {
                      font-size: 3.5rem;
                      font-weight: 900;
                      margin: 0;
                      display:none
                    }
                    
                    .chamada {
                      font-size: 1.8rem;
                      font-weight: 600;
                      margin: 0.5rem 0 1.5rem 0;
                      display:none
                    }
                    
                    .description {
                      font-size: 1.1rem;
                      font-weight: 400;
                      margin: 0;
                      max-width: 400px;
                      line-height: 1.4;
                      display:none
                    }
                    
                    /* Responsividade */
                    @media (max-width: 768px) {
                      .logo {
                        font-size: 2.8rem;
                      }
                    
                      .chamada {
                        font-size: 1.4rem;
                      }
                    
                      .description {
                        font-size: 1rem;
                        max-width: 300px;
                      }
                    }
                    
                    @media (max-width: 480px) {
                      .logo {
                        font-size: 2.2rem;
                      }
                    
                      .chamada {
                        font-size: 1.2rem;
                      }
                    
                      .description {
                        font-size: 0.9rem;
                        max-width: 250px;
                      }
                    }
                    
                     @keyframes landMark {
                        0%{
                            background-color: #eeeeee;                            
                        }
                     }

            </style>
        `
        
        const template = `
            <section>
                <h1 class="logo"><span class="landmark">x</span>Tirian</h1>
                <h2 class="chamada">Evolução & Excelência.</h2>
                
                <p class="description">Matheus Fernandes Cunha, Desenvolvedor Web e UI Design</p>                
                
            </section>
        `
        
        this.shadowRoot.innerHTML = style + template;
        
    }
}

customElements.define('home-view', Home);