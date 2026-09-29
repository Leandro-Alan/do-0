# André Alves — hub pessoal (substitui o Linktree)

**Status (29/09/2026):** os sete capítulos, o rodapé, o preview de link e a
medição estão prontos. É **demo de prospecção** — o André ainda não viu nada
disso. Nada pode aparecer quebrado, vazio ou "em breve".

André Alves (@andresantovisu) é empresário do mercado de barbearia em
Jacareí-SP. Hoje a bio do Instagram dele aponta pra um Linktree. Este site é o
substituto: uma página só, em capítulos de tela cheia, uma frente de negócio
por capítulo.

> Relação com `clientes/santo-visu/`: aquela pasta é o site **da barbearia**.
> Esta é o hub **do dono**, e cita a barbearia como um capítulo entre outros.
> São dois projetos, dois repositórios, duas URLs. Não misturar.

## Contexto de uso (manda em toda decisão)

Quase todo o tráfego vem da **bio do Instagram**: celular, dentro do navegador
interno do Instagram, em 4G. Então:

- **Mobile-first a partir de 390px.** Desktop é consequência, não ponto de
  partida.
- **Proibido:** three.js, vídeo em autoplay, smooth scroll com biblioteca
  (Lenis e afins), iframe carregado de cara (YouTube só com fachada clicável).
- **Não acessar Instagram nem Facebook** em nenhuma etapa. Toda imagem que o
  site usa já está em `public/`.
- O navegador interno do Instagram não tem barra de endereço e trata
  `position: fixed` de forma irregular com teclado aberto. Nada de depender de
  `fixed` pra conteúdo essencial.

## Stack

- **Next.js 16.3 App Router + TypeScript**, sem `src/`, alias `@/*`
- **Tailwind v4** (`@import "tailwindcss"` + `@theme inline` em `globals.css`)
- **GSAP + ScrollTrigger via npm**, registrado num **único client component**
  (`app/components/ChapterStack.tsx`). Nenhum outro arquivo chama
  `gsap.registerPlugin`.
- **next/image** e **next/font** (Archivo). Sem CDN de fonte.
- `npm run dev` sobe na **3010** com `-H 0.0.0.0` (3000-3009 já são de outros
  projetos daqui). Deploy na Vercel.

## Conceito

Capítulos em tela cheia. Ao rolar, o próximo **sobe por cima** do anterior,
como slide empilhado, e a identidade de cor muda junto. O esqueleto é igual em
todos; só mudam a **paleta** e o **elemento-assinatura**.

Ordem (é a ordem do array em `lib/chapters.ts`, e só isso):

| # | id | capítulo |
|---|---|---|
| 00 | `hero` | abertura |
| 01 | `barbersvale` | Barbers Vale |
| 02 | `fortix` | Fortix |
| 03 | `choque` | Choque de Gestão |
| 04 | `palestras` | Cursos e Palestras |
| 05 | `youtube` | YouTube |
| 06 | `barbearia` | Santo Visu Barbearia |
| — | — | rodapé normal |

## Mecânica do empilhamento

- Cada capítulo é um `<section class="capitulo">` **sticky, `top: 0`,
  `min-height: 100svh`**. Todos são **irmãos diretos** dentro de `.pilha` — é
  o que faz um segurar enquanto o outro passa por cima. Não envolver um
  capítulo num wrapper próprio: quebra o efeito.
- **Capítulo mais alto que a viewport:** `top = min(0, alturaViewport −
  alturaSeção)`, recalculado por `ResizeObserver` e gravado em `--top`. Sem
  isso o pé do capítulo fica escondido embaixo do capítulo seguinte.
- **TODO capítulo ganha um RESPIRO depois de si** (`--respiro`, margem
  inferior escrita pelo mesmo `ResizeObserver`), e ele vale **uma tela
  inteira** mais o excesso: `excesso + alturaViewport`.
  - **A conta é 50/50, e é o coração do ritmo do site.** A transição custa
    exatamente **uma tela** de rolagem e isso não dá pra encurtar: o capítulo
    que entra percorre de `y = tela` até `y = 0`, o que é a definição do
    sticky. Então a única moeda que faz o capítulo **parar** é dar a ele a
    mesma quantidade: uma tela parado, uma tela trocando.
  - **Medido antes de existir, a 1900×870:** o capítulo ficava parado e
    completo por **104px** contra **870px** de transição — 89% da rolagem com
    dois capítulos na tela. Uma volta da rodinha do mouse (~100px) comia a
    janela inteira. Foi o que o Leandro descreveu em 29/09: "nenhum slide
    para completo, roda um pouquinho pra cima e já pega a parte de cima".
  - **O mesmo número explicava o botão do YouTube "que não dá pra clicar":**
    não havia nada tapando (medido, `elementFromPoint` devolvia o próprio
    botão) — só que, com 89% da rolagem em transição, quando a pessoa mirava
    no play o capítulo seguinte já estava subindo por cima.
  - Depois: **870px parado por capítulo, 50% da rolagem**, e o documento foi
    de 7598 para 11728px numa tela de 870. **Quem quiser mexer no ritmo mexe
    num número só**, o coeficiente em `ChapterStack.tsx`.
  - O excesso continua sendo pago por cima disso, pelo motivo antigo: uma
    seção de altura `A` numa tela `V`, grudando em `top = V − A`, mostra o
    corpo inteiro no exato instante em que gruda, e a seção seguinte começa a
    subir **nesse mesmo instante**.
- **NUNCA usar `scroll-snap` de página aqui.** Tentado e revertido em 29/09:
  `scroll-snap-stop: always` com `mandatory` prende a rolagem no topo de cada
  capítulo, e capítulo mais alto que a tela deixa de poder ser rolado até o
  fim — fica cortado. O rodapé, que não é alvo de snap, vira inalcançável. O
  "assentar" vem do `--respiro`, não de snap. O comentário está no topo do
  `globals.css`.
- **Tela baixa e larga (notebook) tem bloco próprio pro hero**
  (`min-width: 900px and max-height: 899px`). O respiro tornou o índice
  alcançável; esse bloco faz o hero **caber**, que é melhor: o índice é a razão
  de ser da capa e tem que ser lido de uma vez. É media query de **altura**, e
  não clamp menor, porque a 1440 os respiros do desktop já estão no teto do
  clamp — baixar o coeficiente em vh encolheria a tela de 27" junto. Medido:
  840 → 764 em 768, e 875 → 812 em 864.
- **Cada capítulo é precedido por um `<div data-marco>` de altura zero.** Ele
  não gruda, então é ele que o ScrollTrigger mede. Medir a própria seção
  sticky dá posição errada. O `Chapter` devolve marco + seção juntos.
- **O `id` de âncora vive no marco, não na seção.** Âncora pra elemento sticky
  não funciona: grudado no topo ele devolve `rect.top = 0`, o navegador conclui
  que já está na tela e não rola nada. `#barbersvale` aponta pro marco.
- **Nunca pôr `scroll-behavior: smooth` no `html`.** O ScrollTrigger rola a
  página sozinho pra remedir, e com smooth global esse pulo vira animação
  visível. Quem precisa de suavidade chama `scrollIntoView({behavior:"smooth"})`
  — é o que o `ProgressRail` e o `Indice` fazem, sempre checando
  `prefers-reduced-motion` antes.
