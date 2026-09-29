"use client";

import { useEffect, useRef } from "react";
import Cta from "./Cta";
import { faseEvento, type Evento } from "@/lib/chapters";

/**
 * O CTA principal do capitulo 01. Mesmo link sempre; o que muda e o rotulo:
 * antes e no dia ele vende ingresso, depois do evento ele convida a conhecer.
 *
 * Os dois rotulos vem no HTML e o cliente apenas esconde um. E de proposito:
 * trocar texto por estado do React daria diferenca entre o que o servidor
 * escreveu e o que o cliente renderiza, e o React reclama disso. Assim o
 * servidor manda o rotulo certo pra hora do build, e numa build velha o
 * cliente corrige sozinho na hidratacao.
 */
export default function CtaIngresso({
  evento,
  href,
  capitulo,
  rotulo,
  rotuloDepois,
}: {
  evento: Evento;
  href: string;
  capitulo: string;
  rotulo: string;
  rotuloDepois: string;
}) {
  const caixa = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const passou = faseEvento(evento) === "passou";
    const antes = el.querySelector<HTMLElement>("[data-antes]");
    const depois = el.querySelector<HTMLElement>("[data-depois]");
    if (antes) antes.hidden = passou;
    if (depois) depois.hidden = !passou;
  }, [evento]);

  const passou = faseEvento(evento) === "passou";

  // `nome="ingresso"` fixo: o rotulo visivel troca sozinho quando o evento
  // passa, e o relatorio precisa somar os dois como o MESMO botao.
  return (
    <Cta href={href} capitulo={capitulo} nome="ingresso">
      <span ref={caixa}>
        <span data-antes hidden={passou}>
          {rotulo}
        </span>
        <span data-depois hidden={!passou}>
          {rotuloDepois}
        </span>
      </span>
    </Cta>
  );
}
