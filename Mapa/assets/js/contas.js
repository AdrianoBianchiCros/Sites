(function(window, document){
  var USUARIOS_KEY = "mapa-usuarios";
  var SESSAO_KEY = "mapa-usuario-logado";

  function carregarUsuarios(){
    try { return JSON.parse(localStorage.getItem(USUARIOS_KEY)) || []; } catch(e){ return []; }
  }

  function salvarUsuarios(usuarios){
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }

  function encontrarUsuario(email){
    var alvo = (email || "").trim().toLowerCase();
    var usuarios = carregarUsuarios();
    for(var i = 0; i < usuarios.length; i++){
      if(usuarios[i].email.toLowerCase() === alvo) return usuarios[i];
    }
    return null;
  }

  function definirSessao(email){
    try { localStorage.setItem(SESSAO_KEY, email); } catch(e){}
    atualizarHeader();
    window.dispatchEvent(new CustomEvent("mapa:sessao-alterada"));
  }

  function cadastrar(dados){
    if(encontrarUsuario(dados.email)){
      return { ok:false, erro:"Já existe uma conta cadastrada com esse e-mail." };
    }
    var usuarios = carregarUsuarios();
    usuarios.push(dados);
    salvarUsuarios(usuarios);
    definirSessao(dados.email);
    return { ok:true };
  }

  function entrar(email, senha){
    var usuario = encontrarUsuario(email);
    if(!usuario || usuario.senha !== senha){
      return { ok:false, erro:"E-mail ou senha inválidos." };
    }
    definirSessao(usuario.email);
    return { ok:true, usuario:usuario };
  }

  function sair(){
    try { localStorage.removeItem(SESSAO_KEY); } catch(e){}
    atualizarHeader();
    window.dispatchEvent(new CustomEvent("mapa:sessao-alterada"));
  }

  function usuarioLogado(){
    var email;
    try { email = localStorage.getItem(SESSAO_KEY); } catch(e){ email = null; }
    return email ? encontrarUsuario(email) : null;
  }

  function atualizarUsuario(patch){
    var usuario = usuarioLogado();
    if(!usuario) return null;
    var usuarios = carregarUsuarios();
    for(var i = 0; i < usuarios.length; i++){
      if(usuarios[i].email.toLowerCase() === usuario.email.toLowerCase()){
        for(var chave in patch){ usuarios[i][chave] = patch[chave]; }
        salvarUsuarios(usuarios);
        return usuarios[i];
      }
    }
    return null;
  }

  function getDesejos(){
    var usuario = usuarioLogado();
    return (usuario && usuario.desejos) ? usuario.desejos : [];
  }

  function salvarDesejos(lista){
    return atualizarUsuario({ desejos: lista }) !== null;
  }

  function primeiroNome(texto){
    return (texto || "").trim().split(" ")[0];
  }

  function atualizarHeader(){
    var titulo = document.getElementById("conta-titulo");
    var subtitulo = document.getElementById("conta-subtitulo");
    if(!titulo || !subtitulo) return;
    var usuario = usuarioLogado();
    if(usuario){
      titulo.textContent = "Olá, " + primeiroNome(usuario.nome || usuario.email);
      subtitulo.textContent = "Minha conta";
    } else {
      titulo.textContent = "Minha conta";
      subtitulo.textContent = "Acessar agora";
    }
  }

  atualizarHeader();

  window.MapaContas = {
    cadastrar: cadastrar,
    entrar: entrar,
    sair: sair,
    usuarioLogado: usuarioLogado,
    atualizarUsuario: atualizarUsuario,
    getDesejos: getDesejos,
    salvarDesejos: salvarDesejos,
    atualizarHeader: atualizarHeader
  };
})(window, document);
