/**
 * Medição: de onde veio o clique, e pra onde ele foi.
 *
 * Duas coisas separadas, e elas não dependem uma da outra:
 *
 * 1. **UTM no link que sai daqui** — pra quem RECEBE o clique saber que ele
 *    veio deste site. Serve pra LP do Barbers Vale, pro Instagram de cada
 *    marca, pro canal. Não precisa de JS: está no `href` do HTML.
 * 2. **`track('cta_click')`** — pro Leandro saber, aqui, qual capítulo
 *    converte. Precisa de JS e do Vercel Analytics.
 *
 * Nada aqui grava nada no navegador de quem visita: não há cookie, não há
 * localStorage, não há id de pessoa.
 */

import { track } from "@vercel/analytics";

/** Fixos, pedidos pelo Leandro. O `campaign` é o id do capítulo. */
const FONTE = "site_andre";
const MEIO = "link_bio";

/**
 * Onde NÃO carimbar UTM. Duas famílias, por motivos diferentes:
 *
 * - **WhatsApp** (`wa.me`, `api.whatsapp.com`): pedido do Leandro. E faz
 *   sentido — o parâmetro que importa lá é o `?text=`, e pendurar utm ao lado
 *   dele não mede nada: WhatsApp não tem analytics de origem.
 * - **`ig.me`, a DM do Instagram**: decisão minha, e vale dizer por quê. Esse
 *   é o link de FALLBACK de todo CTA sem destino preenchido — hoje são cinco.
 *   Se um dia o ig.me engasgar com parâmetro desconhecido, cinco CTAs quebram
 *   de uma vez. E o ganho seria zero: DM de Instagram não reporta origem pra
 *   ninguém. Risco não-nulo, retorno nulo. Quando os links de verdade
 *   estiverem preenchidos, isto deixa de importar sozinho.
 */
const SEM_UTM = [/(^|\.)wa\.me$/i, /(^|\.)api\.whatsapp\.com$/i, /(^|\.)ig\.me$/i];

/**
 * Carimba `utm_source`, `utm_medium` e `utm_campaign` no link.
 *
 * Devolve o link ORIGINAL, sem tocar, quando: não é http(s) (âncora interna,
 * `mailto:`, `tel:`), o destino está na lista de fora, ou já existe um
 * `utm_source` — quem escreveu o link à mão mandou mais que a gente.
 *
 * Nunca lança: URL torta volta como veio, e o CTA continua funcionando.
 */
export function comUtm(href: string, capitulo: string): string {
  if (!href) return href;

  try {
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") return href;
    if (SEM_UTM.some((padrao) => padrao.test(url.hostname))) return href;
    if (url.searchParams.has("utm_source")) return href;

    url.searchParams.set("utm_source", FONTE);
    url.searchParams.set("utm_medium", MEIO);
    url.searchParams.set("utm_campaign", capitulo);
    return url.toString();
  } catch {
    // href relativo ou malformado: sai como entrou
    return href;
  }
}

/**
 * Um clique num CTA.
 *
 * `capitulo` é o id do capítulo (`barbersvale`, `choque`…) e `cta` é o nome
 * ESTÁVEL do botão — não o rótulo visível, que muda sozinho: o do capítulo 01
 * vira "Conhecer o Barbers Vale" depois do evento e o do 03 vira "Garantir a
 * vaga de [nome]". Rótulo variável viraria um evento novo a cada variação e o
 * relatório não fecharia.
 *
 * Silencioso por definição: `track` não faz nada fora da Vercel (em `next
 * dev`, por exemplo) e não quebra o clique se falhar.
 */
export function cliqueNoCta(capitulo: string, cta: string) {
  try {
    track("cta_click", { chapter: capitulo, cta });
  } catch {
    // medição nunca pode atrapalhar a navegação
  }
}