- **Coberto (scrub):** o capítulo que está sendo tapado vai de `scale 1→0.92`,
  `brightness 1→0.5`, `radius 0→28px`. Quem entra tem os **cantos de cima** em
  28px, zerando quando encosta no topo.
- Anima só `transform`, `filter`, `opacity` — e `border-radius`, que o
  conceito exige. Nada de `width`, `height` ou `top` animados.
- Tudo isso mora no **palco** (`.palco`), o filho da seção. A seção sticky
  nunca recebe `transform` nem `filter`: criaria containing block e o sticky
  passa a se comportar diferente entre navegadores.
- **O último capítulo não é coberto**: ele é `position: relative`, não sticky,
  e o rodapé vem depois dele em fluxo normal.
- `prefers-reduced-motion`: **só a troca de cor**. Sem scale, sem brightness,
  sem radius. Implementado com `gsap.matchMedia()`.
- `<meta name="theme-color">` acompanha o `bg` do capítulo ativo
  (`ThemeColorSync`).
- **ProgressRail**: 7 traços na cor de acento do capítulo ativo, clicáveis.
  Vertical à direita no desktop, horizontal no topo no mobile. Cada traço é um
  alvo de toque de 28px, ainda que o risco visível tenha 3px. Os traços levam
  uma `drop-shadow` discreta porque a cor é a do capítulo **ativo**, mas quem
  passa por trás durante a transição é o **anterior** — sem a sombra, acento
  branco sobre capítulo claro some.

## Temas

`lib/chapters.ts` é a **fonte única de verdade**: id, número, categoria, nome,
cores, themeColor, links e conteúdo. A **ordem do array é a ordem do site**.

As cores viram **CSS vars por section** (`--bg`, `--fg`, `--muted`,
`--accent`, `--accent-fg`), escritas no `style` do `<section>` pelo componente
`Chapter`. **Nenhuma cor hardcoded em componente de capítulo** — se você
escreveu um `#` dentro de um componente, está errado.

| capítulo | bg | fg | accent | accent-fg |
|---|---|---|---|---|
| hero | `#0D0C0A` | `#F1EBDF` | `#D9A928` | bg |
| barbersvale | `#04140C` | `#EAF7EF` | `#19E08C` | bg |
| fortix | `#E3E3E0` | `#111214` | `#2A2C31` | bg |
| choque | `#141C7E` | `#FFFFFF` | `#FFFFFF` | `#141C7E` |
| palestras | `#EEE4D4` | `#2E1C13` | `#6B3A22` | bg |
| youtube | `#0E0E0E` | `#F5F5F5` | `#FF1F3D` | bg |
| barbearia | `#E2AF1C` | `#22150E` | `#22150E` | `#E2AF1C` |

A **alternância escuro/claro é intencional** (escuro, escuro, claro, escuro,
claro, escuro, claro). Não "harmonizar" isso.

### Cores medidas nos arquivos reais (divergem da paleta — decisão pendente)

A paleta acima foi definida pelo Leandro. Estas são as cores **medidas** nos
logos que estão em `public/marca/`, pra quando/se valer a pena aproximar:

- Barbers Vale, verde real: **`#01DB84`** (no flyer 2K26: `#00D782`). A paleta
  usa `#19E08C`, mais claro e mais azulado.
- Choque de Gestão, azul real do logo: **`#040F5E`**, com a marca em `#EAF7FF`.
  A paleta usa `#141C7E`, bem mais claro. A versão clara do logo é `#DEE0DD`
  de fundo com a marca em `#242333`.
- Fortix: logo em fundo **`#222222`** — ou seja, **fundo escuro num capítulo
  claro**. Ver "Fotos e logos".

## Capítulo 00 — a capa é um índice

Quem chega veio da bio do Instagram e **já sabe quem é o André**. Então o hero
não explica: apresenta em uma frase e entrega os seis caminhos. Um toque leva a
pessoa ao que ela veio buscar.

- **`Chapter` tem uma saída do esqueleto: a prop `corpo`.** Ela troca o miolo
  inteiro, mantendo marco, seção sticky, palco e paleta. **Só o hero usa.** Ela
  existe pra que a mecânica do empilhamento não passe a existir em dois lugares
  — se um dia precisar de outra capa, é por aqui, nunca copiando a seção.
- **Layout.** Celular: foto em 45svh no topo, nome grande fora do fluxo
  (`position: absolute; bottom: 100%` em cima do corpo, ou seja, encostado na
  base da foto), depois assinatura, frase, selo e índice — cerca de 1,15 tela.
  Desktop (≥900px): duas colunas, foto sangrando na borda esquerda, tudo o
  mais na direita e o nome volta a ser item normal do fluxo.
- **A foto não tem recorte sem fundo** (não existe no material dele), então vai
  o caminho alternativo: `TreatedImage modo="capa"` + duotone quente + um
  degradê forte (`.hero-degrade`) costurando a foto no breu. **`forca={0.38}`**:
  acima de ~0.5 o ouro come o azul da pele e o rosto fica oliva, com cara de
  filtro barato. É a única imagem do site com `priority` — é o LCP.
- **Índice.** Uma linha por capítulo, lendo número, nome, categoria e a cor de
  fundo direto de `lib/chapters.ts`. A amostra circular leva um anel porque
  metade das cores é quase preta sobre um hero quase preto. No hover (só em
  quem tem mouse) a linha veste `--linha-bg`/`--linha-fg` do capítulo.
- **O selo de evento expira sozinho.** `chapters[1].evento.data` manda; o corte
  é o fim daquele dia **no horário de Brasília**, não no fuso de quem abriu. O
  servidor decide se renderiza, mas a página é estática e congela essa resposta
  no build — por isso `SeloEvento` confere de novo no cliente e se esconde se a
  build for velha. Sem isso, uma build de setembro anunciaria o evento em
  novembro.
- **Entrada (~1,1s).** `EntradaHero` usa `useLayoutEffect`, não `useEffect`: o
  GSAP precisa gravar o estado inicial antes da primeira pintura, senão o hero
  aparece pronto e some pra animar. E anima **`opacity`, nunca `autoAlpha`** —
  `autoAlpha` usa `visibility: hidden`, que tira o elemento do alcance do
  toque, e o índice tem que estar clicável desde o primeiro quadro.

## Capítulo 01 — Barbers Vale

**É teaser, não página de evento.** O Barbers Vale tem landing própria
(`links.lp`); reproduzir a LP aqui atrapalha as duas. Impacto, os três fatos
que importam, e um clique pra lá.

Usa o **esqueleto normal** do `Chapter` — nada de `corpo`. A contagem entra
pelo slot `assinatura`, que é exatamente pra isso que existe.

- **Todo o CSS é escopado em `[data-id="barbersvale"]`.** É assim que um
  capítulo ajusta o esqueleto sem tocar nos outros. Se precisar de um ajuste
  só seu, escope por `data-id` — nunca edite `.palco-conteudo` direto.
