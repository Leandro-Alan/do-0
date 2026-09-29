"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAoAtivar } from "./ChapterStack";

/**
 * O fundo do capitulo 01: cordilheira em planos simples + a linha de pulso.
 *
 * As montanhas sao o motivo da marca (o "V" do logo e um pico) e o pulso e
 * literalmente o desenho da marca esticado na largura da secao — por isso o
 * traco tem um vale e um pico agudo, e nao uma onda qualquer.
 *
 * Nenhuma cor aqui: os planos saem de `color-mix` entre `--bg` e `--accent`,
 * que o <Chapter> ja escreveu na secao. Trocar a paleta do capitulo troca a
 * cordilheira junto.
 *
 * Era parallax continuo por scrub (ScrollTrigger preso a rolagem). Sem pin
 * nem scroll de pagina no deck de desktop essa geometria deixou de existir —
 * agora tudo dispara em UMA vez, via `useAoAtivar`, toda vez que o Barbers
 * Vale vira o capitulo ativo: o traco desenha e os tres planos assentam com
 * uma escada de atraso, dando a mesma sensacao de profundidade sem depender
 * de scroll continuo.
 */
export default function Cordilheira() {
  const raiz = useRef<HTMLDivElement>(null);
  const comprimentoRef = useRef(0);

  // Mede o traco uma vez, assim que existe no DOM — precisa saber o
  // comprimento real ANTES do primeiro disparo do useAoAtivar.
  useEffect(() => {
    const pulso = raiz.current?.querySelector<SVGPathElement>("[data-pulso]");
    if (!pulso) return;
    // O traco e desenhado com dash/dashoffset em unidades reais do path, e nao
    // com pathLength=1: o GSAP arredonda numero pra inteiro e, num intervalo
    // de 0 a 1, isso faz o traco pular de escondido pra inteiro num quadro so.
    const comprimento = pulso.getTotalLength();
    comprimentoRef.current = comprimento;
    pulso.style.strokeDasharray = `${comprimento}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pulso.style.strokeDashoffset = "0";
    } else {
      pulso.style.strokeDashoffset = `${comprimento}`;
    }
  }, []);

  useAoAtivar("barbersvale", () => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pulso = el.querySelector<SVGPathElement>("[data-pulso]");
    if (pulso && comprimentoRef.current) {
      gsap.fromTo(
        pulso,
        { strokeDashoffset: comprimentoRef.current },
        {
          strokeDashoffset: 0,
          duration: 1.3,
          ease: "power2.inOut",
          autoRound: false,
          overwrite: true,
        }
      );
    }

    // unidades do viewBox (600 de altura), nao yPercent: cada plano tem uma
    // caixa de tamanho diferente, entao porcentagem daria deslocamentos
    // desproporcionais entre eles e a escada de profundidade sumiria
    const planos = gsap.utils.toArray<SVGGElement>("[data-plano]", el);
    const deslocamento = [22, 40, 64];
    gsap.fromTo(
      planos,
      { y: (i) => deslocamento[i] ?? 22 },
      { y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true }
    );
  });

  return (
    <div className="bv-fundo" ref={raiz} aria-hidden="true">
      <svg
        className="bv-serra"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <g data-plano>
          <path
            className="bv-plano bv-plano--longe"
            d="M0,420 L180,300 L300,362 L470,228 L640,352 L800,268 L980,382 L1150,250 L1300,342 L1440,288 L1440,600 L0,600 Z"
          />
        </g>
        <g data-plano>
          <path
            className="bv-plano bv-plano--meio"
            d="M0,472 L160,382 L340,452 L520,330 L700,432 L880,358 L1060,452 L1240,348 L1440,440 L1440,600 L0,600 Z"
          />
        </g>
        <g data-plano>
          <path
            className="bv-plano bv-plano--perto"
            d="M0,532 L200,462 L380,522 L560,430 L760,512 L960,450 L1160,522 L1340,458 L1440,502 L1440,600 L0,600 Z"
          />
        </g>
      </svg>

      {/* O pulso atravessa a secao na largura. Escala UNIFORME de proposito
          (sem preserveAspectRatio="none"): o traco e desenhado com
          stroke-dashoffset medido por getTotalLength(), que devolve unidades do
          viewBox. Esticar so a largura faria o comprimento medido nao bater com
          o desenhado, e o traco terminaria antes ou sobraria pedaco parado — a
          mesma armadilha que `vector-effect: non-scaling-stroke` cria. A altura
          sai do proprio viewBox, pelo CSS. */}
      <svg className="bv-pulso" viewBox="0 0 1440 240" focusable="false">
        <path
          data-pulso
          className="bv-pulso-traco"
          d="M0,148 H436 L534,206 L690,44 L800,148 H1440"
          fill="none"
        />
      </svg>
    </div>
  );
}
