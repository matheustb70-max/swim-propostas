# SWIM — Propostas comerciais

Página estática de propostas do SWIM Estúdio Criativo, com a identidade visual do estúdio, portfólio, processo, escopo, opções de pagamento e revisão antes da assinatura.

Esta versão usa uma cliente fictícia, Aurora, e valores demonstrativos. O modelo pode ser duplicado e personalizado para outros projetos.

## Publicação

O site é publicado pelo GitHub Pages a partir da raiz da branch `main`:

**https://matheustb70-max.github.io/swim-propostas/**

Não é necessário instalar dependências ou executar build. Depois de alterar os arquivos e fazer push na branch `main`, o GitHub Pages publica a atualização.

## Personalizar a proposta

Edite `config.js`. Os principais campos são:

- `client`: nome e identificação do cliente.
- `proposal`: número, serviço, emissão e validade.
- `hero` e `context`: apresentação e objetivo do projeto.
- `process`: etapas e prazo estimado.
- `portfolio.projects`: seleção de projetos, imagens e descrições.
- `scope`: entregas, materiais e itens não incluídos.
- `investment`: valores e condições de pagamento.
- `contract`: política de ajustes e links de assinatura.
- `faq`: perguntas e respostas.
- `brand`: site e WhatsApp da Swim.

Os ajustes são ilimitados em número de rodadas dentro do escopo e da estrutura aprovados no briefing e na solicitação inicial. Mudanças de escopo são alinhadas separadamente.

## Valores

Use números sem símbolo de moeda ou separador de milhares:

```js
total: 4800,
cashDiscount: 300,
cardInstallments: 6,
cardTotal: 5100,
```

O site calcula a condição à vista, o pagamento em duas etapas e as parcelas do cartão, mostrando os respectivos totais.

## Assinatura pelo Autentique

O botão **Revisar e assinar contrato** abre o resumo com a forma de pagamento escolhida. Para habilitar o encaminhamento real:

1. Prepare o contrato final no Autentique, com o escopo e a condição de pagamento desta proposta.
2. Obtenha o link individual de assinatura do cliente.
3. Preencha `contract.signingUrls` para a condição correspondente (`split`, `cash` ou `card`). Cada documento deve refletir a condição escolhida.
4. Revise os dados e mude `demo` para `false`.

Com `demo: true`, a assinatura fica desabilitada. Este repositório não inclui contrato real, token de API, coleta de assinatura ou confirmação automática. A geração de documentos e o recebimento da confirmação do Autentique exigem uma integração em servidor, que o GitHub Pages não executa.

Não adicione tokens de API ou documentos privados aos arquivos públicos. Links individuais de assinatura também ficam visíveis quando inseridos em uma página pública; use a autenticação e as permissões adequadas no documento de destino.

## Arquivos

- `index.html`: estrutura da página e revisão da proposta.
- `style.css`: estilos, dispositivos móveis, animações e impressão.
- `script.js`: dados, cálculos, galeria e interações.
- `config.js`: configuração da proposta.
- `assets/`: logo e imagens do portfólio.
- `favicon.svg`: ícone da Swim.
- `.nojekyll`: publicação dos arquivos estáticos sem processamento de Jekyll.

A fonte DM Sans é carregada do Google Fonts; sem conexão, é usada Arial. O botão **Salvar em PDF** abre a impressão do navegador.

O pedido de `noindex` da página não oferece proteção de acesso. Este repositório e a demonstração publicados são públicos.