- **O miolo precisa ficar acima da mídia** (`position: relative; z-index: 2`):
  elemento posicionado (cordilheira, foto) pinta por cima de elemento sem
  posição **por mais baixo que seja o z-index**, e sem isso os dois CTAs
  ficavam atrás das montanhas. Descoberto aqui, hoje vive no esqueleto.
- **A foto some por máscara, nunca por camada opaca em cima.** Cobrir com
  degradê até o fundo escondia a cordilheira que passa por trás e o corte
  virava uma parede vertical no desktop. Com `mask-image`, a serra atravessa
  inteira e a foto se dissolve nela.
- **Duotone verde a `forca={0.55}`.** Mesmo teto do ouro no hero: acima de
  ~0,6 o acento come a pele e vira filtro neon.
- **A marca do logo entra como `mask-image`**, e a cor vem de `--accent`. O
  arquivo é `public/marca/barbersvale-marca.webp` (branco + alpha), gerado por
  `scripts/marca-barbersvale.mjs` a partir do selo chapado. Mesmo arranjo do
  selo da Santo Visu.
- **O pulso é o desenho da própria marca** esticado na largura — por isso tem
  vale e pico agudo, e não uma onda qualquer.
- **O SVG do pulso escala uniforme de propósito** (sem
  `preserveAspectRatio="none"`, sem `vector-effect: non-scaling-stroke`). O
  traço é desenhado com `stroke-dashoffset` medido por `getTotalLength()`, que
  devolve unidades do viewBox: esticar só a largura faria o comprimento medido
  não bater com o desenhado e sobraria pedaço parado. A espessura vem em
  unidades do viewBox e encolhe junto com a tela, de propósito.
- **Cordilheira sem cor própria:** os planos saem de `color-mix` entre `--bg` e
  `--accent`. Trocar a paleta do capítulo troca a serra junto.
- **Parallax em unidades do viewBox, não `yPercent`** — cada plano tem uma
  caixa de tamanho diferente, então porcentagem desmancharia a escada de
  profundidade.

### Os três estados do evento

`faseEvento()` em `lib/chapters.ts` é a única fonte, e está sempre ancorada no
**horário de Brasília** — não no fuso de quem abriu:

| fase | quando | contagem | CTA principal |
|---|---|---|---|
| `antes` | até 26/10 08:00 | dias/horas/min/seg | "Garantir meu ingresso" |
| `hoje` | 26/10 08:00 → 23:59 | "É hoje." | "Garantir meu ingresso" |
| `passou` | depois disso | não renderiza | "Conhecer o Barbers Vale" |

O link é o mesmo nos três. Testado com relógio falso nas três fases e nas
viradas de 07h59 → 08h00 e 23h59 → 00h01.

- **A contagem nasce escondida e quem acende é o cliente.** A página é
  estática: se o servidor desenhasse os números, viriam congelados da hora do
  build. O dado que importa (data, teatro, cidade) está na linha de fatos, que
  é renderizada no servidor e não depende de JS.
- **Zero estado do React na contagem.** Um tique por segundo viraria um render
  por segundo; os dígitos são escritos direto no DOM por refs, como no `Proof`.
- **O relógio é `aria-hidden`.** Leitor de tela não pode anunciar número novo a
  cada segundo — quem informa é a linha de fatos. Só "É hoje." fica legível.
- **O flip só tem `transition` enquanto a classe `virando` está lá**, pra que a
  volta ao lugar seja instantânea e o próximo flip comece limpo.

## Capítulo 02 — Fortix

Clube de mentoria para donos de barbearia. **Capítulo claro**: concreto,
grafite e as três listras do logo. Sóbrio — é clube, não promoção.

Esqueleto normal do `Chapter`. CSS todo escopado em `[data-id="fortix"]`.

- **O ângulo das listras foi MEDIDO, não escolhido no olho.** Script sobre
  `assets-originais/marca/fortix.jpg`: isola as barras por threshold, roda PCA
  em cada uma (as duas maiores deram 37,5° e 38,0°) e confirma a mão por
  ocupação de canto — elas **descem** da esquerda pra direita. Daí
  `--fx-angulo: 38deg`. A leitura a olho engana e dá o contrário.
- **O scrub anda em fração da largura da tela, não em `xPercent`.** As três
  listras têm larguras diferentes, então `xPercent` dava deslocamentos
  desproporcionais e duas saíam inteiras da seção.
- **A rotação mora no container e o scrub mexe só no `x` das filhas**, pra que
  o deslocamento aconteça no eixo da própria listra.
- **O empilhamento do miolo contra a mídia virou regra do esqueleto.** Era
  escopado aqui e no 01; no capítulo 03 apareceu pela terceira vez e subiu pro
  `.palco-conteudo` global. Nenhum capítulo precisa reescrever.
- **Título expandido (`tituloWdth: 122`), peso 500, caixa alta, tracking
  `0.06em`** — o oposto exato do capítulo 01, que é o mais condensado do site.
- **O logo só aparece dentro da pastilha grafite.** O arquivo tem 150×150 e
  fundo escuro próprio; a pastilha é do mesmo tom pra parecer o logo, e não um
  quadrado colado em cima dele. Nunca exibir acima de 150px.

### A galeria e o ângulo que não cabe

`FaixaFotos` decide sozinha pela quantidade de foto: **0 → não renderiza nada**;
1 ou 2 → uma foto grande; 3 ou mais → faixa arrastável com **scroll-snap
nativo** (CSS puro, sem biblioteca e sem listener de scroll).

**Hoje a Fortix não tem foto nenhuma, então a faixa não existe na tela.** O
componente está pronto e testado nos três modos: quando o André mandar, é só
preencher `conteudo.fotos` em `lib/chapters.ts` — nenhuma linha de layout pra
escrever.

O recorte é um paralelogramo **na mesma mão das listras**, mas **não no ângulo
literal**: uma borda a 38° da horizontal avança `altura / tan(38°)` = 1,28× a
altura, o que num quadro 4:3 dá 96% da largura e colapsa o paralelogramo num
risco. Por isso a inclinação é limitada por `--fx-inclinacao` (14%) — o quanto
dá pra cortar sem comer o assunto da foto.

## Capítulo 03 — Choque de Gestão

Certificação para donos e gestores de barbearia. Marinho chapado, branco, o
símbolo quadrado do logo e o xadrez dos painéis do evento. Institucional — é
diploma, não promoção.

Esqueleto normal do `Chapter`. CSS todo escopado em `[data-id="choque"]`.

- **O símbolo do logo é SVG inline, não imagem.** Ele é 100% ortogonal (cinco
  retângulos em ângulo reto), e as coordenadas saíram de
  `scripts/marca-choque.mjs`: o script lê `public/marca/choque-2.webp`, isola a
  tinta por threshold, agrupa as linhas em bandas e imprime a decomposição. **O
  viewBox é a caixa da marca em pixels do próprio arquivo (429×477)**, sem
  conversão. Ganho: nítido em qualquer tamanho (o logo só existe em raster),
  zero requisição, e a cor vem de `currentColor`.
  - Trap do script: a orla de antialias do JPG vira bandas de 1-2px e sai com
    13 retângulos em vez de 5. Por isso ele tem `TOLERANCIA`.
- **Título em largura NORMAL** (`tituloWdth: 100` — o único capítulo que não
  mexe no eixo wdth) com **peso 900**, o mais pesado do site. O tom
  institucional vem do peso, não da largura.
