(function(window, document){
  var btnAbrir = document.getElementById("btn-identificar");
  var overlay = document.getElementById("identificar-overlay");
  var modal = document.getElementById("identificar-modal");
  var fechar = document.getElementById("fechar-identificar");
  var abaEntrar = document.getElementById("aba-entrar");
  var abaCadastrar = document.getElementById("aba-cadastrar");
  var formEntrar = document.getElementById("form-entrar");
  var formCadastrar = document.getElementById("form-cadastrar");
  var msg = document.getElementById("identificar-msg");

  if(!btnAbrir || !overlay || !modal) return;

  function mostrarAba(aba){
    var ehEntrar = aba === "entrar";
    abaEntrar.setAttribute("aria-selected", ehEntrar ? "true" : "false");
    abaCadastrar.setAttribute("aria-selected", ehEntrar ? "false" : "true");
    formEntrar.hidden = !ehEntrar;
    formCadastrar.hidden = ehEntrar;
    msg.style.display = "none";
  }

  function abrir(){
    overlay.hidden = false;
    modal.hidden = false;
    mostrarAba("entrar");
  }

  function fecharModal(){
    overlay.hidden = true;
    modal.hidden = true;
  }

  function exibirMensagem(){
    formEntrar.hidden = true;
    formCadastrar.hidden = true;
    msg.style.display = "block";
  }

  btnAbrir.addEventListener("click", abrir);
  fechar.addEventListener("click", fecharModal);
  overlay.addEventListener("click", fecharModal);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && !modal.hidden) fecharModal();
  });

  abaEntrar.addEventListener("click", function(){ mostrarAba("entrar"); });
  abaCadastrar.addEventListener("click", function(){ mostrarAba("cadastrar"); });

  formEntrar.addEventListener("submit", function(e){ e.preventDefault(); exibirMensagem(); });
  formCadastrar.addEventListener("submit", function(e){ e.preventDefault(); exibirMensagem(); });
})(window, document);
