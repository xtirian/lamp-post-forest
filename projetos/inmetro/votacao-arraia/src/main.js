import './root-voting.js';
import './components/splashscreen.js';
import './pages/home-page.js';
import './components/button.js';
import './pages/cadastro-page.js';
import './pages/votacao-page.js'
import './firebaseConfig.js';

window.addEventListener('DOMContentLoaded', () => {
  const el = document.createElement('root-voting');
  document.body.appendChild(el);
});