- **O capítulo cabe em 1,00 tela** de propósito, e isso custou caro. Com o
  respiro de topo do esqueleto ele passava de 1,15 tela, e aí a **faixa do pé
  só aparecia numa janela curta de rolagem**: num capítulo mais alto que a
  viewport, o capítulo seguinte começa a cobrir a base no mesmo instante em que
  ela termina de entrar. Por isso o `.palco-conteudo` daqui tem padding e gap
  próprios — no celular o crachá já vem antes dele, em fluxo. Medido em 1,00 a
  390, 430, 768, 1440 e 2560. Em tela curta (360×740) dá 1,09, e aí vale a
  mecânica normal do `--top`.

### O crachá

É o elemento-assinatura **e a mídia** do capítulo: não existe uma foto sequer
do Choque de Gestão, nem a pasta `public/choque`, e a regra da demo proíbe
moldura vazia — então o crachá ocupa o lugar que a foto ocuparia.

- **Celular: em fluxo, no topo.** O `midia` é o primeiro filho do `.palco`,
  então ele vira a primeira faixa do capítulo. Desktop (≥900px): sai do fluxo
  pra direita e o miolo recua 34%.
- **O cordão nasce acima do capítulo** (`margin-top` negativo, ou `top`
  negativo no desktop) e morre no corte do `.palco`. É o que faz o crachá
  parecer pendurado em algo fora da tela em vez de começar no ar.
- **Cordão em marinho clareado, nunca branco.** O rail do topo é branco e passa
  por trás dele no celular; cordão branco engoliria os traços.
- **Balanço e inclinação moram em nós SEPARADOS** (`.cq-pendura` e
  `.cq-inclina`). Os dois escrevem rotação: no mesmo elemento um apagaria o
  outro. O pivô dos dois é `50% 0` — girar pelo centro do cartão pareceria uma
  placa girando, não uma coisa pendurada.
- **O balanço dispara em `start: "top top"` no marco**, que é exatamente o
  instante em que o capítulo encosta no topo. `elastic.out(1, 0.45)` em 1,4s:
  com período 0.32 a oscilação inteira cabia em ~400ms e virava tremido. Medido
  −7° → +1,65° → −0,35°, assentando em ~700ms.
- **O cartão é sempre mais alto que largo (~0,76).** Largo demais ele deixa de
  ler como crachá e vira cartão de visita.
- **O campo de nome é `<input>` de verdade desde o primeiro frame**, com
  `maxLength={24}`. Nada é salvo, nada é enviado: não há `<form>` nem chamada
  de rede.
  - **`font-size: 1rem` é PISO, não escolha de estilo.** Abaixo de 16px o
    Safari do iPhone — que é o navegador interno do Instagram — dá zoom na
    página quando o campo recebe foco, e o capítulo inteiro sai do lugar.
  - O corte de 24 caracteres real é o `slice()` em `Cracha.tsx`. O `maxLength`
    segura digitação e colagem, mas não segura escrita por JS.
- **O nome muda o rótulo do CTA, que vive em outro slot.** Daí o
  `ProvedorNome`: é o único jeito de dois nós distantes dividirem estado sem
  transformar o capítulo inteiro em client component. **Ele não emite DOM**,
  então o marco e a seção continuam irmãos diretos de `.pilha` e a mecânica do
  empilhamento não muda. O servidor sempre escreve o rótulo neutro (o nome
  começa vazio), então não há divergência na hidratação.

### O xadrez e o letreiro

- **O xadrez é uma faixa horizontal simples com tile de um quadro**, e o xadrez
  de verdade nasce de **duas réguas defasadas meio quadro** — a de cima e a de
  baixo da faixa, com o letreiro no meio. Duas receitas foram descartadas por
  medição: `repeating-conic-gradient` (o navegador interno do Instagram no iOS
  é WebKit, e conic só chegou lá no Safari 16) e a clássica de duas camadas a
  45° — numa tira de **uma fileira só** ela corta os triângulos no meio e sai
  diagonal, não quadrada. No pé do crachá, onde não há par pra defasar, as duas
  fileiras vivem no mesmo elemento.
- **O marquee é CSS puro** e fecha o laço porque a lista vem **duplicada
  exatamente duas vezes**: a `translateX(-50%)` o segundo bloco está onde o
  primeiro começou. Mexer no número de **tiras** quebra isso; mexer no número
  de repetições **dentro** da tira, não.
- `min-width: 100vw` na tira é rede de segurança pra tela mais larga que ela:
  como as duas são idênticas, esticar as duas junto não quebra a emenda.
- **A faixa inteira é `aria-hidden`** — é a repetição decorativa do subtítulo,
  que o leitor de tela já recebeu. E o texto dela **sai do próprio
  `conteudo.subtitulo`**, sem o ponto final: uma frase, um lugar.
- O `@media (prefers-reduced-motion)` global só zera a **duração**, e com
  `infinite` isso deixaria o letreiro tremendo. Aqui há um `animation-name:
  none` explícito.

## Capítulo 04 — Cursos e palestras

O André **como palestrante**, falando com quem contrata: organizador de evento,
empresa, associação. Campo claro, areia com marrom café, o mais editorial do
site. Era o capítulo mais alto do site (1,28 a 1,51 tela) e **em tela de notebook
isso deixava o CTA fora da dobra**: medido em 1033px numa viewport de 870, com
o botão em y=915. Um capítulo de venda sem o botão à vista é um capítulo
quebrado, então em 29/09 ele ganhou bloco próprio em
`(min-width: 900px) and (max-height: 899px)` e passou a fechar em 1,00 tela.
Os 163px saíram das duas pontas do padding, do gap e do teto da tela de
projetor — **nenhum de conteúdo**.

Esqueleto normal do `Chapter`, **sem nenhum slot novo**. Duas decisões de
encaixe que valem ser lidas antes de mexer:

- **O bloco editorial (temas + tela + citação) entra pelo slot `provas`.** Ele é
  exatamente a região entre o subtítulo e os CTAs, que é onde esse bloco tem que
  ficar: prova antes do pedido. O invólucro daquele slot é um flex com wrap e
  gap; passando **um filho só, com `flex: 1 1 100%`**, o wrap e o gap viram
  inertes e ele se comporta como bloco. Foi isso que dispensou um slot novo no
  esqueleto — se um dia precisar de outro capítulo assim, é por aqui.
- **Os campos e o botão entram juntos pelo `ctaPrincipal`**, porque são a mesma
  coisa: os campos só existem pra montar o link do botão. Como não há
  `ctaSecundario`, o invólucro fica com um filho único e o `sm:flex-row` dele
  não muda nada.

### A foto, e por que ela é nova

`/public/palestras` e `/public/hero` **não existem** — o prompt pedia a foto de
lá. As duas fotos de "palco ou microfone" do acervo já estão em uso (`andre-4`
é o hero e é o LCP; `andre-auditorio` é o capítulo 01), e repetir o rosto do
hero quatro capítulos depois entrega que só existe uma foto.

Então entrou `andre-salao.webp`, gerada por `scripts/recorte-salao.mjs` a partir
de `andre-2.webp`. O script resolve **duas** coisas de uma vez:

