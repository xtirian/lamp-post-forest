import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Substitua abaixo pela sua configuração real do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaDwWOlb3ixUHToQzzZnGg4Yv9FSdXVlU",
  authDomain: "votacao-arraia-inmetro.firebaseapp.com",
  databaseURL: "https://votacao-arraia-inmetro-default-rtdb.firebaseio.com",
  projectId: "votacao-arraia-inmetro",
  storageBucket: "votacao-arraia-inmetro.firebasestorage.app",
  messagingSenderId: "687371666163",
  appId: "1:687371666163:web:153cfde19c1ae587d3ed86",
  measurementId: "G-GEFPP9KXXD"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Exporta o database para usar em outros arquivos
const database = getDatabase(app);

export { database };
