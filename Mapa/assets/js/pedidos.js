(function(window){
  var PEDIDOS_KEY = "mapa-pedidos";

  function carregarPedidos(){
    try { return JSON.parse(localStorage.getItem(PEDIDOS_KEY)) || []; } catch(e){ return []; }
  }

  function salvarPedidos(pedidos){
    localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
  }

  function criarPedido(dados){
    var pedidos = carregarPedidos();
    var pedido = {
      id: "#" + Date.now() + "-01",
      data: new Date().toISOString(),
      status: "confirmado",
      email: dados.email,
      cliente: dados.cliente,
      pagamento: dados.pagamento,
      itens: dados.itens,
      total: dados.total
    };
    pedidos.unshift(pedido);
    salvarPedidos(pedidos);
    return pedido;
  }

  function pedidosDoUsuario(email){
    var alvo = (email || "").trim().toLowerCase();
    return carregarPedidos().filter(function(p){ return (p.email || "").toLowerCase() === alvo; });
  }

  function buscarPedido(id){
    var pedidos = carregarPedidos();
    for(var i = 0; i < pedidos.length; i++){
      if(pedidos[i].id === id) return pedidos[i];
    }
    return null;
  }

  window.MapaPedidos = {
    criarPedido: criarPedido,
    pedidosDoUsuario: pedidosDoUsuario,
    buscarPedido: buscarPedido
  };
})(window);
