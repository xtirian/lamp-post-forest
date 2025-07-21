import './root-voting.js';
import './components/splashscreen.js';
import './pages/home-page.js';
import './components/button.js';
import './pages/cadastro-page.js';
import './pages/votacao-rei.js'
import './pages/votacao-rainha.js'
import './firebaseConfig.js';
import './pages/only-mobile.js';
import './components/modal.js';

window.addEventListener('DOMContentLoaded', async () => {
  const el = document.createElement('root-voting');
  document.body.appendChild(el);
});