1. Tira a **seta ">" do carrossel do Instagram** embutida na borda direita —
   pendência aberta desde a fundação. O círculo dela foi **localizado no
   arquivo**, não chutado: x 611..634, y 416..439. Cortar em 604 de largura tira
   com 7px de folga.
2. Entrega a proporção **4:3**, que é a da tela de projetor. Corpo inteiro não
   cabe em paisagem nenhuma: ele ocupa ~493px de altura numa largura de 604, o
   que daria proporção 1,22 — não existe tela de projetor assim. A janela corta
   perto da coxa, que é corte editorial normal.

O script é idempotente e **não apaga o original**: `andre-2.webp` continua lá.

### A tela de projetor

- **A sombra do duotone aqui é o `--accent`, não o `--fg`.** Medido lado a lado:
  com o `--duo-escuro` da paleta (`#2E1C13`, quase preto) a foto sai **cinza**
  por mais que se aumente a força, porque o tom claro deste capítulo é areia
  dessaturada e não tinge nada. Trocando só a sombra pelo marrom café do accent
  ela vira café de verdade e mantém profundidade. Continua tudo da paleta — é
  `--duo-escuro: var(--accent)` escopado em `.pl-tela`.
- **`forca={0.74}`**, acima do teto de ~0,5 que o hero e o 01 respeitam. Lá o
  rosto dele ocupa a foto inteira; aqui ele é uma figura pequena num salão.
- **O brilho por cima da foto é `--bg`, nunca branco.** Foto projetada lava pra
  cor da parede, e a parede aqui é a areia do capítulo. É o que faz a imagem
  parecer projetada e não colada.
- `modo="foto"` trava o quadro nos 604px reais do arquivo. Medido: 327px no
  celular, 604px no desktop, 587px a 2560. Nunca amplia.

### A citação

- **As palavras nascem opacas e quem apaga é o cliente.** O scrub vai de 0.15 a
  1 palavra por palavra, mas o estado inicial no CSS é **1**. Se fosse 0.15,
  quem entrasse sem JS, com reduced-motion ou antes da hidratação leria uma
  citação fantasma. O pior caso tem que ser legível.
- **O scrub termina em `top 15%`, não em `top top`.** A revelação acaba um pouco
  antes do capítulo assentar; terminando no topo, a última palavra só acenderia
  no instante em que o capítulo seguinte já começa a cobrir. Medido nos cinco
  quartos: 0.15 em todas → onda no meio → 1 em todas.
- **Itálico sintético, de propósito.** Carregar o Archivo Italic de verdade
  custa **um segundo arquivo de fonte, 100 KB, com `<link rel=preload>`** — ou
  seja, no caminho crítico da primeira pintura, pra todo visitante. Quase todo o
  tráfego vem da bio do Instagram, em 4G, e o hero é um índice: a maioria toca
  num capítulo e nunca chega no 04. Comparados lado a lado em 2× o itálico real
  é melhor (cor do traço mais uniforme, terminais cortados no ângulo); no
  tamanho real a diferença some. **Não vale 100 KB.** Se um dia valer, é uma
  linha em `layout.tsx`: `style: ["normal", "italic"]`.
- **Sem `<Proof>` nenhum**, de propósito: não existe um número confirmado sobre
  as palestras dele. O único número da tela é o "3x" da citação, que é
  afirmação da **Harvard Business Review** e vem com a fonte colada embaixo.

### O mini-briefing

Quatro campos opcionais que montam a mensagem do WhatsApp.

- **Ele só existe se o link for `wa.me`.** Em formulário, e-mail ou no fallback
  da DM não há mensagem pra montar, e quatro campos que não levam nada a lugar
  nenhum seriam pior que não ter campo. Nesse caso sobra o botão, e o capítulo
  encolhe pra 1,08 tela. **Testado nos três destinos** (wa.me, formulário e
  vazio) — é só trocar `WHATSAPP_PALESTRAS` em `lib/chapters.ts`.
- **`encodeURIComponent`, nunca `URLSearchParams`.** O segundo serializa espaço
  como `+`, e o wa.me mostra o `+` literal na caixa de mensagem. O link da
  Fortix, que o Leandro passou pronto, já usa `%20` — é o mesmo padrão.
- Servidor e primeiro render do cliente escrevem o mesmo href (todos os campos
  começam vazios), então não há divergência na hidratação.
- **`font-size: 1rem` é piso nos campos**, mesma armadilha do crachá do 03:
  abaixo de 16px o Safari do iPhone dá zoom ao focar.
- Nada é salvo e nada é enviado: não há `<form>` nem chamada de rede. O texto
  vai como parâmetro do link e quem envia é o WhatsApp da pessoa.

## Capítulo 05 — YouTube

Preto quase puro com o vermelho do YouTube. É o capítulo **tela**: o vídeo é o
protagonista e todo o resto encolhe pra ele caber.

- **É Server Component assíncrono.** A leitura do feed acontece no servidor e
  vale 6 horas. Quem abre o site **nunca fala com o YouTube** — nem pra saber
  que vídeos existem. A primeira requisição ao domínio deles sai quando alguém
  toca no play.
- **O feed é o RSS público** (`videos.xml?channel_id=…`), não a Data API: a API
  exige chave, painel do Google Cloud e cota diária pra entregar exatamente o
  que o RSS já dá de graça.
- **`ultimosVideos` nunca lança.** Sem `channelId` ela nem sai pra rede;
  qualquer falha vira `null`. Um `throw` aqui derrubaria a página inteira.
- **`ehChannelId` recusa o @handle de propósito.** O id é "UC" + 22 caracteres;
  colar a URL do canal no campo montaria uma requisição que responde 404. Com a
  checagem o capítulo nem tenta e vai direto pro bloco de reserva.
- **Fachada obrigatória.** A capa é imagem estática e só vira iframe no toque.
  Cada player do YouTube que nasce junto com a página puxa ~1 MB de JS de
  terceiro e planta cookie antes de a pessoa pedir — num site de sete capítulos
  que abre dentro do Instagram, isso mata a página.
- **A capa NÃO passa pelo `TreatedImage`.** É arte pronta do canal; mesma regra
  do flyer do 01. O duotone vermelho é pra foto crua.
- **`hqdefault.jpg` é a única capa que existe pra TODO vídeo.** As bonitas
  (`maxresdefault`, `hq720`) faltam em vídeo antigo ou vertical e devolveriam
  404 dentro do `next/image` — quadro quebrado na tela. Ela tem 480×360 (4:3)
  com tarja preta; o `object-fit: cover` numa caixa 16:9 corta exatamente as
  tarjas. **Por isso a tela grande para em 480px de largura.**
- **O selo de play é cheio, não um triângulo solto.** Capa de vídeo é imagem de
  contraste imprevisível (a do teste era amarela clara) e triângulo vermelho
  sumia nela. O par acento/acento-fg mede 5,07:1 e não depende da capa.
- **O clamp de 2 linhas do título mora num span de DENTRO.** O pai é
  `position: absolute`, e posicionamento absoluto blockifica o display: o
  `-webkit-box` que o clamp exige vira `flow-root` e o clamp para de valer. O
  sintoma era título cortado no meio da terceira linha, sem reticência.
