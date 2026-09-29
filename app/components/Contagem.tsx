"use client";

import { useEffect, useRef } from "react";
import { faltaPara, faseEvento, type Evento } from "@/lib/chapters";

/**
 * O elemento-assinatura do capitulo 01: a contagem regressiva.
 *
 * TRES decisoes estruturais:
 *
 * 1. Nasce escondida e quem acende e o cliente. A pagina e estatica: se o
 *    servidor desenhasse os numeros, eles viriam congelados da hora do build e
 *    quem abrisse uma semana depois leria um numero errado por um instante.
 *    O dado que importa (a data, o teatro, a cidade) esta na linha de fatos,
 *    que e renderizada no servidor e nunca depende de JS.
 *
 * 2. Zero estado do React. Um contador de segundo em segundo viraria um render
 *    por segundo da arvore inteira; aqui os digitos sao escritos direto no DOM
 *    por refs. Mesmo motivo do <Proof>.
 *
 * 3. O relogio inteiro e `aria-hidden`. Leitor de tela nao pode ficar
 *    anunciando numero novo a cada segundo — quem le a informacao de verdade e
 *    a linha de fatos. So "É hoje." fica legivel, porque e texto estavel.
 *
 * O alvo e sempre recalculado a partir de Date.now(), entao aba dormindo ou
 * relogio ajustado nao acumulam erro: na volta, o proximo tique ja corrige.
 */

const GRUPOS = [
  { chave: "dias", rotulo: "dias", casas: 3 },
  { chave: "horas", rotulo: "horas", casas: 2 },
  { chave: "min", rotulo: "min", casas: 2 },
  { chave: "seg", rotulo: "seg", casas: 2 },
] as const;

const DURACAO_FLIP = 240;

export default function Contagem({ evento }: { evento: Evento }) {
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;

    const relogio = el.querySelector<HTMLElement>("[data-relogio]");
    const hoje = el.querySelector<HTMLElement>("[data-hoje]");
    if (!relogio || !hoje) return;

    const animar = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const relogios = new WeakMap<Element, ReturnType<typeof setTimeout>>();

    const escrever = (celula: HTMLElement, valor: string) => {
      const atual = celula.firstElementChild as HTMLElement;
      const novo = celula.lastElementChild as HTMLElement;
      if (atual.textContent === valor) return;

      if (!animar) {
        atual.textContent = valor;
        return;
      }

      novo.textContent = valor;
      celula.classList.add("virando");
      clearTimeout(relogios.get(celula));
      relogios.set(
        celula,
        setTimeout(() => {
          atual.textContent = valor;
          celula.classList.remove("virando");
        }, DURACAO_FLIP)
      );
    };

    const pintar = (chave: string, valor: number) => {
      const grupo = el.querySelector<HTMLElement>(`[data-grupo="${chave}"]`);
      if (!grupo) return;
      const celulas = [...grupo.querySelectorAll<HTMLElement>("[data-digito]")];
      const texto = String(Math.max(0, valor)).padStart(celulas.length, "0");
      const excedente = texto.length - celulas.length;

      celulas.forEach((celula, i) => {
        // a casa da centena dos dias so aparece quando existe centena de dia
        const digito = texto[i + Math.max(0, excedente)];
        const sobrando = i === 0 && celulas.length === 3 && valor < 100;
        celula.hidden = sobrando;
        if (!sobrando) escrever(celula, digito ?? "0");
      });
    };

    const tique = () => {
      const fase = faseEvento(evento);

      if (fase === "passou") {
        el.hidden = true;
        return;
      }

      el.hidden = false;
      hoje.hidden = fase !== "hoje";
      relogio.hidden = fase !== "antes";

      if (fase !== "antes") return;

      const restante = Math.max(0, faltaPara(evento));
      const segundos = Math.floor(restante / 1000);
      pintar("dias", Math.floor(segundos / 86400));
      pintar("horas", Math.floor((segundos % 86400) / 3600));
      pintar("min", Math.floor((segundos % 3600) / 60));
      pintar("seg", segundos % 60);
    };

    tique();
    const intervalo = setInterval(tique, 1000);
    // aba que dormiu volta com o numero certo na hora, sem esperar o tique
    document.addEventListener("visibilitychange", tique);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", tique);
    };
  }, [evento]);

  return (
    <div className="bv-contagem" ref={caixa} hidden>
      <p className="bv-hoje" data-hoje hidden>
        É hoje.
      </p>

      <div className="bv-relogio" data-relogio aria-hidden="true" hidden>
        {GRUPOS.map((grupo) => (
          <div className="bv-grupo" data-grupo={grupo.chave} key={grupo.chave}>
            <span className="bv-digitos">
              {Array.from({ length: grupo.casas }, (_, i) => (
                <span className="bv-digito" data-digito key={i}>
                  <span className="bv-d">0</span>
                  <span className="bv-d bv-d--novo">0</span>
                </span>
              ))}
            </span>
            <span className="bv-unidade">{grupo.rotulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
