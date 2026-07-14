(function(window, document){
  var btnAbrir = document.getElementById("btn-identificar");
  var menuConta = document.getElementById("menu-conta");
  var overlay = document.getElementById("identificar-overlay");
  var modal = document.getElementById("identificar-modal");
  var fechar = document.getElementById("fechar-identificar");
  var colunas = document.getElementById("identificar-colunas");
  var cadastroCompleto = document.getElementById("identificar-cadastro-completo");
  var formEntrar = document.getElementById("form-entrar");
  var formCadastrar = document.getElementById("form-cadastrar");
  var formCadastroCompleto = document.getElementById("form-cadastro-completo");
  var linkEsqueciSenha = document.getElementById("link-esqueci-senha");
  var esqueciOverlay = document.getElementById("esqueci-senha-overlay");
  var esqueciModal = document.getElementById("esqueci-senha-modal");
  var fecharEsqueci = document.getElementById("fechar-esqueci-senha");
  var btnFecharEsqueci = document.getElementById("btn-fechar-esqueci-senha");
  var formEsqueci = document.getElementById("form-esqueci-senha");
  var esqueciMsg = document.getElementById("esqueci-senha-msg");
  var ccCancelar = document.getElementById("cc-cancelar");
  var linkNaoSeiCep = document.getElementById("link-nao-sei-cep");
  var radiosTipo = cadastroCompleto ? cadastroCompleto.querySelectorAll("input[name=\"cc-tipo\"]") : [];
  var camposPF = cadastroCompleto ? cadastroCompleto.querySelectorAll(".campo-pf") : [];
  var camposPJ = cadastroCompleto ? cadastroCompleto.querySelectorAll(".campo-pj") : [];
  var linkPolitica = document.getElementById("link-politica-privacidade");
  var politicaOverlay = document.getElementById("politica-overlay");
  var politicaModal = document.getElementById("politica-modal");
  var fecharPolitica = document.getElementById("fechar-politica");

  if(!btnAbrir || !overlay || !modal) return;

  var aoLogarCallback = null;
  var modoEdicaoConta = false;

  function abrir(callback){
    aoLogarCallback = callback || null;
    sairModoEdicao();
    overlay.hidden = false;
    modal.hidden = false;
    modal.classList.remove("identificar-modal--largo");
    colunas.hidden = false;
    if(cadastroCompleto) cadastroCompleto.hidden = true;
  }

  function fecharModal(){
    overlay.hidden = true;
    modal.hidden = true;
  }

  function cancelarIdentificacao(){
    aoLogarCallback = null;
    fecharModal();
  }

  function concluirLogin(){
    var callback = aoLogarCallback;
    aoLogarCallback = null;
    if(callback) callback();
  }

  function abrirCadastroCompleto(){
    sairModoEdicao();
    var email = document.getElementById("cad-email").value;
    document.getElementById("cc-email").value = email;
    document.getElementById("cc-confirmar-email").value = email;
    colunas.hidden = true;
    cadastroCompleto.hidden = false;
    modal.classList.add("identificar-modal--largo");
  }

  function sairModoEdicao(){
    modoEdicaoConta = false;
    document.getElementById("identificar-titulo").textContent = "Identificação";
    document.getElementById("identificar-subtitulo").textContent = "Faça o seu login ou crie uma conta caso ainda não possua cadastro";
    document.getElementById("cc-senha-label").textContent = "Crie uma senha";
    document.getElementById("cc-confirmar-senha-label").textContent = "Confirmar senha";
    document.getElementById("cc-senha").required = true;
    document.getElementById("cc-confirmar-senha").required = true;
    document.getElementById("cc-email").readOnly = false;
    document.getElementById("cc-confirmar-email").readOnly = false;
    document.getElementById("cc-termos-linha").hidden = false;
    document.getElementById("cc-termos").checked = false;
    document.getElementById("cc-termos").required = true;
    document.getElementById("cc-nome").required = true;
    document.getElementById("cc-cpf").required = true;
    document.getElementById("cc-cnpj").required = true;
    document.getElementById("cc-numero").required = true;
    document.getElementById("cc-celular").required = true;
    document.getElementById("cc-cep").required = true;
    document.getElementById("cc-submit-btn").textContent = "Criar conta";
    document.getElementById("cc-sucesso").hidden = true;
  }

  function abrirMeusDados(){
    var usuario = window.MapaContas ? window.MapaContas.usuarioLogado() : null;
    if(!usuario) return;
    modoEdicaoConta = true;

    document.getElementById("identificar-titulo").textContent = "Meus dados";
    document.getElementById("identificar-subtitulo").textContent = "Atualize suas informações de cadastro";
    document.getElementById("cc-senha-label").textContent = "Nova senha (opcional)";
    document.getElementById("cc-confirmar-senha-label").textContent = "Confirmar nova senha";
    document.getElementById("cc-sucesso").hidden = true;

    document.getElementById("cc-email").value = usuario.email || "";
    document.getElementById("cc-confirmar-email").value = usuario.email || "";
    document.getElementById("cc-email").readOnly = true;
    document.getElementById("cc-confirmar-email").readOnly = true;
    document.getElementById("cc-senha").value = "";
    document.getElementById("cc-confirmar-senha").value = "";
    document.getElementById("cc-senha").required = false;
    document.getElementById("cc-confirmar-senha").required = false;
    document.getElementById("cc-nome").required = false;
    document.getElementById("cc-cpf").required = false;
    document.getElementById("cc-cnpj").required = false;
    document.getElementById("cc-numero").required = false;
    document.getElementById("cc-celular").required = false;
    document.getElementById("cc-cep").required = false;
    document.getElementById("cc-nome").value = usuario.nome || "";
    document.getElementById("cc-cpf").value = usuario.cpf || "";
    document.getElementById("cc-cnpj").value = usuario.cnpj || "";
    document.getElementById("cc-razao-social").value = usuario.razaoSocial || "";
    document.getElementById("cc-inscricao-estadual").value = usuario.inscricaoEstadual || "";
    document.getElementById("cc-celular").value = usuario.celular || "";
    document.getElementById("cc-telefone-fixo").value = usuario.telefoneFixo || "";
    document.getElementById("cc-sexo").value = usuario.sexo || "";
    document.getElementById("cc-nascimento").value = usuario.nascimento || "";
    document.getElementById("cc-cep").value = usuario.cep || "";
    document.getElementById("cc-endereco").value = usuario.endereco || "";
    document.getElementById("cc-numero").value = usuario.numero || "";
    document.getElementById("cc-complemento").value = usuario.complemento || "";
    document.getElementById("cc-referencia").value = usuario.referencia || "";
    document.getElementById("cc-bairro").value = usuario.bairro || "";
    document.getElementById("cc-cidade").value = usuario.cidade || "";
    document.getElementById("cc-estado").value = usuario.estado || "";

    for(var i = 0; i < radiosTipo.length; i++){
      radiosTipo[i].checked = (radiosTipo[i].value === (usuario.tipo || "fisica"));
    }
    atualizarTipoCadastro();

    document.getElementById("cc-termos-linha").hidden = false;
    document.getElementById("cc-termos").checked = true;
    document.getElementById("cc-termos").required = true;
    document.getElementById("cc-submit-btn").textContent = "Salvar alterações";

    overlay.hidden = false;
    modal.hidden = false;
    modal.classList.add("identificar-modal--largo");
    colunas.hidden = true;
    cadastroCompleto.hidden = false;
  }

  function voltarParaColunas(){
    cadastroCompleto.hidden = true;
    colunas.hidden = false;
    modal.classList.remove("identificar-modal--largo");
  }

  function toggleMenuConta(e){
    e.stopPropagation();
    var estaAberto = !menuConta.hidden;
    menuConta.hidden = estaAberto;
    btnAbrir.setAttribute("aria-expanded", String(!estaAberto));
  }

  function fecharMenuConta(){
    menuConta.hidden = true;
    btnAbrir.setAttribute("aria-expanded", "false");
  }

  if(menuConta){
    btnAbrir.addEventListener("click", toggleMenuConta);
    document.addEventListener("click", function(e){
      if(!menuConta.hidden && !menuConta.contains(e.target) && e.target !== btnAbrir){
        fecharMenuConta();
      }
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && !menuConta.hidden) fecharMenuConta();
    });

    var itensConta = menuConta.querySelectorAll("[data-abre-conta]");
    for(var i = 0; i < itensConta.length; i++){
      itensConta[i].addEventListener("click", function(e){
        e.preventDefault();
        fecharMenuConta();
        abrir();
      });
    }

    var linkMinhaConta = document.getElementById("menu-minha-conta");
    if(linkMinhaConta){
      linkMinhaConta.addEventListener("click", function(e){
        e.preventDefault();
        fecharMenuConta();
        var usuario = window.MapaContas ? window.MapaContas.usuarioLogado() : null;
        if(usuario){
          abrirMeusDados();
        } else {
          abrir();
        }
      });
    }

    var linkDesejos = document.getElementById("menu-lista-desejos");
    if(linkDesejos){
      linkDesejos.addEventListener("click", function(e){
        e.preventDefault();
        fecharMenuConta();
        if(window.MapaDesejos) window.MapaDesejos.abrir();
      });
    }

    var linkMeusPedidos = document.getElementById("menu-meus-pedidos");
    if(linkMeusPedidos){
      linkMeusPedidos.addEventListener("click", function(e){
        e.preventDefault();
        fecharMenuConta();
        if(window.MapaPedidosUI) window.MapaPedidosUI.abrirLista();
      });
    }

    var linkAlterarSenha = document.getElementById("menu-alterar-senha");
    if(linkAlterarSenha){
      linkAlterarSenha.addEventListener("click", function(e){
        e.preventDefault();
        fecharMenuConta();
        abrirEsqueciSenha();
      });
    }

    var linkSairConta = document.getElementById("menu-sair-conta");
    if(linkSairConta){
      linkSairConta.addEventListener("click", function(e){
        e.preventDefault();
        fecharMenuConta();
        if(window.MapaContas) window.MapaContas.sair();
      });
    }
  } else {
    btnAbrir.addEventListener("click", abrir);
  }

  fechar.addEventListener("click", cancelarIdentificacao);
  overlay.addEventListener("click", cancelarIdentificacao);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && !modal.hidden) cancelarIdentificacao();
  });

  function abrirEsqueciSenha(){
    esqueciOverlay.hidden = false;
    esqueciModal.hidden = false;
    formEsqueci.hidden = false;
    esqueciMsg.style.display = "none";
  }

  function fecharEsqueciSenha(){
    esqueciOverlay.hidden = true;
    esqueciModal.hidden = true;
  }

  if(linkEsqueciSenha && esqueciOverlay && esqueciModal){
    linkEsqueciSenha.addEventListener("click", abrirEsqueciSenha);
    fecharEsqueci.addEventListener("click", fecharEsqueciSenha);
    btnFecharEsqueci.addEventListener("click", fecharEsqueciSenha);
    esqueciOverlay.addEventListener("click", fecharEsqueciSenha);
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && !esqueciModal.hidden) fecharEsqueciSenha();
    });
    formEsqueci.addEventListener("submit", function(e){
      e.preventDefault();
      formEsqueci.hidden = true;
      esqueciMsg.style.display = "block";
    });
  }

  formEntrar.addEventListener("submit", function(e){
    e.preventDefault();
    var erro = document.getElementById("entrar-erro");
    var email = document.getElementById("entrar-email").value;
    var senha = document.getElementById("entrar-senha").value;
    var resultado = window.MapaContas ? window.MapaContas.entrar(email, senha) : { ok:false, erro:"Login indisponível." };
    if(resultado.ok){
      erro.hidden = true;
      fecharModal();
      formEntrar.reset();
      concluirLogin();
    } else {
      erro.textContent = resultado.erro;
      erro.hidden = false;
    }
  });

  if(formCadastrar && cadastroCompleto){
    formCadastrar.addEventListener("submit", function(e){ e.preventDefault(); abrirCadastroCompleto(); });
  }

  if(ccCancelar){
    ccCancelar.addEventListener("click", function(){
      if(modoEdicaoConta){
        cancelarIdentificacao();
      } else {
        voltarParaColunas();
      }
    });
  }

  if(linkNaoSeiCep){
    linkNaoSeiCep.addEventListener("click", function(){
      document.getElementById("cc-endereco").focus();
    });
  }

  if(window.MapaViaCep && cadastroCompleto){
    window.MapaViaCep.ligarAutopreenchimento({
      cep: "cc-cep",
      endereco: "cc-endereco",
      numero: "cc-numero",
      bairro: "cc-bairro",
      cidade: "cc-cidade",
      estado: "cc-estado"
    });
  }

  if(window.MapaOpenCnpj && cadastroCompleto){
    window.MapaOpenCnpj.ligarAutopreenchimento({
      cnpj: "cc-cnpj",
      razaoSocial: "cc-razao-social",
      endereco: "cc-endereco",
      numero: "cc-numero",
      complemento: "cc-complemento",
      bairro: "cc-bairro",
      cidade: "cc-cidade",
      estado: "cc-estado",
      cep: "cc-cep",
      telefone: "cc-telefone-fixo"
    });
  }

  function atualizarTipoCadastro(){
    var juridica = false;
    for(var i = 0; i < radiosTipo.length; i++){
      if(radiosTipo[i].checked && radiosTipo[i].value === "juridica") juridica = true;
    }
    for(i = 0; i < camposPF.length; i++){ camposPF[i].hidden = juridica; }
    for(i = 0; i < camposPJ.length; i++){ camposPJ[i].hidden = !juridica; }
  }

  for(var i = 0; i < radiosTipo.length; i++){
    radiosTipo[i].addEventListener("change", atualizarTipoCadastro);
  }
  atualizarTipoCadastro();

  function valor(id){
    var campo = document.getElementById(id);
    return campo ? campo.value : "";
  }

  if(formCadastroCompleto){
    formCadastroCompleto.addEventListener("submit", function(e){
      e.preventDefault();
      var erro = document.getElementById("cc-erro");
      var email = valor("cc-email");
      var confirmarEmail = valor("cc-confirmar-email");
      var senha = valor("cc-senha");
      var confirmarSenha = valor("cc-confirmar-senha");

      if(email.trim().toLowerCase() !== confirmarEmail.trim().toLowerCase()){
        erro.textContent = "Os e-mails informados não coincidem.";
        erro.hidden = false;
        return;
      }
      if((senha || confirmarSenha) && senha !== confirmarSenha){
        erro.textContent = "As senhas informadas não coincidem.";
        erro.hidden = false;
        return;
      }

      var juridica = false;
      for(var i = 0; i < radiosTipo.length; i++){
        if(radiosTipo[i].checked && radiosTipo[i].value === "juridica") juridica = true;
      }

      var camposComuns = {
        tipo: juridica ? "juridica" : "fisica",
        nome: valor("cc-nome"),
        cpf: valor("cc-cpf"),
        cnpj: valor("cc-cnpj"),
        razaoSocial: valor("cc-razao-social"),
        inscricaoEstadual: valor("cc-inscricao-estadual"),
        celular: valor("cc-celular"),
        telefoneFixo: valor("cc-telefone-fixo"),
        sexo: valor("cc-sexo"),
        nascimento: valor("cc-nascimento"),
        cep: valor("cc-cep"),
        endereco: valor("cc-endereco"),
        numero: valor("cc-numero"),
        complemento: valor("cc-complemento"),
        referencia: valor("cc-referencia"),
        bairro: valor("cc-bairro"),
        cidade: valor("cc-cidade"),
        estado: valor("cc-estado")
      };

      if(modoEdicaoConta){
        if(senha) camposComuns.senha = senha;
        var usuarioAtualizado = window.MapaContas ? window.MapaContas.atualizarUsuario(camposComuns) : null;
        if(usuarioAtualizado){
          erro.hidden = true;
          if(window.MapaContas) window.MapaContas.atualizarHeader();
          var sucesso = document.getElementById("cc-sucesso");
          sucesso.hidden = false;
          setTimeout(function(){
            sucesso.hidden = true;
            fecharModal();
          }, 2000);
        } else {
          erro.textContent = "Não foi possível salvar. Faça login novamente.";
          erro.hidden = false;
        }
        return;
      }

      camposComuns.email = email;
      camposComuns.senha = senha;

      var resultado = window.MapaContas ? window.MapaContas.cadastrar(camposComuns) : { ok:false, erro:"Cadastro indisponível." };
      if(resultado.ok){
        erro.hidden = true;
        fecharModal();
        formCadastroCompleto.reset();
        atualizarTipoCadastro();
        concluirLogin();
      } else {
        erro.textContent = resultado.erro;
        erro.hidden = false;
      }
    });
  }

  if(linkPolitica && politicaOverlay && politicaModal){
    linkPolitica.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      politicaOverlay.hidden = false;
      politicaModal.hidden = false;
    });
    function fecharPoliticaModal(){
      politicaOverlay.hidden = true;
      politicaModal.hidden = true;
    }
    fecharPolitica.addEventListener("click", fecharPoliticaModal);
    politicaOverlay.addEventListener("click", fecharPoliticaModal);
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && !politicaModal.hidden) fecharPoliticaModal();
    });
  }

  var ICONE_OLHO = '<path d="M12 5c-5 0-9.27 3.11-11 7.5C2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>';
  var ICONE_OLHO_RISCADO = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';

  var botoesVerSenha = document.querySelectorAll(".btn-ver-senha");
  for(var iv = 0; iv < botoesVerSenha.length; iv++){
    (function(botao){
      var campo = document.getElementById(botao.getAttribute("data-alvo"));
      if(!campo) return;
      botao.addEventListener("click", function(){
        var visivel = campo.type === "text";
        campo.type = visivel ? "password" : "text";
        botao.setAttribute("aria-pressed", visivel ? "false" : "true");
        botao.setAttribute("aria-label", visivel ? "Mostrar senha" : "Ocultar senha");
        botao.querySelector("svg").innerHTML = visivel ? ICONE_OLHO : ICONE_OLHO_RISCADO;
      });
    })(botoesVerSenha[iv]);
  }

  window.MapaIdentificar = { abrir: abrir };
})(window, document);
