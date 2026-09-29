"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/**
 * A entrada do hero. So envolve: o conteudo inteiro e renderizado no servidor
 * pelo <Hero>, e este arquivo nao sabe o que tem dentro — so procura os
 * `data-entrada`.
 *
 * Duas decisoes que nao sao estetica:
 *
 * 1. `useLayoutEffect`. O GSAP precisa gravar o estado inicial ANTES da
 *    primeira pintura. Com `useEffect` o navegador pinta o hero pronto e
 *    depois o esconde pra animar: da um piscada feia.
 *
 * 2. `opacity`, nunca `autoAlpha`. `autoAlpha` usa `visibility: hidden`, que
 *    tira o elemento do alcance do toque. O indice precisa estar clicavel
 *    desde o primeiro quadro, mesmo enquanto ainda esta invisivel.
 *
 * Registro de plugin do GSAP continua sendo so do ChapterStack. Aqui nao tem
 * ScrollTrigger: e uma linha do tempo que toca uma vez, no load.
 */
const useEfeitoVisual = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function EntradaHero({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useEfeitoVisual(() => {
    const el = raiz.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from('[data-entrada="foto"]', { opacity: 0, y: 22, duration: 0.65 }, 0)
        .from(
          '[data-entrada="linha"] > span',
          { yPercent: 110, duration: 0.7, stagger: 0.08 },
          0.1
        )
        .from(
          '[data-entrada="texto"]',
          { opacity: 0, y: 12, duration: 0.45, stagger: 0.06 },
          0.28
        )
        .from(
          '[data-entrada="item"]',
          { opacity: 0, y: 14, duration: 0.42, stagger: 0.06 },
          0.36
        );
    }, el);

    return () => ctx.revert();
  }, []);

  // `display: contents` pra que esta div nao entre no layout: o .hero precisa
  // continuar sendo filho direto do .palco pra esticar com flex: 1.
  return (
    <div ref={raiz} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
