/**
 * Fonte unica de verdade do site.
 *
 * A ORDEM DESTE ARRAY E A ORDEM DO SITE. Mexeu aqui, mexeu na pagina, no
 * ProgressRail, na numeracao das etiquetas e na cor da barra do navegador.
 *
 * Nenhuma cor, nenhum link e nenhum texto de capitulo pode nascer dentro de um
 * componente. Se voce escreveu um "#" num .tsx de capitulo, esta errado.
 */

/** DM do Instagram do Andre. Todo link que faltar cai aqui. */
export const DM = "https://ig.me/m/andresantovisu";

/** Link informado, ou a DM. Nunca devolve string vazia, entao CTA nunca quebra. */
export const ou = (valor?: string) => (valor && valor.trim()) || DM;

/** true quando o Leandro ainda nao preencheu o link (pra decidir o rotulo). */
export const faltando = (valor?: string) => !valor || !valor.trim();

export type Paleta = {
  bg: string;
  fg: string;
  /** texto secundario. Medido pra passar AA sobre o bg. */
  muted: string;
  accent: string;
  accentFg: string;
  /**
   * Os dois tons do duotone do TreatedImage: sombra e luz da foto.
   * Em capitulo escuro a sombra e o proprio bg; em capitulo claro a sombra e o
   * fg, senao a foto lava e some.
   */
  duo: { escuro: string; claro: string };
};

export type Prova = {
  /** numero cru, pra contagem animada. Nunca inventar. */
  valor: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
};

export type Foto = {
  src: string;
  alt: string;
  /** dimensoes REAIS do arquivo em public/. Nunca chutar: sao o teto de exibicao. */
  largura: number;
  altura: number;
};

export type Conteudo = {
  titulo?: string;
  subtitulo?: string;
  /** linha menor logo abaixo do titulo: descritor, edicao ou nome secundario. */
  assinatura?: string;
  /** paragrafo de apoio, depois do subtitulo. Menor e mais quieto que ele. */
  texto?: string;
  /** a frase que a marca assina. Hoje so o cracha do capitulo 03 usa. */
  lema?: string;
  /** assuntos que ele palestra. Viram cartoes pequenos. So o 04 usa. */
  temas?: string[];
  /** citacao de destaque COM a fonte. Sem fonte, nao renderiza. So o 04 usa. */
  citacao?: { texto: string; fonte: string };
  /**
   * Mini-briefing que monta a mensagem do WhatsApp. So aparece se o link do
   * CTA for wa.me — em qualquer outro destino nao ha mensagem pra montar, e o
   * capitulo mostra so o botao. So o 04 usa.
   */
  briefing?: {
    /** primeira linha da mensagem, antes dos campos preenchidos */
    saudacao: string;
    campos: {
      /** rotulo na tela: pode ser longo, e ele que tira o medo de errar */
      rotulo: string;
      /** a mesma coisa dentro da mensagem, curta: "Evento: feira" */
      naMensagem: string;
      /** instrucao dentro do campo. NUNCA um valor de exemplo que pareca dado real. */
      dica: string;
    }[];
  };
  /** o logo do capitulo, quando existe arquivo dele. */
  marca?: Foto;
  foto?: Foto;
  /** galeria. Vazia ou ausente = nenhuma faixa renderiza. */
  fotos?: Foto[];
  provas?: Prova[];
  ctaPrincipal?: {
    rotulo: string;
    href: string;
    /** troca o rotulo quando o evento do capitulo ja passou. Mesmo link. */
    rotuloDepois?: string;
    /**
     * Rotulo quando o visitante escreve o nome dele na tela. "{nome}" e
     * trocado pelo que ele digitou. Mesmo link. So o capitulo 03 usa.
     */
    rotuloComNome?: string;
  };
  ctaSecundario?: { rotulo: string; href: string };
  /**
   * Onde o negocio fica, de verdade. Array vazio ou ausente = o bloco de
   * endereco nao renderiza. So o 06 usa, e ele tem TRES.
   */
  unidades?: Unidade[];
  /** Tabela de funcionamento. Ausente = nao renderiza. So o 06 usa. */
  horarios?: { dias: string; horas: string }[];
};

