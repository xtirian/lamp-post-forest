class LocalStorage {
  constructor(storageKey = 'cadastro') {
    this.storageKey = storageKey;
  }

  /**
   * Retorna o cadastro atual ou null
   * @returns {{ email: string, area: string } | null}
   */
  getCadastro() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Cadastra um novo email/área se ainda não houver cadastro
   * @param {string} email 
   * @param {string} area 
   * @returns {boolean} true se cadastrado, false se já existia
   */
  cadastrar(email, area) {
    if (this.getCadastro()) {
      return false; // já existe
    }

    const cadastro = {
      email: email.toLowerCase(),
      area
    };

    localStorage.setItem(this.storageKey, JSON.stringify(cadastro));
    return true;
  }

  /**
   * Verifica se já há um cadastro
   * @returns {boolean}
   */
  existeCadastro() {
    return !!this.getCadastro();
  }

  /**
   * Remove o cadastro
   */
  limparCadastro() {
    localStorage.removeItem(this.storageKey);
  }



  getSecao() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
  
  iniciarSecao(key) {
    if (!!this.getSecao().secao) {
      return false; // já existe
    }

    const secao = {key, votou: false}

    localStorage.setItem(this.storageKey, JSON.stringify(secao))
  }

  computarVoto() {
    const secao = this.getSecao()
    const novaSecao = {...secao, votou: true}
    localStorage.setItem(this.storageKey, JSON.stringify(novaSecao))
  }

  
}

export default LocalStorage;