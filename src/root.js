/**
 * Root is the main custom element that initializes the application shell
 * and sets the base theme.
 * 
 * @customElement
 */
 
class Root extends HTMLElement{
    /**
     * Constructs the Root component and attaches Shadow DOM.
     * Sets the default theme to 'light'.
     */
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        /**
         * The current theme applied to the component.
         * verify if it's dark.
         * @type {boolean}
         */
        this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        /**
         * The current view that are shown in the screen.
         * define the actual view.
         * @type {number}
         */
        this.navigation = 0
    }
    
    /**
     * Called automatically when the element is added to the DOM.
     * Responsible for rendering the root layout and setting up navigation.
     * 
     * @returns {void}
     */
    connectedCallback(){
        
        const style = `
            <style>
                .main-root{
                    background-color: ${this.isDark ? '#101010':'fefefe'};
                    height: 100vh;
                }
            </style>
        `
        const template = `
            <main class="main-root">
                <div id="navigation-control">
                    <!-- Dont use this part -->
                </div>            
            </main>
        `
        
        this.shadowRoot.innerHTML = style + template
        
        this.navigationContainer = this.shadowRoot.getElementById('navigation-control');
        this.navigateControl()
    }
    
    /**
     * Handles dynamic rendering of the navigation target
     * based on the current navigation index.
     * 
     * @returns {void}
     */
    navigateControl() {
        this.navigationContainer.innerHTML = '';
        let component;
        switch (this.navigation) {
        case 0:
            component = document.createElement('home-view');            
            break;        
        default:
            component = document.createElement('home-view');
        }

        this.navigationContainer.appendChild(component);
    }
    
    /**
     * Updates the current navigation index and triggers re-render.
     * 
     * @param {number} n - The index of the navigation target (e.g. 0 = Home).
     * @returns {void}
     */
    navigateTo(n) {
        this.navigation = n;
        this.navigateControl();
    }

}

customElements.define('root-element', Root)