export type Unidade = {
  nome: string;
  /** o que a pessoa le: rua, numero e bairro */
  endereco: string;
  /** shopping/galeria e loja, quando houver. Linha menor. */
  local?: string;
  /**
   * Link OFICIAL da ficha no Google Maps, quando existir. Sem ele, o
   * `comoChegar()` monta uma busca pelo endereco — que funciona, mas cai numa
   * lista em vez da ficha.
   */
  mapa?: string;
};

/**
 * O destino do "Como chegar". Prefere a ficha oficial; sem ela, busca pelo
 * endereco escrito. Nunca devolve vazio, entao o link nunca quebra.
 */
export const comoChegar = (u: Unidade) =>
  u.mapa?.trim() ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${u.nome} ${u.endereco}`
  )}`;

export type Evento = {
  nome: string;
  /** dia do evento, ISO. Depois dele o selo do hero some sozinho. */
  data: string;
  /** como a data aparece escrita na tela */
  rotulo: string;
  /** nome da edicao, pra linha em caixa alta espacada. Ex: "A EVOLUÇÃO" */
  edicao?: string;
  local?: string;
  cidade?: string;
  /**
   * Instante da abertura das portas, COM fuso escrito. E o alvo da contagem
   * regressiva. Sem isso a contagem cai na virada do dia.
   */
  inicio?: string;
};

/** "antes" = ainda vai rolar · "hoje" = e hoje · "passou" = acabou */
export type FaseEvento = "antes" | "hoje" | "passou";

/**
 * Em que pe esta o evento, sempre ancorado no horario de BRASILIA — nao no
 * fuso de quem abriu nem no do servidor da Vercel. Quem abrir de Lisboa as 3h
 * da manha do dia 27 ainda ve "e hoje", porque no Brasil ainda e dia 26.
 *
 * A pagina e estatica, entao o servidor congela essa resposta na hora do
 * build. Por isso quem depende dela confere de novo no cliente (ver
 * SeloEvento, Contagem e CtaIngresso): numa build velha o componente se
 * corrige na hidratacao em vez de mentir sobre a data.
 */
export const faseEvento = (evento?: Evento, agora: Date = new Date()): FaseEvento => {
  if (!evento) return "passou";
  const abertura = new Date(evento.inicio ?? `${evento.data}T00:00:00-03:00`).getTime();
  const fimDoDia = new Date(`${evento.data}T23:59:59-03:00`).getTime();
  const t = agora.getTime();
  if (t < abertura) return "antes";
  if (t <= fimDoDia) return "hoje";
  return "passou";
};

/** quanto falta pra abertura, em ms. Negativo depois que comeca. */
export const faltaPara = (evento: Evento, agora: Date = new Date()) =>
  new Date(evento.inicio ?? `${evento.data}T00:00:00-03:00`).getTime() - agora.getTime();

export const eventoVigente = (evento?: Evento, agora: Date = new Date()) =>
  faseEvento(evento, agora) !== "passou";

export type Capitulo = {
  id: string;
  /** "00" no hero; "01".."06" no resto. Vira "01 / 06" na etiqueta. */
  numero: string;
  categoria: string;
  nome: string;
  /** eixo wdth do Archivo no titulo. Faixa util: 62 a 125. */
  tituloWdth: number;
  paleta: Paleta;
  /** cor da barra do navegador enquanto o capitulo esta ativo. */
  themeColor: string;
  /** links crus, como o Leandro preencheu. Vazio = usar ou(). */
  links: Record<string, string>;
  /** so entra aqui o que for verdade. Campo ausente = elemento nao renderiza. */
  conteudo?: Conteudo;
  /** data marcada. Alimenta o selo do hero, que expira sozinho. */
  evento?: Evento;
};

