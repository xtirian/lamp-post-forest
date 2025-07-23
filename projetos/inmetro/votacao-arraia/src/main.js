import './root-voting.js';
import './components/splashscreen.js';
import './pages/home-page.js';
import './components/button.js';
import './pages/cadastro-page.js';
import './pages/votacao-page.js'
import './firebaseConfig.js';
import './pages/only-mobile.js';
import './components/modal.js';

import LocalStorage from './functions/localstorage.js';


const localStorage = new LocalStorage('secao').getSecao();

if (localStorage && (localStorage.votou ?? false)) {
  window.addEventListener('DOMContentLoaded', async () => {
    const modal = document.createElement('confirm-modal');
    modal.setAttribute('message', 'Você já votou. Deseja votar novamente na Barraca Mais Bonita ou no Rei e Rainha?');
    modal.setAttribute('yes-text', 'Barraca');
    modal.setAttribute('no-text', 'Rei e Rainha');

    const resposta = await modal.show();

    if (resposta) {
      // Votar novamente na barraca
      const el = document.createElement('root-voting');
      document.body.appendChild(el);
    } else {
      // Redirecionar para Rei e Rainha
      window.location.href = window.location.href.replace('votacao-arraia', 'votacao-reirainha');
    }
  });
} else {
  window.addEventListener('DOMContentLoaded', () => {
    const el = document.createElement('root-voting');
    document.body.appendChild(el);
  });
}



