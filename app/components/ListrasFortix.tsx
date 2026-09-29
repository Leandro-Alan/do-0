"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useAoAtivar } from "./ChapterStack";

/**
 * O elemento-assinatura do capitulo 02: as tres listras do logo, grandes,
 * entrando pela lateral quando o capitulo vira ativo.
 *
 * O angulo NAO foi escolhido no olho: foi medido no proprio arquivo do logo
 * (assets-originais/marca/fortix.jpg) por script, isolando as barras e rodando
 * PCA em cada uma. As duas maiores deram 37,5 e 38,0 graus, e o teste de canto
 * confirmou que elas DESCEM da esquerda pra direita. Dai o --fx-angulo: 38deg.
 *
 * A rotacao mora no container e a animacao mexe so no x de cada filha — assim
 * o deslocamento acontece no eixo da propria listra, e nao na horizontal da
 * tela.
 *
 * Era scrub continuo (ScrollTrigger, ligado a rolagem): sem pin nem scroll de
 * pagina no deck de desktop essa geometria deixou de existir. Virou entrada
 * de UMA vez, disparada por `useAoAtivar` toda vez que a Fortix fica ativa —
 * cada listra desliza da borda ate o lugar, cada uma num tempo levemente
 * diferente pra nao parecer uma imagem so entrando.
 */
export default function ListrasFortix() {
  const raiz = useRef<HTMLDivElement>(null);

  useAoAtivar("fortix", () => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const listras = gsap.utils.toArray<HTMLElement>("[data-listra]", el);
    // Curso em fracao da LARGURA DA TELA, nao em xPercent: as tres listras
    // tem larguras diferentes, entao xPercent daria deslocamentos
    // desproporcionais — na pratica duas saiam de vez da secao.
    const curso = [0.34, 0.2, 0.46];

    gsap.fromTo(
      listras,
      { x: (i) => window.innerWidth * (curso[i] ?? 0.3) },
      { x: 0, duration: 0.9, ease: "power3.out", stagger: 0.06, overwrite: true }
    );
  });

  return (
    <div className="fx-listras" ref={raiz} aria-hidden="true">
      <div className="fx-listra fx-listra--1" data-listra />
      <div className="fx-listra fx-listra--2" data-listra />
      <div className="fx-listra fx-listra--3" data-listra />
    </div>
  );
}
