"use client";

import type { CSSProperties } from "react";
import type { Capitulo } from "@/lib/chapters";
import { chapters } from "@/lib/chapters";
import { useCapituloAtivo } from "./ChapterStack";

/**
 * A peca principal do hero: as seis frentes em lista, com numero, nome,
 * categoria e uma amostra da cor de fundo do capitulo.
 *
 * Continua sendo `<a href="#id">` de verdade — funciona sem JS, o teclado
 * chega nele, o navegador mostra o destino. O onClick troca a navegacao pelo
 * `ir()` do `ChapterStack`: no deck de desktop nao ha mais scroll de pagina
 * pra fazer o `href` sozinho resolver (html/body ficam `overflow: hidden`), e
 * fora do deck o `ir()` cai no mesmo `scrollIntoView` suave de antes.
 */
export default function Indice({ destinos }: { destinos: Capitulo[] }) {
  const { ir } = useCapituloAtivo();

  const clicar = (evento: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    evento.preventDefault();
    const indice = chapters.findIndex((c) => c.id === id);
    if (indice === -1) return;
    ir(indice);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="indice" aria-label="Frentes do André">
      {destinos.map((destino) => (
        <a
          key={destino.id}
          href={`#${destino.id}`}
          className="indice-linha"
          data-entrada="item"
          onClick={(e) => clicar(e, destino.id)}
          style={
            {
              "--linha-bg": destino.paleta.bg,
              "--linha-fg": destino.paleta.fg,
            } as CSSProperties
          }
        >
          <span className="indice-num" aria-hidden="true">
            {destino.numero}
          </span>
          <span className="indice-nome">{destino.nome}</span>
          <span className="indice-cat">{destino.categoria}</span>
          <span className="indice-cor" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
