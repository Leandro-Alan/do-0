"use client";

import { useEffect, useRef } from "react";
import type { Prova } from "@/lib/chapters";

/**
 * Numero grande com contagem animada UMA VEZ SO. Diferente do site da Santo
 * Visu, onde a animacao repete de proposito: aqui repetir daria impressao de
 * numero instavel, e numero e a prova do capitulo.
 *
 * O numero final ja vem no HTML do servidor. Quem zera e conta e o efeito —
 * entao sem JS, e com reduced-motion, o valor certo aparece na hora e nao
 * pisca. A contagem escreve direto no DOM em vez de passar por estado: sao ~54
 * quadros, e cada um viraria um render a toa.
 */
export default function Proof({ prova }: { prova: Prova }) {
  const alvo = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);

  const formatar = (v: number) =>
    `${prova.prefixo ?? ""}${v.toLocaleString("pt-BR")}${prova.sufixo ?? ""}`;

  useEffect(() => {
    const caixa = alvo.current;
    const saida = numero.current;
    if (!caixa || !saida) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    saida.textContent = formatar(0);

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        io.disconnect();

        const duracao = 900;
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / duracao);
          // desaceleracao: chega no numero e para, sem repique
          const eased = 1 - Math.pow(1 - t, 3);
          saida.textContent = formatar(Math.round(prova.valor * eased));
          if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      },
      { threshold: 0.6 }
    );

    io.observe(caixa);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prova.valor, prova.prefixo, prova.sufixo]);

  return (
    <div ref={alvo}>
      <span className="prova-numero" ref={numero}>
        {formatar(prova.valor)}
      </span>
      <span className="prova-rotulo">{prova.rotulo}</span>
    </div>
  );
}
