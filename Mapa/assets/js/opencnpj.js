(function(window, document){
  function normalizarCnpj(valor){
    return (valor || "").replace(/[^0-9A-Za-z]/g, "");
  }

  function setValor(id, valor){
    var el = document.getElementById(id);
    if(el && valor) el.value = valor;
  }

  function buscarEmpresa(cnpj, aoEncontrar, aoFalhar){
    var limpo = normalizarCnpj(cnpj);
    if(limpo.length !== 14){ if(aoFalhar) aoFalhar(); return; }
    fetch("https://api.opencnpj.org/" + limpo)
      .then(function(resposta){
        if(!resposta.ok) throw new Error("not found");
        return resposta.json();
      })
      .then(function(dados){ aoEncontrar(dados); })
      .catch(function(){ if(aoFalhar) aoFalhar(); });
  }

  function ligarAutopreenchimento(config){
    var campoCnpj = document.getElementById(config.cnpj);
    if(!campoCnpj) return;

    function buscar(){
      buscarEmpresa(campoCnpj.value, function(dados){
        if(config.razaoSocial) setValor(config.razaoSocial, dados.razao_social);
        if(config.endereco){
          var linha = ((dados.tipo_logradouro || "") + " " + (dados.logradouro || "")).trim();
          setValor(config.endereco, linha);
        }
        if(config.numero) setValor(config.numero, dados.numero);
        if(config.complemento) setValor(config.complemento, dados.complemento);
        if(config.bairro) setValor(config.bairro, dados.bairro);
        if(config.cidade) setValor(config.cidade, dados.municipio);
        if(config.estado) setValor(config.estado, dados.uf);
        if(config.cep) setValor(config.cep, dados.cep);
        if(config.telefone && dados.telefones && dados.telefones[0]){
          setValor(config.telefone, dados.telefones[0].ddd + dados.telefones[0].numero);
        }
      });
    }

    campoCnpj.addEventListener("input", function(){
      if(normalizarCnpj(campoCnpj.value).length === 14) buscar();
    });
    campoCnpj.addEventListener("blur", buscar);
  }

  window.MapaOpenCnpj = {
    buscarEmpresa: buscarEmpresa,
    ligarAutopreenchimento: ligarAutopreenchimento
  };
})(window, document);
