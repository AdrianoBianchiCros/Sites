# Madeireira Mapa — Site

Site institucional e catálogo da Madeireira Mapa. É uma página estática (sem
build, sem framework) hospedada no GitHub Pages, com todo o catálogo,
carrinho, conta de cliente e pedidos simulados no navegador via
`localStorage` — não existe backend nem banco de dados reais hoje.

O fechamento de pedido (compra) termina sempre no WhatsApp: o site monta a
mensagem com os itens e valores e abre a conversa com a loja.

## Estrutura de arquivos

```
index.html                    HTML, CSS e a maior parte da lógica (catálogo,
                               carrinho, checkout, lista de desejos, pedidos)
assets/js/lojas.js             Cadastro das lojas/unidades e dados de contato
                               (telefone, WhatsApp, endereço, horário)
assets/js/status-loja.js       Calcula se a loja selecionada está aberta agora
assets/js/contas.js            Cadastro/login/logout de clientes (localStorage)
assets/js/identificar.js       UI do modal de login/cadastro/"Meus dados"
assets/js/pedidos.js           Histórico de pedidos do cliente (localStorage)
assets/js/viacep.js            Autopreenchimento de endereço via CEP (ViaCEP)
assets/js/opencnpj.js          Autopreenchimento de dados de empresa via CNPJ
                               (OpenCNPJ)
```

Não há processo de build: edita o HTML/JS e recarrega a página.

## Como rodar localmente

Basta abrir o `index.html` direto no navegador, ou servir a pasta com
qualquer servidor estático (recomendado, evita restrições de `file://`):

```bash
python -m http.server 8000
# depois abrir http://localhost:8000/index.html
```

## Publicação

O site é publicado via GitHub Pages a partir do branch `main`
(`https://adrianobianchicros.github.io/Sites/Mapa/index.html`). Basta commitar
e dar `git push` — o Pages atualiza sozinho em 1–2 minutos.

## Funcionalidades

- **Catálogo**: categorias com carrossel/grade de produtos, busca por termo,
  código (SKU) por produto, status de **Estoque: Disponível/Indisponível**.
- **Produto indisponível**: mostra aviso "Avise-me quando disponível" (modal
  coleta nome/e-mail) e, se o cliente estiver logado, adiciona o produto à
  lista de desejos automaticamente.
- **Lista de desejos**: vinculada à conta do cliente (não é global do
  navegador). Item indisponível pede confirmação antes de remover.
- **Carrinho**: adicionar/remover/alterar quantidade, calcula total.
- **Conta do cliente**: cadastro (Pessoa Física/Jurídica), login, "Meus
  dados" (editar cadastro), troca de senha, autopreenchimento por CEP
  (ViaCEP) e CNPJ (OpenCNPJ).
- **Checkout**: barra de progresso (Sacola → Pagamento → Confirmação),
  escolha de forma de pagamento (Pix/NuPay/Cartão/Google Pay — apenas
  visual), endereço de entrega editável, finalização abre o WhatsApp com o
  pedido pronto.
- **Meus pedidos**: histórico por cliente, com detalhe do pedido (endereço,
  pagamento, itens) e "Pedir novamente".

## Onde os dados ficam guardados (localStorage)

| Chave                  | Conteúdo                                                   |
|-------------------------|--------------------------------------------------------------|
| `mapa-usuarios`         | Array com todas as contas cadastradas (dados + senha em texto puro — ver limitações) |
| `mapa-usuario-logado`   | E-mail do cliente logado no momento                          |
| `mapa-carrinho`         | Itens do carrinho atual                                      |
| `mapa-pedidos`          | Histórico de pedidos de todos os clientes daquele navegador  |
| `mapa-loja-selecionada` | Loja/unidade escolhida no seletor do topo                    |

A lista de desejos **não** tem chave própria: fica dentro do registro do
cliente em `mapa-usuarios` (campo `desejos`).

O catálogo (`PRODUTOS`/`CATEGORIAS`) está hardcoded dentro do `<script>` do
`index.html` — não vem de nenhuma API.

## Limitações atuais (importante)

Como não existe backend, isso é um **protótipo funcional**, não um e-commerce
de produção:

- Senhas ficam em texto puro no `localStorage` do navegador do cliente.
- Dados (conta, pedidos, carrinho) são por navegador/dispositivo — não
  sincronizam entre aparelhos, e um "limpar dados do site" apaga tudo.
- Não existe gateway de pagamento real: Pix/Cartão/etc. são só visuais, e o
  pedido só é fechado de fato pelo WhatsApp.
- Estoque e preço são fixos no código — não refletem o estoque real da loja
  em tempo real.
- Não há pedido gravado em nenhum sistema da empresa (ERP, planilha, etc.).

O documento [`INTEGRACAO-ERP.md`](./INTEGRACAO-ERP.md) descreve os passos
para evoluir isso para uma integração real.
