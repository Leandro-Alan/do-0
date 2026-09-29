# Pendências — hub do André

**Atualizado em 29/09/2026.** Nada daqui vira pixel na tela: enquanto estiver
aqui, o elemento correspondente simplesmente não renderiza. Fallback de link
vazio é sempre a DM do Instagram (`https://ig.me/m/andresantovisu`), resolvida
por `ou()` em `lib/chapters.ts`.

Cada item diz **o que falta**, **o que aparece na tela hoje** e **o que muda
quando chegar**.

---

## 00 · Capa (hero)

| o quê | estado |
|---|---|
| Links | ✅ Instagram real. |
| Foto | `andre-4.webp` (1800×1202), a melhor do acervo. É o LCP e a base da imagem de compartilhamento. |
| Falta | Uma frase do André em primeira pessoa — quem ele é em uma linha, na voz dele. Hoje o subtítulo é descritivo ("Eventos, mentoria, consultoria e conteúdos…"), que funciona mas não tem voz. |

---

## 01 · Barbers Vale

| o quê | estado |
|---|---|
| Links | ✅ Completo. LP própria (`lp.barbersvale.com.br`) e Instagram do evento. |
| **Confirmar: hora de abertura** | A contagem regressiva mira **26/10/2026 às 08:00**. Essa hora veio do teu prompt, **não do flyer** — o flyer só traz a data. Se o evento abrir em outro horário, a contagem vira "É hoje." na hora errada. |
| **Confirmar: edição e local** | "A EVOLUÇÃO" e "Teatro Ariano Suassuna" foram lidos no flyer oficial, não confirmados com o André. |
| Foto a trocar | `andre-auditorio.webp` (763×767) é print de Instagram e limita o tamanho de exibição. Uma foto boa do palco cheio melhoraria o capítulo. |
| Foto travada | `auditorio-barbersvale.webp` tem **ícone de perfil do Instagram** no canto inferior esquerdo. Precisa de recorte antes de entrar — hoje não é usada. |

---

## 02 · Fortix

| o quê | estado |
|---|---|
| Links | ✅ WhatsApp comercial e Instagram do clube. |
| **Mudou em 29/09** | O CTA ia pro WhatsApp do André com a mensagem "Olá, quero ser FORTIX" pronta. Agora vai pro **WhatsApp comercial** (`api.whatsapp.com/message/VN6GVW3FQ5CSC1`), que é pra onde o Linktree manda. Esse tipo de link **não aceita mensagem pronta** — quem define o texto de abertura é a conta comercial, lá dentro do WhatsApp. |
| **Confirmar: os dois números** | "Quase R$ 2 mi faturados com a Santo Visu no último ano" e "+20 barbearias mentoradas" vieram do teu prompt. São as afirmações mais fortes do site e as primeiras que um lead vai querer conferir. |
| Logo | Só existe em **150×150 com fundo `#222222`**. Por isso ele só aparece pequeno, dentro de uma pastilha escura. **Pedir SVG ou PNG grande.** |
| **Elemento oculto: a galeria** | Não existe **uma foto sequer** da Fortix. `FaixaFotos` devolve nada com array vazio — não há moldura cinza esperando conteúdo. Já testei os três modos (0, 1–2 e 3+): é só preencher `conteudo.fotos` em `lib/chapters.ts` e a faixa aparece pronta, sem uma linha de layout pra escrever. |

---

## 03 · Choque de Gestão

| o quê | estado |
|---|---|
| Links | ✅ WhatsApp comercial (mesmo do 02 e do 04) e Instagram `@ochoquedegestao`. |
| **Mudou em 29/09** | "Garantir minha vaga" ia pra DM do André. Agora vai pro WhatsApp comercial. |
| Falta | **Página de inscrição própria**, se existir. Hoje a vaga se garante conversando; um formulário converteria melhor. É uma linha (`INSCRICAO_CHOQUE`). |
| **Confirmar: os dois números** | "+400 donos formados" e "8 edições" vieram do teu prompt. **Edição é número fácil de conferir:** se a próxima for a 9ª e o site disser 8, ele envelhece sozinho. |
| **Elemento oculto: fotos** | Não existe foto nenhuma do evento, nem a pasta `public/choque`. Aqui isso não deixou buraco: **o crachá assume o papel de mídia**. Se aparecerem fotos, elas entram sem tirar o crachá — o slot `assinatura` está ocupado pela faixa de xadrez, então o lugar natural é o `FaixaFotos`, já pronto. |

---