// Os dois destinos do capitulo 01 moram aqui em cima porque sao lidos duas
// vezes: uma em `links` (a lista crua de destinos do capitulo) e outra no
// rotulo do CTA. Uma constante, duas leituras — nunca duas copias do endereco.
const LP_BARBERSVALE = "https://lp.barbersvale.com.br/";
const IG_BARBERSVALE = "https://instagram.com/barbersvale";

/**
 * O WHATSAPP COMERCIAL — e ele atende TRES capitulos: Fortix (02), Choque de
 * Gestao (03) e Cursos e palestras (04). O Leandro conferiu no Linktree atual:
 * os tres caem na mesma pessoa (Thais), e nao no direct do Andre.
 *
 * E um SHORT LINK de WhatsApp Business (`api.whatsapp.com/message/<codigo>`),
 * nao um `wa.me/<numero>`. A diferenca tem consequencia:
 *
 * - O numero fica escondido atras do codigo. Tentei resolver o short link pra
 *   descobrir; ele responde 200 sem revelar telefone nenhum.
 * - **Ele nao aceita `?text=`.** Quem define a mensagem de abertura e a conta
 *   comercial, la dentro do WhatsApp. Por isso o "Ola, quero ser FORTIX" que o
 *   capitulo 02 mandava deixou de existir, e por isso o mini-briefing do
 *   capitulo 04 nao aparece mais: sem `?text=`, os quatro campos nao teriam
 *   pra onde levar o que a pessoa escreve, e campo que nao leva nada a lugar
 *   nenhum e pior que campo nenhum.
 *
 * COMO TRAZER O MINI-BRIEFING DE VOLTA: basta o numero da Thais. Com ele isto
 * vira `https://wa.me/55DDDNNNNNNNNN` e o briefing volta sozinho — o
 * ConviteParaPalestrar so olha pro formato do link. Esta no TODO.md.
 */
const WHATSAPP_COMERCIAL =
  "https://api.whatsapp.com/message/VN6GVW3FQ5CSC1?autoload=1&app_absent=0";

// O capitulo 03 nao tem pagina de inscricao; ele cai no mesmo WhatsApp
// comercial dos outros dois, que e pra onde o Linktree de hoje manda. Se um dia
// existir formulario proprio, e trocar esta linha.
const INSCRICAO_CHOQUE = WHATSAPP_COMERCIAL;
const IG_CHOQUE = "https://instagram.com/ochoquedegestao";


/**
 * Capitulo 05. As DUAS coisas do YouTube, e elas sao independentes:
 *
 * - `CANAL_YOUTUBE` e a pagina do canal. So o CTA usa. Vazio = o CTA cai na DM.
 * - `CHANNEL_ID_YOUTUBE` e o id tecnico ("UC" + 22 caracteres), que e o que o
 *   feed RSS publico pede. Vazio ou invalido = o capitulo nao mostra video
 *   nenhum e cai no bloco de reserva (foto + play + CTA), que e uma tela
 *   inteira e legitima, nao um buraco.
 *
 * O id NAO esta na URL do canal quando ela e `/@handle`. Pra achar: abrir o
 * canal, "Compartilhar canal" > "Copiar id do canal"; ou ver o `channelId` no
 * codigo-fonte da pagina. Colar o @handle aqui nao funciona de proposito — ver
 * `ehChannelId` em lib/youtube.ts.
 */
const CANAL_YOUTUBE = "https://www.youtube.com/@andresantovisu";
// Lido na propria pagina do canal (@andresantovisu -> "André Santo Visu"). O
// feed publico responde com 15 videos.
const CHANNEL_ID_YOUTUBE = "UCdtJQBrJ40GZ7BLLq5RMOfg";

