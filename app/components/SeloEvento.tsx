"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { eventoVigente, chapters, type Evento } from "@/lib/chapters";
import { useCapituloAtivo } from "./ChapterStack";

/**
 * "Próximo evento · Barbers Vale · 26 de outubro", com o ponto pulsando no
 * verde deles. Leva pro capitulo 01.
 *
 * Quem decide se ele aparece e o <Hero>, no servidor. O problema e que a
 * pagina e estatica: o servidor congela essa resposta na hora do build, e uma
 * build de setembro continuaria anunciando o evento em novembro.
 *
 * Por isso o cliente confere de novo na montagem e esconde o selo se a data ja
 * passou. Antes da data nao ha diferenca nenhuma — o selo ja vem no HTML, sem
 * pulo de layout. Depois dela, ele some na hidratacao em vez de mentir.
 *
 * O clique passa pelo `ir()` do ChapterStack, nao pelo `href` puro: no deck de
 * desktop `html`/`body` ficam `overflow: hidden`, e um `href="#id"` sozinho
 * nao tem o que rolar. Fora do deck o `ir()` cai no mesmo scroll suave de
 * sempre, e o `href` continua ali — funciona sem JS e o teclado chega nele.
 */
export default function SeloEvento({
  evento,
  destino,
  cor,
}: {
  evento: Evento;
  destino: string;
  /** cor do ponto que pulsa: o acento do capitulo do evento */
  cor: string;
}) {
  const selo = useRef<HTMLAnchorElement>(null);
  const { ir } = useCapituloAtivo();

  useEffect(() => {
    if (!eventoVigente(evento) && selo.current) selo.current.hidden = true;
  }, [evento]);

  return (
    <a
      ref={selo}
      href={destino}
      className="hero-selo"
      data-entrada="texto"
      style={{ "--pulso": cor } as CSSProperties}
      onClick={(e) => {
        e.preventDefault();
        const indice = chapters.findIndex((c) => `#${c.id}` === destino);
        if (indice !== -1) ir(indice);
      }}
    >
      <span className="hero-pulso" aria-hidden="true" />
      <span>
        Próximo evento <span className="hero-selo-sep">·</span> {evento.nome}{" "}
        <span className="hero-selo-sep">·</span> {evento.rotulo}
      </span>
    </a>
  );
}
