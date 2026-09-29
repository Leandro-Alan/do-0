import type { CSSProperties, ReactNode } from "react";
import type { Capitulo } from "@/lib/chapters";
import { TOTAL } from "@/lib/chapters";

/**
 * O esqueleto de um capitulo. E igual em todos: o que muda e a paleta (vem em
 * CSS vars, daqui) e o elemento-assinatura (vem pelo slot `assinatura`).
 *
 * Devolve DOIS nos: um marco de altura zero e a secao. O marco fica em fluxo
 * normal e nao gruda, entao e ele que o ScrollTrigger consegue medir — a secao
 * e sticky e devolve posicao errada.
 *
 * Slot vazio nao renderiza nada. E a regra da demo: dado faltando some, nunca
 * vira caixa cinza.
 *
 * `corpo` e a UNICA saida do esqueleto, e existe por causa do capitulo 00: a
 * capa nao e um capitulo de negocio, e um indice. Quem passa `corpo` troca so
 * o miolo — marco, secao, palco e paleta continuam vindo daqui, que e o que
 * impede a mecanica do empilhamento de existir em dois lugares.
 *
 * `.dim`: o escurecimento de quem fica coberto no deck de desktop. Existe em
 * TODO capitulo, sempre no DOM, opacidade 0 em repouso — o `ChapterStack` que
 * acende (0 -> 0.55) via GSAP quando outro capitulo entra por cima. E um
 * elemento a parte (nao um filtro no `.palco`) porque a regra do projeto
 * proibe `filter`/`backdrop-filter` animado: mexer em opacidade de uma camada
 * solida rende igual e nao pesa a composicao.
 *
 * `rodape`: so a Barbearia usa. No deck de desktop nao ha mais scroll pra
 * alcancar um rodape depois do ultimo capitulo, entao a versao compacta mora
 * AQUI DENTRO — visivel so no deck (globals.css decide); no snap do celular
 * ela fica escondida e o <Rodape> de verdade, em fluxo depois da pilha,
 * continua sendo o caminho normal.
 */
export default function Chapter({
  cap,
  ultimo = false,
  titulo,
  subtitulo,
  provas,
  midia,
  corpo,
  ctaPrincipal,
  ctaSecundario,
  assinatura,
  rodape,
}: {
  cap: Capitulo;
  /** o ultimo capitulo nao e coberto por ninguem no snap do celular */
  ultimo?: boolean;
  titulo?: ReactNode;
  subtitulo?: ReactNode;
  provas?: ReactNode;
  midia?: ReactNode;
  /** substitui o miolo padrao inteiro. So o hero usa. */
  corpo?: ReactNode;
  ctaPrincipal?: ReactNode;
  ctaSecundario?: ReactNode;
  assinatura?: ReactNode;
  /** faixa compacta so pro deck de desktop. So a Barbearia usa. */
  rodape?: ReactNode;
}) {
  const p = cap.paleta;

  const vars = {
    "--bg": p.bg,
    "--fg": p.fg,
    "--muted": p.muted,
    "--accent": p.accent,
    "--accent-fg": p.accentFg,
    "--duo-escuro": p.duo.escuro,
    "--duo-claro": p.duo.claro,
    "--titulo-wdth": `${cap.tituloWdth}%`,
  } as CSSProperties;

  const temCta = Boolean(ctaPrincipal || ctaSecundario);

  return (
    <>
      {/* O id de ancora vive AQUI, e nao na secao. Ancora pra elemento sticky
          nao funciona: quando ele esta grudado no topo, o navegador le
          rect.top = 0, conclui que ja esta na tela e nao rola nada. O marco
          fica em fluxo normal, entao e o alvo certo. */}
      <div className="marco" id={cap.id} data-marco aria-hidden="true" />

      <section
        data-capitulo
        data-id={cap.id}
        aria-labelledby={`${cap.id}-titulo`}
        className={`capitulo${ultimo ? " capitulo--ultimo" : ""}`}
        style={vars}
      >
        <div className="palco">
          {midia}

          {corpo ?? (
          <div className="palco-conteudo">
            <p className="etiqueta">
              {cap.numero !== "00" && (
                <>
                  <b>
                    {cap.numero} / {String(TOTAL).padStart(2, "0")}
                  </b>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{cap.categoria}</span>
            </p>

            <h2 className="titulo" id={`${cap.id}-titulo`}>
              {titulo ?? cap.nome}
            </h2>

            {subtitulo && <p className="subtitulo">{subtitulo}</p>}

            {provas && <div className="flex flex-wrap gap-x-10 gap-y-6 pt-2">{provas}</div>}

            {temCta && (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                {ctaPrincipal}
                {ctaSecundario}
              </div>
            )}
          </div>
          )}

          {assinatura}

          {rodape && <div className="rodape-embutido">{rodape}</div>}

          <span className="dim" aria-hidden="true" />
        </div>
      </section>
    </>
  );
}
