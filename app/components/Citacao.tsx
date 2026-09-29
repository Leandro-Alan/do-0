"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useAoAtivar } from "./ChapterStack";

/**
 * O elemento-assinatura do capitulo 04: a citacao enorme, revelada palavra por
 * palavra quando o capitulo vira ativo.
 *
 * A DIRECAO IMPORTA. As palavras nascem OPACAS no CSS e e o cliente que as
 * apaga pra 0.15 antes de reacender — nunca o contrario. Se o estado inicial
 * fosse 0.15 no CSS, quem entrasse sem JS, com reduced-motion, ou antes da
 * hidratacao leria uma citacao fantasma. Assim o pior caso e legivel.
 *
 * Era scrub continuo (ScrollTrigger, opacidade presa a posicao de rolagem).
 * Sem pin nem scroll de pagina no deck essa geometria deixou de existir —
 * agora e um `stagger` de tempo, disparado por `useAoAtivar` toda vez que
 * Cursos e palestras vira o capitulo ativo. Mesma leitura palavra a palavra,
 * sem depender de rolagem.
 */
export default function Citacao({ texto, fonte }: { texto: string; fonte: string }) {
  const raiz = useRef<HTMLElement>(null);
  const palavras = texto.split(/\s+/).filter(Boolean);

  useAoAtivar("palestras", () => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const alvos = gsap.utils.toArray<HTMLElement>("[data-palavra]", el);
    if (alvos.length === 0) return;

    gsap.fromTo(
      alvos,
      { opacity: 0.15 },
      { opacity: 1, duration: 0.4, ease: "none", stagger: 0.045, overwrite: true }
    );
  });

  return (
    <figure className="pl-citacao" ref={raiz}>
      <blockquote className="pl-citacao-texto">
        {palavras.map((palavra, i) => (
          // o espaco vive DENTRO do span pra que a frase continue uma frase:
          // quebra de linha natural, selecao inteira e leitura correta
          <span className="pl-palavra" data-palavra key={`${palavra}-${i}`}>
            {palavra}
            {i < palavras.length - 1 ? " " : ""}
          </span>
        ))}
      </blockquote>
      <figcaption className="pl-citacao-fonte">{fonte}</figcaption>
    </figure>
  );
}
