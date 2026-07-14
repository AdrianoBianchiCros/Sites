(function(window, document){
  function normalizarCep(valor){
    return (valor || "").replace(/\D/g, "");
  }

  function setValor(id, valor){
    var el = document.getElementById(id);
    if(el && valor) el.value = valor;
  }

  function buscarEndereco(cep, aoEncontrar, aoFalhar){
    var limpo = normalizarCep(cep);
    if(limpo.length !== 8){ if(aoFalhar) aoFalhar(); return; }
    fetch("https://viacep.com.br/ws/" + limpo + "/json/")
      .then(function(resposta){ return resposta.json(); })
      .then(function(dados){
        if(dados.erro){ if(aoFalhar) aoFalhar(); return; }
        aoEncontrar(dados);
      })
      .catch(function(){ if(aoFalhar) aoFalhar(); });
  }

  function ligarAutopreenchimento(config){
    var campoCep = document.getElementById(config.cep);
    if(!campoCep) return;

    function buscar(){
      buscarEndereco(campoCep.value, function(dados){
        if(config.endereco) setValor(config.endereco, dados.logradouro);
        if(config.complemento) setValor(config.complemento, dados.complemento);
        if(config.bairro) setValor(config.bairro, dados.bairro);
        if(config.cidade) setValor(config.cidade, dados.localidade);
        if(config.estado) setValor(config.estado, dados.uf);
        var proximoCampo = config.numero || config.endereco;
        if(proximoCampo){
          var el = document.getElementById(proximoCampo);
          if(el) el.focus();
        }
      });
    }

    campoCep.addEventListener("input", function(){
      if(normalizarCep(campoCep.value).length === 8) buscar();
    });
    campoCep.addEventListener("blur", buscar);
  }

  window.MapaViaCep = {
    buscarEndereco: buscarEndereco,
    ligarAutopreenchimento: ligarAutopreenchimento
  };
})(window, document);
