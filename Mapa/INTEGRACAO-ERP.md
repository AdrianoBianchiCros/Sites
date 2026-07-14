# Integração com ERP — roteiro

Hoje o site é 100% estático: catálogo fixo no HTML, contas/carrinho/pedidos
guardados só no `localStorage` do navegador, e o "fechamento" da compra é
manual, pelo WhatsApp. Para integrar de verdade com um ERP (Bling, Tiny,
Omie, ContaAzul, Sankhya, TOTVS, SAP Business One, etc.) é preciso resolver
um problema de arquitetura antes de qualquer coisa: **GitHub Pages só serve
arquivos estáticos, e nenhum ERP deve ser chamado direto do navegador.**

## Por que precisa de um backend no meio

Toda API de ERP exige autenticação (API key, OAuth, certificado). Se essa
chamada for feita direto do JavaScript do site:

- a chave de acesso fica visível pra qualquer visitante (F12 → Network);
- a maioria dos ERPs bloqueia CORS pra chamadas vindas do navegador;
- não dá pra confiar em preço/estoque/pedido calculado no cliente — qualquer
  pessoa pode alterar o JS local antes de enviar.

Ou seja: o primeiro passo da integração **não é** trocar uma função JS por
outra — é colocar um servidor no meio, que fala com o ERP usando a chave
guardada em segredo, e o site passa a falar só com esse servidor.

```
[ navegador (index.html) ]  →  [ backend próprio (novo) ]  →  [ API do ERP ]
```

Esse backend pode ser bem enxuto: algumas rotas HTTP (Node/Express,
PHP, Python/FastAPI, ou até funções serverless — Vercel/Netlify/Cloudflare
Workers). Não precisa reescrever o site inteiro, só criar essa camada e ir
trocando cada pedaço simulado por uma chamada real.

## Passo a passo sugerido

### 1. Levantamento com o ERP escolhido
- Confirmar qual ERP a madeireira usa (ou vai usar) e se ele tem API REST
  documentada — a maioria dos ERPs brasileiros pequenos/médios tem
  (Bling, Tiny e Omie são os mais comuns pra esse porte de negócio).
- Levantar: autenticação (API key fixa vs. OAuth com token que expira),
  limites de requisição (rate limit), e quais módulos a API cobre:
  produtos/estoque, clientes, pedidos de venda, contas a receber.

### 2. Criar o backend intermediário
- Hospedar em algum lugar que rode servidor (Render, Railway, Fly.io, VPS
  simples, ou funções serverless) — GitHub Pages não serve pra isso.
- Guardar a credencial do ERP em variável de ambiente, nunca no código.
- Expor rotas próprias e simples pro site consumir, por exemplo:
  `GET /api/produtos`, `POST /api/pedidos`, `POST /api/clientes`.

### 3. Sincronizar o catálogo (maior ganho, mais simples de começar)
- Trocar os arrays `PRODUTOS`/`CATEGORIAS` fixos no `index.html` por uma
  chamada `fetch("/api/produtos")` que o backend responde consultando o ERP
  (com cache de alguns minutos pra não estourar limite de requisições).
- Mapear os campos do ERP pro formato que o site já usa: `sku`, `nome`,
  `imagem`, `preco.valor`, `estoque` ("disponivel"/"indisponivel" a partir
  da quantidade em estoque do ERP).
- Decidir a frequência de sincronização: sob demanda (a cada carregamento de
  página, com cache curto) ou um job periódico que atualiza um "instantâneo"
  do catálogo a cada X minutos — mais simples e mais rápido pro visitante.

### 4. Contas de cliente
- Hoje o cadastro/login é só `localStorage`, sem senha segura de verdade.
  Isso precisa virar backend com banco de dados real (Postgres/MySQL/SQLite)
  e senha com hash (bcrypt/argon2), não texto puro.
- Opcional, mas recomendado: ao criar/editar conta, sincronizar (ou pelo
  menos verificar duplicidade por CPF/CNPJ) com o cadastro de clientes do
  ERP, pra não ter cliente duplicado entre site e loja física.

### 5. Pedidos
- Ao clicar em "Finalizar compra", em vez de só salvar no `localStorage` e
  abrir o WhatsApp, o site chama `POST /api/pedidos` no backend.
- O backend grava o pedido no seu próprio banco (fonte da verdade) **e**
  cria o pedido de venda correspondente no ERP via API.
- O WhatsApp pode continuar existindo como confirmação humana — só deixa de
  ser o único registro do pedido.

### 6. Status do pedido em tempo real
- Hoje a barra de "Status do pedido" na tela de detalhe só mostra "Pedido
  confirmado" fixo, porque não há como saber o resto.
- Com o ERP integrado, o backend pode consultar (ou receber via webhook, se
  o ERP suportar) as mudanças de status — pagamento aprovado, separado,
  pronto pra retirada — e o site passa a refletir o status real.

### 7. Pagamento de verdade
- Pix/Cartão/NuPay/Google Pay no checkout hoje são só visuais. Pra virar
  pagamento real é preciso um gateway (Mercado Pago, PagSeguro, Efí/
  Gerencianet, Asaas — os brasileiros mais comuns, vários já com integração
  pronta com Bling/Tiny/Omie).
- O fluxo típico: o backend cria a cobrança no gateway, o site mostra o QR
  Pix (ou redireciona pro checkout do gateway), e um webhook do gateway avisa
  o backend quando o pagamento é confirmado — aí sim o pedido muda de
  status e é liberado no ERP.

### 8. Segurança e produção
- HTTPS obrigatório em todas as chamadas (site já está em `https://`).
- Nunca expor a chave/token do ERP ou do gateway de pagamento no código do
  site — sempre variável de ambiente do backend.
- Rate limiting e validação de entrada nas rotas do backend (não confiar em
  nada que vier do navegador sem checar).

## De simulado pra real — tabela resumo

| Hoje (localStorage)                              | Depois da integração                              |
|----------------------------------------------------|------------------------------------------------------|
| `PRODUTOS`/`CATEGORIAS` fixos no HTML               | `GET /api/produtos` → backend → API do ERP            |
| `mapa-usuarios` no navegador                        | Banco de dados do backend (+ opcional: cadastro no ERP) |
| `mapa-carrinho` no navegador                        | Pode continuar local até o checkout (ok manter)       |
| `mapa-pedidos` no navegador                         | Banco de dados do backend + pedido de venda no ERP    |
| Estoque fixo (`estoque:"indisponivel"` no código)   | Quantidade real vinda do ERP                          |
| Checkout termina no WhatsApp                        | WhatsApp vira confirmação; pagamento via gateway real |
| Status do pedido sempre "confirmado"                | Sincronizado com o status real do ERP                 |

## Como migrar sem parar o site

Dá pra fazer por fases, sem reescrever tudo de uma vez — cada uma já entrega
valor sozinha:

1. Backend só pra catálogo (produtos/estoque reais) — maior impacto, menor
   risco, não mexe em conta/pedido.
2. Backend de contas com banco real (tira a senha em texto puro do
   navegador).
3. Pedidos gravados no backend + enviados ao ERP.
4. Pagamento real via gateway.
5. Status do pedido sincronizado de volta.
