"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import MarcaChoque from "./MarcaChoque";
import { useAoAtivar } from "./ChapterStack";

/**
 * O elemento-assinatura do capitulo 03: o cracha de participante.
 *
 * Ele tambem e a MIDIA do capitulo. Nao existe uma foto sequer do Choque de
 * Gestao (nem a pasta public/choque existe), e a regra da demo proibe moldura
 * cinza esperando conteudo — entao o cracha ocupa o lugar que a foto ocuparia.
 *
 * O nome digitado aqui muda tambem o rotulo do CTA, que mora em outro slot do
 * <Chapter>. Por isso existe o ProvedorNome: e o unico jeito de dois nos
 * distantes da arvore dividirem o mesmo estado sem que um componente de
 * capitulo vire cliente inteiro. O provedor nao emite DOM nenhum, entao o
 * marco e a secao continuam irmaos diretos de .pilha — a mecanica do
 * empilhamento nao muda.
 *
 * Nada e salvo, nada e enviado: o campo nao esta dentro de <form> e nao existe
 * nenhuma chamada de rede. E adorno de demo, e so isso.
 *
 * O balanco dispara por `useAoAtivar`: toda vez que o Choque vira o capitulo
 * ativo (deck de desktop ou snap do celular), balanca UMA vez e para — sem
 * loop continuo. Antes disso disparava por ScrollTrigger, atrelado ao marco
 * encostar no topo; sem pin nem scroll continuo essa geometria deixou de
 * existir.
 */

const MAX = 24;

type Contexto = { nome: string; escrever: (valor: string) => void };
const ContextoNome = createContext<Contexto | null>(null);

export function ProvedorNome({ children }: { children: ReactNode }) {
  const [nome, setNome] = useState("");
  const valor = useMemo<Contexto>(
    () => ({ nome, escrever: (v) => setNome(v.slice(0, MAX)) }),
    [nome]
  );
  return <ContextoNome.Provider value={valor}>{children}</ContextoNome.Provider>;
}

export function useNome(): Contexto {
  const ctx = useContext(ContextoNome);
  if (!ctx) throw new Error("useNome precisa estar dentro de <ProvedorNome>.");
  return ctx;
}

export default function Cracha({ nome, lema }: { nome: string; lema?: string }) {
  const { escrever } = useNome();
  const raiz = useRef<HTMLDivElement>(null);

  // "Choque de Gestão" -> "Choque" + "de Gestão". O cracha traz a marca escrita
  // como ela e no logo (CHOQUE em caixa alta, o resto em caixa baixa), mas o
  // texto continua saindo de lib/chapters.ts: aqui so parte em dois.
  const [primeira, ...resto] = nome.split(" ");
  const complemento = resto.join(" ");

  // O balanco e curto e elastico, e o pivo e o ALTO DO CORDAO (50% 0, no
  // CSS): girar pelo centro do cartao pareceria uma placa girando, nao uma
  // coisa pendurada. Dispara toda vez que o Choque vira o capitulo ativo —
  // e so isso: uma vez, sem loop.
  useAoAtivar("choque", () => {
    const pendura = raiz.current?.querySelector<HTMLElement>("[data-pendura]");
    if (!pendura || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      pendura,
      { rotation: -7 },
      // periodo 0.45: com o 0.32 que eu tinha posto antes a oscilacao
      // inteira cabia em ~400ms e ninguem via balanco nenhum, so um
      // tremido. Aqui da pra contar tres idas e voltas.
      { rotation: 0, duration: 1.4, ease: "elastic.out(1, 0.45)", overwrite: true }
    );
  });

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    const inclina = el.querySelector<HTMLElement>("[data-inclina]");
    const secao = el.closest<HTMLElement>("[data-capitulo]");
    if (!inclina || !secao) return;

    const mm = gsap.matchMedia();

    // A inclinacao segue o mouse, entao so existe onde ha mouse. Ela mora num
    // no SEPARADO do balanco: os dois escrevem rotacao, e no mesmo elemento um
    // apagaria o outro.
    mm.add(
      "(min-width: 900px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
      () => {
        const girar = gsap.quickTo(inclina, "rotation", { duration: 0.6, ease: "power3.out" });
        const mover = (e: PointerEvent) => {
          const caixa = secao.getBoundingClientRect();
          const desvio = (e.clientX - (caixa.left + caixa.width / 2)) / (caixa.width / 2);
          girar(gsap.utils.clamp(-1, 1, desvio) * 5);
        };

        secao.addEventListener("pointermove", mover);
        return () => {
          secao.removeEventListener("pointermove", mover);
          gsap.set(inclina, { clearProps: "rotate,transform" });
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div className="cq-cracha" ref={raiz}>
      <div className="cq-pendura" data-pendura>
        <span className="cq-cordao" aria-hidden="true" />
        <span className="cq-presilha" aria-hidden="true" />

        <div className="cq-inclina" data-inclina>
          <div className="cq-cartao">
            <p className="cq-marca">
              <MarcaChoque className="cq-simbolo" />
              <span className="cq-marca-texto">
                <b>{primeira}</b>
                {complemento && <span>{complemento}</span>}
              </span>
            </p>

            {lema && <p className="cq-lema">{lema}</p>}

            <label className="cq-campo">
              <span className="cq-campo-rotulo">Participante</span>
              <input
                className="cq-campo-input"
                type="text"
                placeholder="Seu nome aqui"
                maxLength={MAX}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="done"
                onChange={(e) => escrever(e.target.value)}
                // fecha o teclado do celular: sem <form>, Enter nao faria nada
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </label>

            <span className="cq-cartao-xadrez" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
