"use client";

import type { ReactNode } from "react";
import { cliqueNoCta, comUtm } from "@/lib/rastreio";

/**
 * Link que sai do site e é medido, mas **não é um `<Cta>`** — não tem a cara
 * de botão. Hoje: o ícone de Instagram do hero, o "Como chegar" de cada
 * unidade e o "Ver o canal" do bloco de reserva do 05.
 *
 * Existe pra que os componentes que o usam continuem **de servidor**. Só este
 * nó vira cliente; `Hero`, `Unidades` e `TelaYouTube` seguem renderizando no
 * servidor, e o `TreatedImage` que eles carregam não vai parar no bundle do
 * navegador por causa de um `onClick`.
 *
 * O `href` já sai carimbado no HTML do servidor (o `comUtm` dá o mesmo
 * resultado nos dois lados, então não há divergência na hidratação). Sem JS o
 * link continua funcionando: o que se perde é a medição, e ela nunca pode ser
 * condição pro clique.
 */
export default function LinkExterno({
  href,
  capitulo,
  nome,
  className,
  children,
  ...resto
}: {
  href: string;
  /** id do capítulo. Vai no `utm_campaign` e no evento. */
  capitulo: string;
  /** nome estável do link no relatório */
  nome: string;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  return (
    <a
      href={comUtm(href, capitulo)}
      className={className}
      target="_blank"
      rel="noopener"
      onClick={() => cliqueNoCta(capitulo, nome)}
      {...resto}
    >
      {children}
    </a>
  );
}
