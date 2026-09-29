"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useAoAtivar } from "./ChapterStack";

/**
 * O selo da barbearia, em duas peças: o ANEL (o texto circular "SANTO VISU ·
 * BARBEARIA") e o MIOLO (o frade). Quando o capítulo vira ativo, o anel gira
 * devagar e para com um pequeno overshoot — como um carimbo assentando.
 *
 * **Só o anel gira; o frade fica em pé.** Girar o selo inteiro faria o rosto
 * dele dar voltas, que é o contrário de um carimbo. As duas peças existirem
 * separadas é o que torna isso possível — elas vêm assim de
 * `scripts/selo-santovisu.mjs`.
 *
 * Os dois SVG entram como `mask-image`, nunca como `<img>`: a cor sai do
 * `--fg` do capítulo. Mesmo arranjo da marca do Barbers Vale no 01.
 *
 * Disparava por ScrollTrigger (`top 75%` do marco). Sem pin nem scroll de
 * pagina no deck de desktop essa geometria deixou de existir — agora e
 * `useAoAtivar`, que dispara toda vez que a Barbearia vira o capitulo ativo,
 * nos dois sentidos, igual o `onEnter`/`onEnterBack` de antes.
 */
export default function SeloSantoVisu({
  variante = "marca",
}: {
  /**
   * "marca"  = a marca d'agua grande sangrando na borda (desktop).
   * "inline" = o selo pequeno ao lado do texto de apoio (celular). No celular
   *            a marca d'agua caia no pe do capitulo, atras do botao, e o
   *            Leandro pediu o selo ao lado de "Onde tudo comecou". O CSS mostra
   *            um ou outro, nunca os dois.
   */
  variante?: "marca" | "inline";
}) {
  const raiz = useRef<HTMLSpanElement>(null);

  useAoAtivar("barbearia", () => {
    const anel = raiz.current?.querySelector<HTMLElement>("[data-anel]");
    if (!anel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      anel,
      { rotation: -108 },
      {
        rotation: 0,
        duration: 1.6,
        // `back.out` passa um pouco do zero e volta: e exatamente o
        // "pequeno overshoot" do carimbo. Com `power3.out` ele so
        // desacelera e assenta morto.
        ease: "back.out(1.25)",
        overwrite: true,
      }
    );
  });

  return (
    // `role="img"` com nome: o selo e a assinatura da casa e leitor de tela
    // precisa saber que ele esta ali. As duas peças sozinhas nao dizem nada.
    // <span>, nao <div>: a variante inline mora dentro do <p> do subtitulo
    <span
      className={`ba-selo ba-selo--${variante}`}
      ref={raiz}
      role="img"
      aria-label="Selo da Santo Visu Barbearia"
    >
      <span className="ba-selo-anel" data-anel aria-hidden="true" />
      <span className="ba-selo-miolo" aria-hidden="true" />
    </span>
  );
}