- **A tela é `z-index: 3`, acima do miolo.** No desktop ela sai do fluxo pra
  direita e o miolo recua com `padding-right` — mas padding continua sendo caixa
  do elemento: com a tela abaixo do miolo, o `.palco-conteudo` ficava por cima
  dela e **comia todo clique. Ninguém conseguia dar play.**
- **No desktop a coluna é `width: fit-content`**, e não largura fixa: cada
  estado tem o teto do arquivo dele (480px a capa, 647px a foto da reserva). Com
  largura fixa a capa ficava encostada à esquerda de uma coluna de 634px.
- **O duotone: o vermelho é a LUZ, e entra escurecido** (`--accent` a 70% sobre
  o breu). Medido em oito variantes, e as duas famílias erradas erram por
  motivos diferentes: vermelho na **sombra** pinta a coisa mais escura da foto,
  que aqui é o **cabelo** dele — sai ruivo artificial; vermelho puro na luz
  deixa a foto rosada e clara, flutuando como adesivo sobre um capítulo quase
  preto.
- **A TV ligando dispara em `top top`, uma vez só.** Nasce invisível no CSS e
  quem acende é o cliente: sem JS ou com reduced-motion ela nunca aparece —
  é enfeite, não conteúdo. `once: true` é literal: TV liga uma vez.

## Capítulo 06 — Santo Visu

Onde tudo começou. Mostarda com marrom couro, e ele fecha a página pra cima.

- **É o último, e o único que não é coberto por ninguém.** Sai do sticky
  (`ultimo`) e o rodapé vem depois em fluxo. É o único capítulo em que passar de
  uma tela não custa nada: a base dele não some embaixo de ninguém.
- **A FOTO NÃO LEVA DUOTONE, e é o único capítulo assim.** Medido com 0,72,
  0,55, 0,40 e 0,25: em todas o tijolo sai cinza-esverdeado e o couro morre. A
  conta explica — a foto vira cinza antes, e cinza médio multiplicado pelo
  mostarda dá oliva. Só que **esta foto já é a paleta do capítulo**: parede de
  tijolo, couro marrom e o selo dourado aceso. Tingir ela nos tons do capítulo é
  tirar dela exatamente o que ela tem. O grão e a vinheta ficam, pra ela
  continuar da mesma família das outras.
- **O selo é marca d'água grande sangrando na borda, atrás de tudo** — não um
  carimbo pequeno no canto. O primeiro desenho punha o selo do tamanho de um
  adesivo ao lado da foto, e **a foto tem o mesmo selo aceso na parede**: os
  dois ficavam lado a lado, do mesmo tamanho, e liam como erro de duplicata.
  Enorme e cortado pela borda ele muda de registro.
- **Só o anel gira; o frade fica em pé.** Girar o selo inteiro faria o rosto dar
  voltas, que é o contrário de um carimbo. As duas peças existirem separadas é o
  que torna isso possível — vêm assim de `scripts/selo-santovisu.mjs`.
- **O giro dispara em `top 75%`, não em `top top`** como o crachá do 03: este é
  o último capítulo, não é sticky e não cobre ninguém — se o rodapé for curto, o
  marco dele pode nunca encostar no topo e o selo nunca giraria. `back.out(1.25)`
  passa um pouco do zero e volta: é o "pequeno overshoot" do carimbo. Medido
  −108° → +6,1° → assenta.
- **O parallax do mosaico termina em `"max"`, o fim do documento.** Duas
  tentativas medidas e erradas antes: `bottom top` no marco dá uma tela só de
  curso (marco tem altura zero) e congelava justo enquanto a pessoa lê; e
  `+=(tela + altura da seção)` pedia 6453px de rolagem num documento cujo
  scroll máximo é 5887 — o movimento parava em ~60%.
- **Uma foto NÃO vira faixa em laço.** Com duas ou mais o laço acontece; com uma
  seria a mesma imagem passando de novo e de novo, que é a maneira mais rápida
  de anunciar que só existe uma foto. Mesmo motivo que fez o 04 não repetir o
  rosto do hero.
- **Endereços e horários saíram em 29/09** (decisão do Leandro): o capítulo
  apresenta a barbearia, não é a ficha dela. O botão leva pro site da Santo Visu,
  que já tem seletor de unidade e agendamento. `Unidades.tsx` continua no
  projeto, pronto e testado, caso volte.

## Rodapé, preview de link e medição

### Rodapé

Volta à paleta do capítulo 00 e fecha o círculo. Fica **fora da pilha** — o
último capítulo vai embora e o rodapé aparece atrás, em fluxo. Por isso ele não
usa `<Chapter>`: não é capítulo, é o fim da página.

- **O índice do hero aparece de novo aqui**, de propósito: quem chegou ao pé
  rolou sete telas, e obrigar essa pessoa a voltar ao topo pra trocar de assunto
  é o tipo de detalhe que faz fechar a aba.
- **A assinatura da Sotalia é a mesma de todos os sites da casa**: a marca dos
  cinco pontos (o salto do golfinho), "feito por **Sotalia Hub**", e os pontos
  pulando em escada de 70ms no hover. Igual está no site da Santo Visu.

### Preview de link (o cartão do WhatsApp)

É a primeira impressão do site, e em muitos casos a única. Gerado no build, em
`app/opengraph-image.tsx`.

- **Quem desenha é o Satori, e ele não tem `mix-blend-mode` nem `mask-image`.**
  Por isso a foto chega pronta: `scripts/og-foto.mjs` refaz a conta do duotone
  pixel a pixel com os mesmos valores do capítulo 00 (cinza + contraste 1.08,
  sombra `#0D0C0A` em lighten, luz `#D9A928` em multiply, força 0,38, vinheta) e
  assa o degradê da direita no canal alfa.
- **A fonte vem como bytes de um TTF**, não do `next/font`: o Satori roda fora
  do navegador e precisa do arquivo na mão. `scripts/fonte-og.mjs` baixa —
  e o User-Agent tem que ser **bem** velho. Medi quatro: Chrome de hoje → woff2,
  Chrome 20 → woff (o Satori não lê nenhum dos dois), MSIE 6 → um endpoint que
  responde 200 com `content-type: text/html` e um binário que não é fonte
  nenhuma. **Android 2.2 é o único que devolve `.ttf`.**
- **Os caminhos do `readFileSync` são literais, um por chamada.** Parece
  repetição e não é: com o caminho vindo de variável o Turbopack desiste da
  análise estática e traça **o projeto inteiro** pra dentro do bundle do
  servidor, `public/` junto. O aviso dele é literal.
- Fonte e foto moram **fora de `public/`**: são lidas no build e não são
  servidas pra ninguém.
- **`noindex` não atrapalha o preview.** `noindex` fala com buscador; quem monta
  o cartão é o crawler da rede social, que lê a Open Graph. Dá pra ter preview
  bonito e continuar fora do Google.
- **`metadataBase` é obrigatório**: crawler de rede social não aceita caminho
  relativo de imagem. Sem ele o preview sai sem imagem.

### Favicon

