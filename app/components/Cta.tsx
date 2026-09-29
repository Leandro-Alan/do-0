"use client";

import type { ReactNode } from "react";
import { cliqueNoCta, comUtm } from "@/lib/rastreio";

/**
 * O botao do site. Largura total no celular, 56px de altura minima (alvo de
 * toque confortavel), cor do capitulo, seta e estado de toque visivel.
 *
 * `href` nunca chega vazio: quem resolve isso e `ou()` em lib/chapters.ts.
 *
 * **E client component so por causa da medicao.** O `href` sai carimbado no
 * HTML do servidor (o `comUtm` roda nos dois lados e da o mesmo resultado,
 * entao nao ha divergencia na hidratacao); o `onClick` so avisa o analytics.
 * Sem JS o botao continua um `<a>` com o destino certo — a medicao e que se
 * perde, e ela nunca pode ser condicao pro clique funcionar.
 */
export default function Cta({
  href,
  capitulo,
  nome,
  children,
  variante = "principal",
  externo = true,
}: {
  href: string;
  /** id do capitulo. Vai no `utm_campaign` e no evento. */
  capitulo: string;
  /**
   * Nome ESTAVEL do botao pro relatorio — nao o rotulo visivel, que muda
   * sozinho (o do 01 vira "Conhecer o Barbers Vale" depois do evento, o do 03
   * vira "Garantir a vaga de [nome]"). Rotulo variavel viraria um evento novo
   * a cada variacao.
   */
  nome: string;
  children: ReactNode;
  variante?: "principal" | "secundario";
  externo?: boolean;
}) {
  return (
    <a
      href={comUtm(href, capitulo)}
      className={`cta${variante === "secundario" ? " cta--secundario" : ""}`}
      onClick={() => cliqueNoCta(capitulo, nome)}
      {...(externo ? { target: "_blank", rel: "noopener" } : null)}
    >
      <span>{children}</span>
      <Seta />
    </a>
  );
}

function Seta() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 9h11M10 4.5 14.5 9 10 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