## 04 · Cursos e palestras

| o quê | estado |
|---|---|
| Links | ✅ WhatsApp comercial. |
| **Elemento oculto: o mini-briefing** ⚠️ | **Os quatro campos (tipo de evento, cidade, data, público) sumiram da tela em 29/09.** Eles montavam a mensagem do WhatsApp, e isso só funciona em link `wa.me/<número>`: o short link comercial não aceita `?text=`. Tentei resolver o short link pra achar o número — ele responde sem revelar telefone. **Com o número da Thais isso volta sozinho:** troca `WHATSAPP_COMERCIAL` por `https://wa.me/55DDDNNNNNNNNN` e o briefing reaparece, sem tocar em mais nada. |
| **Confirmar: a citação da HBR** | "Empresas com culturas fortes têm desempenho financeiro até 3x maior", atribuída à **Harvard Business Review**, veio do teu prompt. É a única afirmação do site que aponta pra um terceiro conhecido, e a mais fácil de alguém ir conferir. **Vale ter o artigo guardado antes de mandar pro André.** |
| Foto a trocar | `andre-salao.webp` é o André num salão montado — público certo (quem contrata vê a sala), mas **não é ele falando**. **Não existe foto dele no palco que já não esteja em uso:** as duas que existem são o hero e o capítulo 01. Uma foto de palco de outro evento melhoraria este capítulo na hora. |

---

## 05 · YouTube

| o quê | estado |
|---|---|
| Links | ✅ **Resolvido em 29/09.** Canal `youtube.com/@andresantovisu`, e o id do canal (`UCdtJQBrJ40GZ7BLLq5RMOfg`) foi lido na própria página. |
| Vídeos | ✅ **No ar, automáticos.** O capítulo lê o feed RSS público do canal no servidor e mostra o vídeo mais recente grande, mais três num trilho. Atualiza sozinho a cada 6 horas — **nunca mais precisa mexer aqui quando ele postar.** |
| Reserva testada | Se o canal sair do ar, o id mudar ou o feed falhar, o capítulo cai num bloco 16:9 com a foto do André e o CTA. Testado nos quatro estados. |
| A conferir com olho | Os três cartões do trilho mostram o que estiver mais recente no canal. **Se ele postar algo fora do tom, aparece aqui automaticamente** — é o preço de ser automático. |

---

## 06 · Santo Visu

| o quê | estado |
|---|---|
| Links | ✅ **Resolvido em 29/09.** "Agendar horário" vai pro site da barbearia (`barbearia-site-mu.vercel.app`), que já tem seletor de unidade, horário e agendamento. |
| **Mudou em 29/09** | Os **cartões de endereço e a tabela de horários saíram** a teu pedido: o capítulo apresenta a barbearia, não é a ficha dela. Entrou uma intro no lugar. O `Unidades.tsx` continua no projeto, pronto e testado, se um dia voltar. |
| Foto | **Existe uma foto só do salão**, e não é descuido: o próprio site da barbearia registra que o acervo tem uma foto de ambiente. Por isso o mosaico mostra uma foto grande e parada em vez de repetir a mesma em laço — repetição anuncia que só existe uma. |
| **Elemento pronto e ocioso** | Com **6 fotos ou mais** o mosaico vira três faixas correndo em sentidos opostos com parallax; com 2 a 5, uma faixa em laço. Os três modos foram testados. É só preencher `conteudo.fotos`. |

---

## Vale pro site inteiro

- **Medição (Vercel Analytics).** Todo CTA dispara `cta_click` com o capítulo e
  o nome do botão. ⚠️ **Evento personalizado é recurso de plano pago na
  Vercel** — no Hobby o `track()` não registra. As visitas de página contam
  normalmente. Se for ficar no Hobby, os eventos ficam mudos até mudar de
  plano.
- **UTM.** Todo link externo sai com
  `utm_source=site_andre&utm_medium=link_bio&utm_campaign=<capítulo>`. **Duas
  exceções:** WhatsApp (pedido teu — e lá não mede nada mesmo) e a DM do
  Instagram. A DM é decisão minha: é o fallback de todo CTA sem destino, o
  ganho seria zero (DM não reporta origem) e um parâmetro estranho quebrando
  ali derrubaria vários botões de uma vez.
