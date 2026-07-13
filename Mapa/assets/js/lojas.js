(function(window, document){
  var CHAVE_LOJA = "mapa-loja-selecionada";

  // ---------------------------------------------------------------
  // Cadastro de lojas/CDs. Pra adicionar ou ajustar uma unidade,
  // mexe só aqui — o resto da página se atualiza sozinho via
  // atributos data-loja-*. ENDERECO/LINK_MAPS seguem o mesmo
  // padrão de marcador que o resto do site já usa.
  // ---------------------------------------------------------------
  var LOJAS = [
    {
      id: "braganca-paulista",
      nome: "Bragança Paulista (Matriz)",
      whatsapp: "5511954953570",
      telefoneFixo: "+551140339449",
      telefoneDisplay: "(11) 4033-9449",
      whatsappDisplay: "(11) 95495-3570",
      email: "contato@madeireiramapa.com.br",
      endereco: "ENDERECO — Bragança Paulista/SP",
      linkMaps: "LINK_MAPS",
      horario: {
        texto: "seg a sex 7h–17h · sáb 7h–12h",
        semana: [null, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:12}]
      }
    },
    {
      id: "pinhalzinho",
      nome: "Pinhalzinho",
      whatsapp: "5511954953570",
      telefoneFixo: "+551140339449",
      telefoneDisplay: "(11) 4033-9449",
      whatsappDisplay: "(11) 95495-3570",
      email: "contato@madeireiramapa.com.br",
      endereco: "ENDERECO — Pinhalzinho/SP",
      linkMaps: "LINK_MAPS",
      horario: {
        texto: "seg a sex 7h–17h · sáb 7h–12h",
        semana: [null, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:12}]
      }
    },
    {
      id: "atibaia-1",
      nome: "Atibaia — Unidade 1",
      whatsapp: "5511954953570",
      telefoneFixo: "+551140339449",
      telefoneDisplay: "(11) 4033-9449",
      whatsappDisplay: "(11) 95495-3570",
      email: "contato@madeireiramapa.com.br",
      endereco: "ENDERECO — Atibaia/SP",
      linkMaps: "LINK_MAPS",
      horario: {
        texto: "seg a sex 7h–17h · sáb 7h–12h",
        semana: [null, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:12}]
      }
    },
    {
      id: "atibaia-2",
      nome: "Atibaia — Unidade 2",
      whatsapp: "5511954953570",
      telefoneFixo: "+551140339449",
      telefoneDisplay: "(11) 4033-9449",
      whatsappDisplay: "(11) 95495-3570",
      email: "contato@madeireiramapa.com.br",
      endereco: "ENDERECO — Atibaia/SP",
      linkMaps: "LINK_MAPS",
      horario: {
        texto: "seg a sex 7h–17h · sáb 7h–12h",
        semana: [null, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:12}]
      }
    },
    {
      id: "jaguariuna",
      nome: "Jaguariúna",
      whatsapp: "5511954953570",
      telefoneFixo: "+551140339449",
      telefoneDisplay: "(11) 4033-9449",
      whatsappDisplay: "(11) 95495-3570",
      email: "contato@madeireiramapa.com.br",
      endereco: "ENDERECO — Jaguariúna/SP",
      linkMaps: "LINK_MAPS",
      horario: {
        texto: "seg a sex 7h–17h · sáb 7h–12h",
        semana: [null, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:12}]
      }
    },
    {
      id: "unidade-6",
      nome: "Nova unidade (ajustar nome e cidade)",
      whatsapp: "5511954953570",
      telefoneFixo: "+551140339449",
      telefoneDisplay: "(11) 4033-9449",
      whatsappDisplay: "(11) 95495-3570",
      email: "contato@madeireiramapa.com.br",
      endereco: "ENDERECO — cidade da 6ª unidade",
      linkMaps: "LINK_MAPS",
      horario: {
        texto: "seg a sex 7h–17h · sáb 7h–12h",
        semana: [null, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:17}, {abre:7,fecha:12}]
      }
    }
  ];

  // mensagens-modelo compartilhadas entre lojas (só muda o número de WhatsApp de destino)
  var MENSAGENS = {
    "orcamento": "Olá! Vim pelo site e quero um orçamento.",
    "orcamento-madeira": "Olá! Vim pelo site e quero um orçamento de madeira.",
    "telhado": "Olá! Vou fazer um TELHADO. Pode me passar a lista de material e o orçamento?",
    "deck": "Olá! Quero fazer um DECK. Pode me passar a lista de material e o orçamento?",
    "assoalho": "Olá! Quero instalar ASSOALHO. Pode me passar a lista de material e o orçamento?",
    "cerca": "Olá! Preciso de material para CERCA/PERGOLADO com euclipto tratado. Pode me orçar?",
    "falar-vendedor": "Olá! Quero falar com um vendedor.",
    "confirmar-horario": "Olá! Quero passar na loja. Qual o endereço e o horário?",
    "identificacao": "Olá! Quero me identificar/cadastrar para fazer pedidos."
  };

  var CAMPOS_TEXTO = {
    "endereco": function(l){ return l.endereco; },
    "horario-texto": function(l){ return l.horario.texto; },
    "telefone-display": function(l){ return l.telefoneDisplay; },
    "whatsapp-display": function(l){ return l.whatsappDisplay; },
    "email": function(l){ return l.email; }
  };

  function getLojaAtual(){
    var id = null;
    try { id = localStorage.getItem(CHAVE_LOJA); } catch(e){}
    var encontrada = null;
    for(var i = 0; i < LOJAS.length; i++){
      if(LOJAS[i].id === id){ encontrada = LOJAS[i]; break; }
    }
    return encontrada || LOJAS[0];
  }

  function linkWhatsApp(loja, mensagem){
    var url = "https://api.whatsapp.com/send?phone=" + loja.whatsapp;
    if(mensagem) url += "&text=" + encodeURIComponent(mensagem);
    return url;
  }

  function linkWhatsAppAtual(mensagem){
    return linkWhatsApp(getLojaAtual(), mensagem);
  }

  function aplicarLoja(){
    var loja = getLojaAtual();
    var i;

    var campos = document.querySelectorAll("[data-loja-campo]");
    for(i = 0; i < campos.length; i++){
      var fn = CAMPOS_TEXTO[campos[i].getAttribute("data-loja-campo")];
      if(fn) campos[i].textContent = fn(loja);
    }

    var tels = document.querySelectorAll("[data-loja-tel]");
    for(i = 0; i < tels.length; i++){ tels[i].href = "tel:" + loja.telefoneFixo; }

    var emails = document.querySelectorAll("[data-loja-email]");
    for(i = 0; i < emails.length; i++){ emails[i].href = "mailto:" + loja.email; }

    var maps = document.querySelectorAll("[data-loja-maps]");
    for(i = 0; i < maps.length; i++){ maps[i].href = loja.linkMaps; }

    var planos = document.querySelectorAll("[data-loja-whatsapp-plain]");
    for(i = 0; i < planos.length; i++){ planos[i].href = linkWhatsApp(loja, null); }

    var msgs = document.querySelectorAll("[data-loja-msg]");
    for(i = 0; i < msgs.length; i++){
      var chave = msgs[i].getAttribute("data-loja-msg");
      msgs[i].href = linkWhatsApp(loja, MENSAGENS[chave] || "");
    }

    var seletor = document.getElementById("seletor-loja");
    if(seletor && seletor.value !== loja.id) seletor.value = loja.id;

    if(typeof window.CustomEvent === "function"){
      window.dispatchEvent(new CustomEvent("mapa:loja-alterada", { detail: loja }));
    }
  }

  function selecionarLoja(id){
    try { localStorage.setItem(CHAVE_LOJA, id); } catch(e){}
    aplicarLoja();
  }

  function popularSeletor(){
    var seletor = document.getElementById("seletor-loja");
    if(!seletor) return;
    LOJAS.forEach(function(l){
      var opt = document.createElement("option");
      opt.value = l.id;
      opt.textContent = l.nome;
      seletor.appendChild(opt);
    });
    seletor.value = getLojaAtual().id;
    seletor.addEventListener("change", function(){ selecionarLoja(this.value); });
  }

  popularSeletor();
  aplicarLoja();

  window.MapaLoja = {
    LOJAS: LOJAS,
    getLojaAtual: getLojaAtual,
    linkWhatsApp: linkWhatsApp,
    linkWhatsAppAtual: linkWhatsAppAtual,
    selecionarLoja: selecionarLoja,
    aplicarLoja: aplicarLoja
  };
})(window, document);