/**
 * Capitulo 06. O botao de agendar leva pro SITE da barbearia, e nao pra um
 * WhatsApp — decisao do Leandro em 29/09.
 *
 * Faz sentido pra alem da preferencia: a Santo Visu tem TRES unidades, cada
 * uma com telefone proprio, e o site ja resolve isso com seletor de unidade,
 * horario e agendamento. Mandar pra la e mandar pro lugar que decide; um
 * WhatsApp so obrigaria a pessoa a escolher unidade aqui, sem contexto.
 *
 * E por isso este capitulo tem UM CTA so. O secundario seria "Conhecer a
 * barbearia" com o mesmo destino, e dois botoes pro mesmo lugar e ruido.
 */
const SITE_SANTOVISU = "https://barbearia-site-mu.vercel.app/";

/**
 * O link do canal que ja abre a caixa "Inscrever-se".
 *
 * So faz sentido em URL do YouTube: pendurar `?sub_confirmation=1` no fallback
 * da DM do Instagram seria lixo na barra de endereco de um destino que nao tem
 * nada a ver. Por isso a funcao devolve "" quando nao ha canal — e ai quem
 * decide o destino e o `ou()`, como em todo o resto do site.
 */
const comInscricao = (canal: string) => {
  const limpo = canal.trim();
  if (!limpo) return "";
  return `${limpo}${limpo.includes("?") ? "&" : "?"}sub_confirmation=1`;
};