- **Preview de link.** ✅ Imagem 1200×630 gerada no build, com a foto do André
  no mesmo tratamento do hero e as seis cores em fila. `NEXT_PUBLIC_SITE_URL`
  já aponta pro alias limpo. **Cuidado se um dia mudar o domínio:** o
  `metadataBase` é lido no BUILD, então trocar a variável exige `--force` —
  sem ele a Vercel reaproveita o build e o `og:image` continua apontando pro
  domínio velho. Aconteceu em 29/09: o cartão saiu apontando pro domínio com
  sufixo do time, que responde 302 (SSO), ou seja **preview sem imagem**.
  Conferido depois: `og:image` em `ecossistema-andre.vercel.app`, 200
  image/png, 308 KB.
- **`robots: noindex, nofollow` está ativo** e deve continuar até o André
  aprovar. Isso **não atrapalha o preview do WhatsApp**: `noindex` fala com
  buscador, e quem monta o cartão é o crawler da rede social.
- **Domínio e deploy.** ✅ No ar em **https://ecossistema-andre.vercel.app**
  (projeto `ecossistema-andre`, time `sotalia-hub`, publicado em 29/09).
  Como em todo site da casa, **só o alias limpo é público**: o
  `ecossistema-andre-sotalia-hub.vercel.app` responde 302 e cai no SSO do
  time — nunca mandar esse pro lead. Sem domínio próprio ainda.
  Publicar de novo: `npx vercel deploy --prod` de dentro de `site/`.
- **Git.** O projeto ainda não tem repositório próprio — os outros sites de
  cliente daqui têm repo privado individual. ⚠️ **O `vercel link` conectou o
  projeto ao `Leandro-Alan/SotaliaHUB` sozinho**, por causa do `.git` da pasta
  mãe, com Root Directory `.`. Só que a pasta `clientes/andre-alves/` está
  **untracked** nesse repo: o site não existe lá. Na prática um push pro
  SotaliaHUB tenta buildar a raiz da Sotalia como se fosse Next e **falha** —
  e build que falha não substitui produção, então o que está no ar não corre
  risco. Mas gera deploy vermelho à toa. Desconectar com
  `npx vercel git disconnect` de dentro de `site/`, ou resolver de vez dando
  repo próprio ao projeto.
- **`npm audit`** aponta 1 vulnerabilidade alta no **sharp** (libvips/libheif).
  É `devDependency`, só roda nos scripts de imagem e **não vai pro site**. O
  conserto é `npm audit fix --force`, que sobe o sharp de major — vale fazer
  com calma, não antes de mandar.
- **Paleta × cores reais.** O verde do Barbers Vale, o azul do Choque e o
  contexto da Fortix medidos nos arquivos divergem da paleta definida. Detalhe
  em `CLAUDE.md`, seção "Cores medidas nos arquivos reais".
- **Confirmar as categorias com o André.** Elas aparecem no índice do hero **e**
  na etiqueta de cada capítulo: Mentoria, Certificação, Palestras, Conteúdo,
  Barbearia.
- **`andre-3.webp`** (a arte setentista "seu negócio muda, quando você muda!")
  **não é foto documental.** Confirmar se é material dele antes de usar. Nunca
  apresentar como foto do André.

---

## 🔴 ABERTO — o que o Leandro viu em 29/09 e ainda não está resolvido

Feedback dado depois da entrega, olhando nas três telas reais dele. **A tela de
27" está perfeita; o problema é notebook e celular.**

### 1. ✅ O capítulo não SEGURA — resolvido, e o número que faltava

**Duas tentativas erradas antes.** O `scroll-snap` quebrou o site (prende a
rolagem no topo, capítulo alto deixa de rolar até o fim, rodapé inalcançável)
e foi revertido no mesmo dia — **não tentar de novo**, está registrado no topo
do `globals.css`. Depois um piso de 12% da tela, que era pequeno demais.

**O que faltava era medir.** A 1900×870: o capítulo ficava parado e completo
por **104px**, contra **870px de transição** — 89% da rolagem com dois
capítulos na tela ao mesmo tempo. Uma volta da rodinha do mouse (~100px) comia
a janela inteira. Daí "nenhum slide para completo".

**A transição não dá pra encurtar**: o capítulo que entra percorre de
`y = tela` até `y = 0`, e isso é uma tela de rolagem por definição do sticky.
Então a única moeda que faz o capítulo parar é dar a ele a mesma quantidade:
`--respiro = excesso + uma tela`.

Medido depois, a 1900×870: **870px parado por capítulo (50% da rolagem)**, os
sete cabendo em 1,00 tela, documento de 7598 → 11728px. O ritmo inteiro sai de
**um número só**, em `ChapterStack.tsx` — se ficar longo demais, é ali.