`app/icon.tsx`, gerado com o mesmo TTF. **Não é um SVG escrito à mão porque
favicon não carrega webfont**: um `<text>` num SVG de ícone seria desenhado com
a fonte do sistema — Arial no Windows, Helvetica no Mac. Aqui o "AA" é
rasterizado no build, com Archivo de verdade.

### Medição

- **UTM** em todo link externo: `utm_source=site_andre`, `utm_medium=link_bio`,
  `utm_campaign=<id do capítulo>`. **Fora:** WhatsApp (pedido do Leandro, e lá
  não mede nada) e a DM do Instagram — essa é decisão documentada em
  `lib/rastreio.ts`: é o fallback de todo CTA sem destino, o ganho seria zero e
  um parâmetro estranho quebrando ali derrubaria vários botões de uma vez.
- **`track('cta_click', { chapter, cta })`** em todo CTA. O `cta` é um nome
  **estável**, não o rótulo visível: o do 01 vira "Conhecer o Barbers Vale"
  depois do evento e o do 03 vira "Garantir a vaga de [nome]". Rótulo variável
  viraria um evento novo a cada variação e o relatório não fecharia.
- **`LinkExterno` existe pra manter componentes no servidor.** `Hero`,
  `Unidades` e `TelaYouTube` precisavam de um `onClick`, e um `onClick` num
  componente de servidor quebra. Só esse nó vira cliente; o `TreatedImage` que
  eles carregam não vai parar no bundle do navegador.
- ⚠️ **Evento personalizado é recurso de plano pago na Vercel.** No Hobby o
  `track()` não registra; as visitas de página contam normalmente.

## Tipografia

**Só Archivo**, variável, via `next/font` com `axes: ["wdth"]`. Nenhuma outra
família entra no projeto.

Cada capítulo usa uma **largura diferente** no título, via `--titulo-wdth` no
próprio `<section>` e `font-stretch` na classe `.titulo` (não
`font-variation-settings`: junto com `font-weight` os dois brigam). Faixa útil
do Archivo: **62% a 125%**.

**A exceção são o 03 e o 04, os dois em 100.** Os dois briefings pediram
"largura normal", e normal é um valor só — inventar uma diferença de 4% pra
cumprir a regra seria ajustar o site pra caber na documentação. Eles se separam
pelo **peso**: 03 é 900 institucional, 04 é 500 editorial. Na prática a leitura
é mais distante entre eles do que entre dois capítulos que só mudassem a
largura.

| capítulo | wdth | peso | leitura |
|---|---|---|---|
| 00 hero | 112 | 800 | nome próprio |
| 01 Barbers Vale | 68 | 900 | o mais condensado do site |
| 02 Fortix | 122 | 500 | o mais expandido, caixa alta e tracking aberto |
| 03 Choque | 100 | 900 | institucional |
| 04 Palestras | 100 | 500 | editorial |
| 05 YouTube | 118 | 700 | expandido e pesado: é a porta de um canal |
| 06 Santo Visu | 95 | 600 | levemente condensado, o mais leve — fecho quente |

Escala com `clamp()`. Nada de `px` fixo em título.

**O itálico não está carregado**, e é decisão medida, não esquecimento — ver
"A citação", no capítulo 04. `font-style: italic` sintetiza a inclinação.

## Regras de demo (as que matam a venda se forem quebradas)

- **Não inventar** número, depoimento, data nem link. Só o que veio nos
  prompts do Leandro ou está legível no material em `public/`.
- **Nunca** exibir "TODO", "lorem ipsum" ou caixa cinza de placeholder na
  tela. **Dado faltando = o elemento não renderiza.** Pendência vive em
  comentário no código e em `TODO.md`, nunca em pixel.
- **Todo CTA funciona.** Link vazio cai no fallback
  `https://ig.me/m/andresantovisu` (DM do Instagram dele). Quem resolve isso é
  `ou()` em `lib/chapters.ts` — não repetir a regra em componente.
- `metadata.robots = { index: false, follow: false }` enquanto for demo.
- Link externo: `target="_blank" rel="noopener"`.
- Contraste AA e **foco visível** em tudo que é clicável. O rail também.
- **Barbers Vale já tem landing própria** (`https://lp.barbersvale.com.br/`).
  O capítulo é **teaser** que joga pra lá. Não reproduzir a LP aqui.

## Fotos e logos

A qualidade do material é **irregular** — metade é print de Instagram. Por isso:

- Toda foto de capítulo passa pelo **`TreatedImage`**: duotone na cor do
  capítulo (foto em preto e branco + duas camadas de cor em `mix-blend-mode`,
  `lighten` pras sombras e `multiply` pras luzes), granulação por SVG noise e
  vinheta leve. `tratar={false}` desliga tudo em foto boa.
- **Nunca exibir foto maior que a resolução real dela.** `TreatedImage` limita
  o quadro a `maxWidth: larguraReal` por padrão. Foto pequena: usar menor, em
  recorte, ou como fundo desfocado (`modo="fundo"`) com tratamento forte.
- **Logos:** PNG com fundo → tirar o fundo com sharp. Se não der (JPG chapado),
  exibir dentro de uma forma que **combine com o fundo do próprio logo**.

### O que existe em `public/` e pra que serve

Tudo ja passou pelo `optimize-images.mjs`: e **tudo .webp**, e a resolucao
abaixo e a do arquivo servido (os dois maiores foram limitados a 1800px).

**Fotos** (`public/fotos/`)

| arquivo | resolução | veredito |
|---|---|---|
| `andre-4.webp` | 1800×1202 | **A melhor.** André no palco, microfone, luz roxa. Serve de destaque grande em qualquer capítulo. |
| `flyer-barbersvale-2026.webp` | 1800×1013 | Arte oficial do **2K26 "A Evolução"**, 26 de out, Teatro Ariano Suassuna, Jacareí. Destaque grande, mas é arte pronta: **não tratar** (`tratar={false}`). |
| `andre-auditorio.webp` | 763×767 | André no palco do teatro, plateia vermelha vazia. Uso médio (até ~760px). Print de Instagram. |
| `auditorio-barbersvale.webp` | 767×506 | Teatro cheio de poltronas com o telão verde "BARBERS VALE". Uso médio. Tem **ícone de perfil do Instagram no canto inferior esquerdo** — recortar antes de usar. |
| `andre-2.webp` | 640×818 | André de pé num salão de eventos. **Não usar direto**: tem a seta ">" do carrossel do Instagram na borda direita. É a origem do `andre-salao.webp` — se precisar dela, recorte como aquele faz. |
| `andre-salao.webp` | 604×453 | O `andre-2` já aparado: sem a UI do Instagram e em 4:3. André no salão montado, telão ao fundo. **É a foto do capítulo 04.** Gerada por `scripts/recorte-salao.mjs` — não editar à mão. |
| `barbearia/salao-luminoso.webp` | 802×802 | Salão da Santo Visu: tijolo, cadeiras de couro e o selo aceso na parede. **É a foto do capítulo 06, e a única de ambiente que existe** — veio de `clientes/santo-visu/`, o site da própria barbearia. Única foto do site que NÃO leva duotone. |
| `andre-1.webp` | 647×857 | André numa barbearia, de polo branca. Uso médio/pequeno. Luz boa, enquadramento solto. |
| `andre-3.webp` | 1024×1024 | **Não é foto documental** — é arte com cara de anos 70 e textura de filme envelhecido ("seu negócio muda, quando você muda!"). Não apresentar como foto do André. Serve como peça gráfica, e só se ele confirmar que é material dele. |