export const chapters: Capitulo[] = [
  {
    id: "hero",
    numero: "00",
    // o hero nao mostra numero, so a categoria — entao ela nao pode repetir o nome
    categoria: "Jacareí · SP",
    nome: "André Alves",
    tituloWdth: 112,
    paleta: {
      bg: "#0D0C0A",
      fg: "#F1EBDF",
      muted: "#A79D8E",
      accent: "#D9A928",
      accentFg: "#0D0C0A",
      duo: { escuro: "#0D0C0A", claro: "#D9A928" },
    },
    themeColor: "#0D0C0A",
    links: {
      instagram: "https://instagram.com/andresantovisu",
    },
    conteudo: {
      assinatura: "André Santo Visu",
      subtitulo:
        "Eventos, mentoria, consultoria e conteúdos que irão alavancar sua carreira e empresa.",
      // A melhor foto que existe do Andre. Nao ha recorte sem fundo do material
      // dele, entao o hero usa a foto inteira com degrade forte pro breu e
      // duotone quente — o caminho alternativo previsto no CLAUDE.md.
      foto: {
        src: "/fotos/andre-4.webp",
        alt: "André Alves falando ao microfone num palco.",
        largura: 1800,
        altura: 1202,
      },
    },
  },
  {
    id: "barbersvale",
    numero: "01",
    categoria: "Evento",
    nome: "Barbers Vale",
    // o mais condensado do site: o titulo do evento e enorme e precisa caber
    tituloWdth: 68,
    paleta: {
      bg: "#04140C",
      fg: "#EAF7EF",
      muted: "#93AE9F",
      accent: "#19E08C",
      accentFg: "#04140C",
      duo: { escuro: "#04140C", claro: "#19E08C" },
    },
    themeColor: "#04140C",
    links: {
      // A LP propria do evento. O capitulo e teaser: leva pra la, nao repete.
      lp: LP_BARBERSVALE,
      instagram: IG_BARBERSVALE,
    },
    // Tudo lido no flyer oficial (public/fotos/flyer-barbersvale-2026.webp).
    // A hora da abertura (08:00) veio do prompt do Leandro, nao do flyer —
    // confirmar com o Andre antes de mandar. Ver TODO.md.
    evento: {
      nome: "Barbers Vale",
      data: "2026-10-26",
      rotulo: "26 de outubro",
      edicao: "A EVOLUÇÃO",
      local: "Teatro Ariano Suassuna",
      cidade: "Jacareí-SP",
      inicio: "2026-10-26T08:00:00-03:00",
    },
    conteudo: {
      titulo: "BARBERS VALE 2K26",
      subtitulo: "O maior evento para barbeiros do Vale do Paraíba.",
      foto: {
        src: "/fotos/andre-auditorio.webp",
        alt: "André Alves no palco do teatro, com a plateia vazia atrás.",
        largura: 763,
        altura: 767,
      },
      ctaPrincipal: {
        rotulo: "Garantir meu ingresso",
        href: LP_BARBERSVALE,
        rotuloDepois: "Conhecer o Barbers Vale",
      },
      ctaSecundario: {
        rotulo: "Ver o evento no Instagram",
        href: IG_BARBERSVALE,
      },
    },
  },
  {
    id: "fortix",
    numero: "02",
    categoria: "Mentoria",
    nome: "Fortix",
    // o mais expandido do site. O titulo e uma palavra curta em caixa alta com
    // tracking aberto: sem largura ele nao enche a linha e o capitulo esvazia
    tituloWdth: 122,
    paleta: {
      bg: "#E3E3E0",
      fg: "#111214",
      muted: "#56585B",
      accent: "#2A2C31",
      accentFg: "#E3E3E0",
      duo: { escuro: "#111214", claro: "#E3E3E0" },
    },
    themeColor: "#E3E3E0",
    links: {
      whatsapp: WHATSAPP_COMERCIAL,
      instagram: "https://instagram.com/fortixclub",
    },
    conteudo: {
      titulo: "FORTIX",
      assinatura: "Clube de mentoria para donos de barbearia",
      subtitulo: "Onde donos fortes e corajosos estão.",
      texto:
        "Mentoria exclusiva para donos de barbearia que querem escalar com acompanhamento, estrutura e em comunidade.",
      // unico arquivo que existe da Fortix. 150x150 e com fundo escuro proprio,
      // entao so aparece pequeno e dentro de uma pastilha grafite — ver CLAUDE.md
      marca: {
        src: "/marca/fortix.webp",
        alt: "Logo da Fortix.",
        largura: 150,
        altura: 150,
      },
      // NAO EXISTE NENHUMA FOTO DA FORTIX. Enquanto este array estiver vazio a
      // faixa nao renderiza — nada de moldura cinza esperando foto. Assim que o
      // Andre mandar, e so preencher aqui: com 1 ou 2 vira uma foto grande, com
      // 3 ou mais vira a faixa arrastavel. Ver TODO.md.
      fotos: [],
      provas: [
        {
          prefixo: "Quase R$ ",
          valor: 2,
          sufixo: " mi",
          rotulo: "faturados com a Santo Visu no último ano",
        },
        { prefixo: "+", valor: 20, rotulo: "barbearias mentoradas" },
      ],
      ctaPrincipal: {
        rotulo: "Quero ser FORTIX",
        href: WHATSAPP_COMERCIAL,
      },
      ctaSecundario: {
        rotulo: "Ver o clube no Instagram",
        href: "https://instagram.com/fortixclub",
      },
    },
  },
  {
    id: "choque",
    numero: "03",
    categoria: "Certificação",
    nome: "Choque de Gestão",
    // largura NORMAL: e o unico capitulo que nao mexe no eixo wdth. O peso
    // (900, no CSS) e o tracking negativo e que dao o tom institucional.
    tituloWdth: 100,
    paleta: {
      bg: "#141C7E",
      fg: "#FFFFFF",
      muted: "#B4B9E3",
      accent: "#FFFFFF",
      accentFg: "#141C7E",
      duo: { escuro: "#141C7E", claro: "#FFFFFF" },
    },
    themeColor: "#141C7E",
    links: {
      inscricao: INSCRICAO_CHOQUE,
      instagram: IG_CHOQUE,
    },
    conteudo: {
      // `titulo` fica de fora de proposito: seria a copia exata de `nome`, e o
      // <Chapter> ja cai nele. O cracha tambem le `nome` e so parte em duas.
      subtitulo: "A gestão muda quando você muda.",
      texto: "Certificação para donos e gestores de barbearia.",
      // a variante que vai impressa no cracha do participante
      lema: "O seu negócio muda quando você muda.",
      // NAO EXISTE FOTO NENHUMA DO CHOQUE — nem pasta public/choque. Por isso
      // o cracha assume o papel de midia do capitulo. Ver TODO.md.
      provas: [
        { prefixo: "+", valor: 400, rotulo: "donos formados" },
        { valor: 8, rotulo: "edições" },
      ],
      ctaPrincipal: {
        rotulo: "Garantir minha vaga",
        href: INSCRICAO_CHOQUE,
        rotuloComNome: "Garantir a vaga de {nome}",
      },
      ctaSecundario: {
        rotulo: "Ver no Instagram",
        href: IG_CHOQUE,
      },
    },
  },
  {
    id: "palestras",
    numero: "04",
    categoria: "Palestras",
    nome: "Cursos e Palestras",
    // largura normal, como o 03. Os dois se separam pelo PESO: o 03 e 900
    // institucional, este e 500 editorial. Ver "Tipografia" no CLAUDE.md.
    tituloWdth: 100,
    paleta: {
      bg: "#EEE4D4",
      fg: "#2E1C13",
      muted: "#6E5445",
      accent: "#6B3A22",
      accentFg: "#EEE4D4",
      duo: { escuro: "#2E1C13", claro: "#EEE4D4" },
    },
    themeColor: "#EEE4D4",
    links: {
      contato: WHATSAPP_COMERCIAL,
    },
    conteudo: {
      // caixa baixa no "palestras", diferente do `nome`: aqui o titulo e
      // frase de revista, nao rotulo de indice
      titulo: "Cursos e palestras",
      subtitulo: "Me chame para palestrar no seu evento.",
      temas: ["Gestão de barbearia", "Cultura organizacional", "Liderança e equipe"],
      // NAO ha numero nenhum do Andre neste capitulo, de proposito: nao existe
      // dado confirmado sobre palestras dele. O 3x abaixo e afirmacao da HBR,
      // nao resultado dele — e por isso vem com a fonte colada.
      citacao: {
        texto: "Empresas com culturas fortes têm desempenho financeiro até 3x maior.",
        fonte: "Harvard Business Review",
      },
      // Recorte 4:3 de andre-2.webp, gerado por scripts/recorte-salao.mjs: sem
      // a seta do carrossel do Instagram e ja na proporcao da tela de projetor.
      foto: {
        src: "/fotos/andre-salao.webp",
        alt: "André Alves em pé num salão de eventos montado, com o telão ao fundo.",
        largura: 604,
        altura: 453,
      },
      ctaPrincipal: {
        rotulo: "Solicitar proposta",
        href: WHATSAPP_COMERCIAL,
      },
      briefing: {
        saudacao: "Olá, quero convidar o André para palestrar.",
        campos: [
          {
            rotulo: "Tipo de evento",
            naMensagem: "Evento",
            dica: "Feira, curso…",
          },
          { rotulo: "Cidade", naMensagem: "Cidade", dica: "Onde vai ser" },
          { rotulo: "Data aproximada", naMensagem: "Data", dica: "Mês e ano" },
          { rotulo: "Público estimado", naMensagem: "Público", dica: "Quantas pessoas" },
        ],
      },
    },
  },
  {
    id: "youtube",
    numero: "05",
    categoria: "Conteúdo",
    nome: "YouTube",
    tituloWdth: 118,
    paleta: {
      bg: "#0E0E0E",
      fg: "#F5F5F5",
      muted: "#9B9B9B",
      accent: "#FF1F3D",
      // branco sobre esse vermelho da 3,81:1 (reprova AA). O breu da 5,07:1.
      accentFg: "#0E0E0E",
      // O vermelho e a LUZ do duotone, nao a sombra: e a tinta do capitulo, e
      // o prompt pediu a foto em vermelho. A forca fica baixa no componente
      // (0.46) justamente porque aqui o acento e saturadissimo — ver CLAUDE.md.
      duo: { escuro: "#0E0E0E", claro: "#FF1F3D" },
    },
    themeColor: "#0E0E0E",
    links: {
      canal: CANAL_YOUTUBE,
      channelId: CHANNEL_ID_YOUTUBE,
    },
    conteudo: {
      titulo: "No YouTube",
      subtitulo: "Gestão de barbearia, sem filtro.",
      // A reserva do capitulo: entra SO quando nao ha video pra mostrar (sem
      // channelId, ou feed fora do ar). E a unica foto do acervo em que ele
      // aparece explicando alguma coisa dentro de uma barbearia — que e
      // exatamente o assunto do canal. As de palco ja sao o hero e o 01.
      foto: {
        src: "/fotos/andre-1.webp",
        alt: "André Alves explicando algo dentro de uma barbearia.",
        largura: 647,
        altura: 857,
      },
      ctaPrincipal: {
        rotulo: "Inscrever-se no canal",
        href: comInscricao(CANAL_YOUTUBE),
      },
    },
  },
  {
    id: "barbearia",
    numero: "06",
    categoria: "Barbearia",
    nome: "Santo Visu",
    tituloWdth: 95,
    paleta: {
      bg: "#E2AF1C",
      fg: "#22150E",
      muted: "#584010",
      accent: "#22150E",
      accentFg: "#E2AF1C",
      duo: { escuro: "#22150E", claro: "#E2AF1C" },
    },
    themeColor: "#E2AF1C",
    links: {
      agendamento: SITE_SANTOVISU,
      site: SITE_SANTOVISU,
    },
    conteudo: {
      titulo: "Santo Visu",
      subtitulo: "A barbearia mais charmosa da cidade.",
      /**
       * O Leandro tirou os enderecos daqui em 29/09: este capitulo e a
       * apresentacao da barbearia, nao a ficha dela. Quem quiser endereco,
       * horario ou agendar cai no site da Santo Visu pelo botao — e la isso ja
       * existe, com seletor de unidade.
       *
       * "Cinco unidades" fica, porque nao e endereco: e o tamanho da coisa, e
       * e o fato mais forte que o capitulo tem. Corrigido em 29/09: eram tres
       * quando este texto foi escrito, e o Leandro apontou que a rede cresceu
       * pra cinco — nao e chute, e ele quem confirmou o numero atual.
       *
       * O componente `Unidades.tsx` continua no projeto, pronto e testado: se
       * um dia isto mudar de ideia, e so devolver `unidades` e `horarios` aqui.
       */
      texto:
        // a quebra de linha e pedido do Leandro: "Cinco unidades" abre linha propria
        "Onde tudo começou, e onde ele continua.\nCinco unidades em Jacareí, corte e barba com hora marcada.",
      /**
       * EXISTE UMA FOTO SO do salao — nao e descuido, e o acervo inteiro: o
       * proprio site da barbearia registra "so existe 1 foto de ambiente".
       * Com 6 ou mais o mosaico vira tres faixas correndo em sentidos opostos;
       * com 1, uma foto grande e parada. Ver MosaicoBarbearia.tsx.
       */
      fotos: [
        {
          src: "/barbearia/salao-luminoso.webp",
          alt: "Salão da Santo Visu: parede de tijolo, cadeiras de barbeiro em couro e o selo da casa aceso na parede.",
          largura: 802,
          altura: 802,
        },
      ],
      ctaPrincipal: {
        rotulo: "Agendar horário",
        href: SITE_SANTOVISU,
      },
    },
  },
];

/** Total que aparece na etiqueta: "01 / 06". O hero (00) nao conta. */
export const TOTAL = chapters.filter((c) => c.numero !== "00").length;

export const porId = (id: string) => chapters.find((c) => c.id === id);