### 2. ✅ Botão do YouTube — era o MESMO problema

Medido: nada tapando (`elementFromPoint` devolvia o próprio botão), href certo,
o clique trocava a capa pelo iframe e o vídeo tocava. **O botão nunca esteve
quebrado** — com 89% da rolagem em transição, quando a pessoa mirava no play o
Santo Visu já estava subindo por cima. Com a janela de 870px o capítulo fica
parado e o play fica à mão. Conferido no print.

### 3. ✅ Cursos e palestras cortado, e sem botão

Medido: 1033px numa viewport de 870, com o CTA "Solicitar proposta" em y=915 —
ou seja, o botão **existia** e nunca aparecia sem rolar. Capítulo de venda sem
botão à vista é capítulo quebrado. Ganhou bloco em
`(min-width: 900px) and (max-height: 899px)` e fecha em 1,00 tela. Os 163px
saíram das duas pontas do padding, do gap e do teto da tela de projetor
(30rem, bem abaixo dos 604px reais do arquivo — sem ampliar nada).
**Nenhum corte de conteúdo.**

### 3b. ✂️ Faixa do lema do capítulo 03 — REMOVIDA

Saiu a pedido do Leandro ("está perdida aqui, não gostei"), e ele confirmou
que o Choque pode ficar sem elemento-assinatura: "tudo bem não ter, a ideia é
ser slim". `FaixaLema.tsx` continua no projeto, sem uso, como o `Unidades.tsx`.

### 3c. 🔴 Santo Visu diz "Três unidades" e são CINCO

`lib/chapters.ts`, subtítulo do capítulo 06. O Leandro apontou em 29/09 e
pediu pra deixar pra depois — mas é **erro factual numa demo de prospecção**,
uma linha, e não pode ir pro André assim.

### 3d. ⏳ Notebook/celular apertado — reaberto, sem medição

As duas mexidas de padding do primeiro lote foram revertidas (eram chute).
O Palestras foi resolvido com medição; os outros seis capítulos agora fecham
em 1,00 tela a 870 de altura, então o "apertado" pode ter ido junto.
**Celular ainda não foi visto por ninguém.**

### 4. ✅ O rail do topo travou na cor do hero — CONSERTADO

**A suspeita anotada aqui estava errada, e dá pra descartar lendo a fonte do
GSAP.** Não era o `ScrollTrigger.refresh()` medir antes do layout assentar:
escrita de `style` é visível pra qualquer leitura de layout na mesma tarefa de
JS, e `refresh()` força layout síncrono ao medir. Não existe janela de "layout
não assentado" dentro de um mesmo frame. E `refresh()` ainda reencena as
bordas no fim (`_updateAll(2)`, `ScrollTrigger.js:562`) — os callbacks só ficam
mudos durante o refresh do próprio gatilho (`stateChanged && !_refreshing`,
linhas 1689 e 1751). Os 7 gatilhos também estavam configurados certo:
`isToggle` e `callbacks` (linhas 967 e 972) não dependem de animação.

**A causa é de desenho, não de timing:** o `ativo` era a *soma* de eventos de
borda — `onEnter` somava, `onLeaveBack` subtraía — e nada nunca reconciliava
esse número com o que estava pintado na tela. Estado assim não se corrige: uma
borda perdida ou repetida prende o rail naquele índice pra sempre. E no celular
as bordas se mexem no meio da rolagem, porque `--respiro` é calculado sobre
`window.innerHeight` e a barra de endereço do iOS muda essa altura enquanto a
pessoa rola — cada mudança reescreve a posição dos sete marcos. **É isso que
explica o sintoma ser só no celular:** na tela de 27" `resize` nunca dispara,
as bordas nunca se mexem, e lá o rail funciona.

**O conserto tira a classe inteira do problema** em vez de remendar a borda: os
7 ScrollTriggers saíram e o capítulo ativo passou a ser lido da geometria viva
a cada quadro — é o de maior índice cujo topo já passou da linha de 55% da
tela. Mesma linha de antes (`"top 55%"`), mesmo comportamento documentado, mas
sem medida em cache: um quadro perdido se conserta no quadro seguinte. De
brinde, o rodapé parou de zerar o rail.

Fechado com `tsc`, `eslint` e `build`.

> **Nota de processo:** o Leandro pediu pra eu **não abrir o Playwright por
> conta própria** — ele confere nas telas dele. Fechar com `tsc`, `eslint` e
> `build`, medir com script quando der, e entregar.
