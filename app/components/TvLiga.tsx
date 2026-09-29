"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useAoAtivar } from "./ChapterStack";

/**
 * A TV ligando: quando o capitulo 05 vira ativo, um risco horizontal se abre
 * em tela cheia e as scanlines apagam junto. ~400ms, UMA vez so.
 *
 * O overlay nasce invisivel no CSS e quem acende e o cliente. Se o JS nao
 * rodar, ou se a pessoa pediu menos movimento, ele simplesmente nunca aparece
 * — e o capitulo continua inteiro, porque isto e enfeite e nao conteudo.
 *
 * Antes disparava por ScrollTrigger (`onEnter`, `once: true`) preso ao marco
 * encostar no topo. Sem pin nem scroll de pagina no deck de desktop essa
 * geometria deixou de existir — `useAoAtivar` ja e disparo unico por
 * natureza (so acontece quando `ativo` MUDA pra este capitulo), entao aqui
 * nao precisa nem de flag de controle.
 */
export default function TvLiga() {
  const raiz = useRef<HTMLDivElement>(null);

  useAoAtivar("youtube", () => {
    const overlay = raiz.current;
    if (!overlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const risco = overlay.querySelector<HTMLElement>("[data-risco]");
    const linhas = overlay.querySelector<HTMLElement>("[data-linhas]");
    if (!risco || !linhas) return;

    const linha = gsap.timeline();
    // o risco nasce como uma fresta no meio da tela e se abre
    linha
      .set(overlay, { opacity: 1 })
      .fromTo(
        risco,
        { scaleY: 0.012, opacity: 1 },
        { scaleY: 1, opacity: 0, duration: 0.3, ease: "power2.out" }
      )
      .fromTo(linhas, { opacity: 0.5 }, { opacity: 0, duration: 0.3, ease: "none" }, 0.1)
      .set(overlay, { opacity: 0 });
  });

  return (
    <div className="yt-tv" ref={raiz} aria-hidden="true">
      <span className="yt-tv-linhas" data-linhas />
      <span className="yt-tv-risco" data-risco />
    </div>
  );
}