**Logos** (`public/marca/`)

| arquivo | resolução | veredito |
|---|---|---|
| `barbersvale-selo.webp` | 820×820 | Marca (o "pulso/montanha") preta em fundo verde chapado. Grande, ok. JPG sem alpha: usar **dentro de um quadrado verde**, ou recortar a marca com sharp. |
| `barbersvale-nome.webp` | 634×213 | Lettering "BARBERS VALE" verde **com alpha**. É o melhor ativo da marca. Uso pequeno/médio (até 634px). |
| `choque-1.webp` | 1080×1080 | Marca clara em fundo **azul-marinho `#040F5E`**. Grande, ok, mas é fundo chapado: usar dentro de um quadrado azul. |
| `choque-2.webp` | 1080×1080 | A mesma marca, escura em fundo claro `#DEE0DD`. **Não é pra exibir**: é a fonte que `scripts/marca-choque.mjs` mede pra gerar o path do `MarcaChoque.tsx` (maior contraste entre tinta e fundo). |
| `barbersvale-marca.webp` | 491×350 | A marca sozinha, **branca com alpha**, aparada — gerada por `scripts/marca-barbersvale.mjs`. Não é pra exibir: é **máscara CSS**, a cor vem de `--accent`. |
| `santovisu-anel.svg` | vetor | O texto circular do selo da Santo Visu. **Máscara CSS**, a cor vem do capítulo. É esta peça que gira. Gerada por `scripts/selo-santovisu.mjs` a partir do site da barbearia, com as coordenadas arredondadas pra inteiro (−42% de peso, diferença invisível). |
| `santovisu-miolo.svg` | vetor | O frade dentro do círculo. Mesma origem e mesmo uso; **não gira** — só o anel gira. |
| `fortix.webp` | 150×150 | **Minúsculo e com fundo escuro `#222222`.** Só uso pequeno (nunca acima de 150px de largura) e dentro de uma pastilha escura. O capítulo Fortix é claro, então esse contraste é proposital: a pastilha escura vira o elemento-assinatura. **Pedir o logo em SVG/alta.** |

Originais crus em `assets-originais/` (movidos pra lá por
`scripts/optimize-images.mjs`) e também fora do projeto, em
`Área de Trabalho/André-SantoVisu/`.

### `scripts/optimize-images.mjs`

Converte `public/**/*.{jpg,jpeg,png}` pra **WebP** (máx. 1800px no lado maior,
qualidade 78, alpha preservado) e **move o original** pra `assets-originais/`,
mantendo a subpasta. É idempotente: rodar de novo não faz nada. `npm run
imagens`.

## Onde editar o quê

| Quero mudar… | Arquivo |
|---|---|
| Ordem, nome, cor, link ou conteúdo de capítulo | `lib/chapters.ts` |
| Categoria que aparece no índice E na etiqueta | `lib/chapters.ts` (é o mesmo campo) |
| Data do evento do selo do hero | `lib/chapters.ts` → `barbersvale.evento` |
| Mecânica do empilhamento, GSAP, rail, theme-color | `app/components/ChapterStack.tsx` |
| Esqueleto de um capítulo (etiqueta, título, mídia, CTA) | `app/components/Chapter.tsx` |
| Capa, foto e índice do hero | `app/components/Hero.tsx` |
| Capítulo 01 inteiro | `app/components/BarbersVale.tsx` |
| Capítulo 02 inteiro | `app/components/Fortix.tsx` |
| Listras da Fortix e o scrub delas | `app/components/ListrasFortix.tsx` |
| Galeria em paralelogramo (qualquer capítulo) | `app/components/FaixaFotos.tsx` |
| Capítulo 03 inteiro | `app/components/Choque.tsx` |
| Crachá, balanço, inclinação e o campo de nome | `app/components/Cracha.tsx` |
| CTA que vira "a vaga de [nome]" | `app/components/CtaVaga.tsx` |
| Xadrez e letreiro do pé do 03 | `app/components/FaixaLema.tsx` |
| Símbolo do Choque (regerar as coordenadas) | `scripts/marca-choque.mjs` → `app/components/MarcaChoque.tsx` |
| Capítulo 04 inteiro | `app/components/Palestras.tsx` |
| Citação e o scrub palavra a palavra | `app/components/Citacao.tsx` |
| Moldura da tela de projetor e o brilho | `app/components/TelaProjetor.tsx` |
| Mini-briefing e a mensagem do WhatsApp | `app/components/ConviteParaPalestrar.tsx` |
| Ligar/desligar o mini-briefing | `lib/chapters.ts` → `WHATSAPP_COMERCIAL` |
| Recorte da foto do salão (regerar) | `scripts/recorte-salao.mjs` |
| Contagem regressiva e os 3 estados | `app/components/Contagem.tsx` |
| Cordilheira, parallax e pulso | `app/components/Cordilheira.tsx` |
| Marca do Barbers Vale (regerar) | `scripts/marca-barbersvale.mjs` |
| Linhas do índice e a rolagem do toque | `app/components/Indice.tsx` |
| Tempo e ordem da entrada do hero | `app/components/EntradaHero.tsx` |
| Tratamento de foto | `app/components/TreatedImage.tsx` |
| Escala de tipo, vars globais | `app/globals.css` |
| Capítulo 05 inteiro | `app/components/YouTube.tsx` |
| Leitura do feed do YouTube, cache de 6h | `lib/youtube.ts` |
| Fachada do vídeo e o play | `app/components/FachadaVideo.tsx` |
| Tela grande, trilho e bloco de reserva do 05 | `app/components/TelaYouTube.tsx` |
| A TV ligando | `app/components/TvLiga.tsx` |
| Canal e id do canal | `lib/chapters.ts` → `CANAL_YOUTUBE`, `CHANNEL_ID_YOUTUBE` |
| Capítulo 06 inteiro | `app/components/Barbearia.tsx` |
| Mosaico de fotos e o parallax | `app/components/MosaicoBarbearia.tsx` |
| Selo que gira | `app/components/SeloSantoVisu.tsx` |
| Selo (regerar os SVG) | `scripts/selo-santovisu.mjs` |
| Endereços e horários (pronto, hoje sem uso) | `app/components/Unidades.tsx` |
| Rodapé, índice do pé e assinatura | `app/components/Rodape.tsx` |
| Marca da Sotalia (os cinco pontos) | `app/components/MarcaSotalia.tsx` |
| Imagem de compartilhamento | `app/opengraph-image.tsx` |
| Foto da imagem OG (regerar) | `scripts/og-foto.mjs` |
| Fonte do OG e do favicon (rebaixar) | `scripts/fonte-og.mjs` |
| Favicon | `app/icon.tsx` |
| UTM e eventos de clique | `lib/rastreio.ts` |
| Título, descrição e robots | `app/layout.tsx` |
| Respiro e `--top` dos capítulos altos | `app/components/ChapterStack.tsx` |
| Pendências | `TODO.md` |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
