/**
 * Os ultimos videos do canal, lidos do feed RSS PUBLICO do YouTube.
 *
 * Por que RSS e nao a Data API: a API oficial exige chave, e chave exige
 * variavel de ambiente, painel do Google Cloud e cota diaria. O feed
 * `videos.xml` e publico, nao autentica nada e devolve exatamente o que este
 * capitulo precisa — id, titulo e data dos ultimos videos.
 *
 * Roda SO no servidor (o capitulo e Server Component). O navegador de quem
 * abre o site nunca fala com o YouTube antes de tocar no play — a regra do
 * CLAUDE.md sobre iframe e sobre isso.
 *
 * NUNCA LANCA. Feed fora do ar, canal errado, XML estranho, rede caida: tudo
 * devolve `null`, e o capitulo cai no bloco de reserva. Uma promessa
 * rejeitada aqui derrubaria a pagina inteira no build.
 */

/** 6 horas. Literal de proposito: o Next exige valor analisavel estaticamente. */
export const REVALIDA_YOUTUBE = 21600;

/** Corta a espera. Sem isso um feed pendurado trava o `next build`. */
const ESPERA_MS = 6000;

export type Video = {
  id: string;
  titulo: string;
  /** ISO, como veio do feed. Quem formata e a tela. */
  publicado: string;
};

/**
 * Id de canal do YouTube: "UC" + 22 caracteres de base64url.
 *
 * A checagem existe porque o campo e preenchido a mao em `lib/chapters.ts`.
 * Colar o @handle ou a URL inteira no lugar do id monta uma URL que responde
 * 404 — com a checagem, o capitulo nem tenta e vai direto pro bloco de
 * reserva, que e o mesmo destino de qualquer outra falha.
 */
export const ehChannelId = (valor?: string) =>
  typeof valor === "string" && /^UC[\w-]{22}$/.test(valor.trim());

export async function ultimosVideos(channelId?: string): Promise<Video[] | null> {
  if (!ehChannelId(channelId)) return null;

  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
    channelId!.trim()
  )}`;

  try {
    const resposta = await fetch(url, {
      // 6h de cache. A pagina continua estatica; o Next so a regera quando a
      // janela vence e alguem pede. Sem isto o Next 16 nao guarda `fetch`
      // nenhum e cada visita bateria no YouTube.
      next: { revalidate: REVALIDA_YOUTUBE },
      signal: AbortSignal.timeout(ESPERA_MS),
    });
    if (!resposta.ok) return null;

    const videos = extrair(await resposta.text());
    return videos.length > 0 ? videos : null;
  } catch {
    // rede, DNS, timeout, XML gigante: cai no bloco de reserva
    return null;
  }
}

/**
 * Le o XML na mao, sem dependencia.
 *
 * O feed do YouTube tem forma fixa e pequena (15 `<entry>`), entao um parser
 * de XML de verdade seria peso novo no `node_modules` pra ganhar nada. Se o
 * formato mudar, isto devolve lista vazia — que o chamador ja trata como
 * falha. Nunca devolve lixo pra tela.
 */
function extrair(xml: string): Video[] {
  const videos: Video[] = [];

  for (const [, bloco] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = bloco.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    const titulo = bloco.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const publicado = bloco.match(/<published>([^<]+)<\/published>/)?.[1];

    // entry sem id nao vira nada; sem titulo, tambem nao — o trilho e uma
    // lista de titulos, e cartao sem texto e a "caixa cinza" que a demo proibe
    if (!id || !titulo || !publicado) continue;

    videos.push({ id, titulo: destrocar(titulo).trim(), publicado });
  }

  return videos;
}

/** As cinco entidades XML. Titulo de video vive cheio de `&amp;` e `&#39;`. */
function destrocar(texto: string) {
  return texto
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    // por ultimo, senao "&amp;lt;" viraria "<"
    .replace(/&amp;/g, "&");
}

/**
 * A capa do video. `hqdefault` e a UNICA que existe pra todo video — as
 * bonitas (`maxresdefault`, `hq720`) faltam em video antigo ou vertical e
 * devolveriam 404 dentro de um `next/image`, ou seja, quadro quebrado na tela.
 *
 * O arquivo tem 480x360 (4:3) com tarja preta em cima e embaixo. O CSS corta
 * as tarjas com `object-fit: cover` numa caixa 16:9, o que da 480x270 reais —
 * e por isso que a tela grande para em 480px de largura. Ver CLAUDE.md.
 */
export const capa = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const CAPA_LARGURA = 480;
export const CAPA_ALTURA = 360;

/** O embed sem cookie de rastreio, so depois do toque. Nunca no primeiro HTML. */
export const embed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

/** Pagina do video, pra quem abrir num contexto onde o iframe nao roda. */
export const assistir = (id: string) => `https://www.youtube.com/watch?v=${id}`;
