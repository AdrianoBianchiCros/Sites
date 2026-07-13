(function(window, document){
  function estaAberto(loja){
    var agora = new Date();
    var dia = loja.horario.semana[agora.getDay()];
    if(!dia) return false;
    var hora = agora.getHours() + agora.getMinutes() / 60;
    return hora >= dia.abre && hora < dia.fecha;
  }

  function atualizarStatusLoja(){
    var dot = document.getElementById("status-loja-dot");
    var texto = document.getElementById("status-loja-texto");
    if(!dot || !texto || !window.MapaLoja) return;

    var loja = window.MapaLoja.getLojaAtual();
    if(estaAberto(loja)){
      dot.classList.remove("fechado");
      texto.textContent = "Aberto agora";
    } else {
      dot.classList.add("fechado");
      texto.textContent = "Fechado agora";
    }
  }

  window.addEventListener("mapa:loja-alterada", atualizarStatusLoja);

  atualizarStatusLoja();
  setInterval(atualizarStatusLoja, 60000);
})(window, document);
