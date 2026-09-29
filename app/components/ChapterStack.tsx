"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import ProgressRail from "./ProgressRail";
import ThemeColorSync from "./ThemeColorSync";
import { chapters } from "@/lib/chapters";

// UNICO lugar do projeto que registra plugin do GSAP.
gsap.registerPlugin(Observer);

const RAIO = 28;
const OPACIDADE_DIM = 0.55;

/**
 * A mesma condicao em dois formatos: `DECK` decide qual mecanica de
 * navegacao roda (Observer sem scroll, ou snap nativo com scroll de
 * verdade), e tambem decide qual CSS vale — o `globals.css` tem que repetir
 * estes tres numeros (1024, 640) se um dia mudarem aqui.
 */
const DECK = "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

type ContextoAtivo = { ativo: number; ir: (indice: number) => void };
const ContextoCapituloAtivo = createContext<ContextoAtivo>({ ativo: 0, ir: () => {} });

/** O capitulo ativo agora, e a funcao pra navegar — mesma em deck e em snap. */
export function useCapituloAtivo(): ContextoAtivo {
  return useContext(ContextoCapituloAtivo);
}

/**
 * "Toca `cb` toda vez que o capitulo `id` vira o ativo." Substitui os
 * ScrollTriggers de onEnter/onEnterBack que cada componente de assinatura
 * tinha (cracha, TV ligando, selo girando…): sem `--top`/`--respiro` e sem
 * pin, marco e scroll deixam de significar "o capitulo chegou" — quem
 * significa isso agora e o proprio `ativo` do deck/snap.
 *
 * `cb` vive numa ref pra nao precisar entrar no array de dependencias: um
 * componente que passa uma funcao nova a cada render (o caso comum) nao
 * dispara o efeito de novo por isso — so quando `ativo` realmente muda.
 */
export function useAoAtivar(id: string, cb: () => void) {
  const { ativo } = useCapituloAtivo();
  const indice = chapters.findIndex((c) => c.id === id);
  const ref = useRef(cb);

  // a ref acompanha o `cb` mais recente fora do render (escrever ref durante o
  // render e proibido pelas regras de hooks do React 19)
  useEffect(() => {
    ref.current = cb;
  });

  useEffect(() => {
    if (ativo === indice) ref.current();
  }, [ativo, indice]);
}

export default function ChapterStack({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const irRef = useRef<(indice: number) => void>(() => {});

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    const secoes = Array.from(el.querySelectorAll<HTMLElement>("[data-capitulo]"));
    const n = secoes.length;
    const palco = (s: HTMLElement) => s.querySelector<HTMLElement>(".palco")!;
    const dim = (s: HTMLElement) => s.querySelector<HTMLElement>(".dim")!;

    /* No deck os sete capitulos sao caixas fixas empilhadas na MESMA area da
       tela, entao todos cruzam a linha do meio ao mesmo tempo e o
       IntersectionObserver elegeria qualquer um. Enquanto o deck vale, quem
       manda no `ativo` e so o `goTo`. */
    let emDeck = false;

    /* [deck]: capitulo cujo conteudo nao cabe na tela. Vale nos dois modos —
       no deck e no snap do celular cada capitulo tem exatamente uma tela, e o
       que passar disso e cortado sem aviso. Roda no load e a cada resize. */
    let pedidoChecagem = 0;
    const checarCaber = () => {
      cancelAnimationFrame(pedidoChecagem);
      pedidoChecagem = requestAnimationFrame(() => {
        for (const s of secoes) {
          // mede so o que e CONTEUDO (texto, botao, campo, foto com alt) e
          // esta visivel: listras, cordilheira e marcas d'agua sao decoracao
          // que sangra pela borda de proposito, e contar elas daria alarme
          // falso. `scrollHeight` do palco caia exatamente nessa armadilha.
          const p = palco(s);
          const fundo = p.getBoundingClientRect().bottom;
          let excesso = 0;
          for (const el of p.querySelectorAll<HTMLElement>(
            "h1, h2, p, a, button, input, li, blockquote, figcaption, img[alt]:not([alt=''])"
          )) {
            if (el.closest("[aria-hidden='true']") || el.offsetParent === null) continue;
            const r = el.getBoundingClientRect();
            if (r.height === 0) continue;
            excesso = Math.max(excesso, Math.round(r.bottom - fundo));
          }
          if (excesso > 1) {
            console.warn(
              `[deck] ${s.dataset.id} passa da tela em ${excesso}px (${window.innerWidth}x${window.innerHeight})`
            );
          }
        }
      });
    };
    window.addEventListener("resize", checarCaber);
    // depois das fontes, que mudam a altura dos titulos
    document.fonts?.ready.then(checarCaber);
    checarCaber();

    /* ------------------------------------------------------------------
       MOBILE / TABLET / reduced-motion: scroll de verdade, snap nativo.
       Cada capitulo e 100svh no CSS (globals.css cuida disso) — aqui so
       falta saber QUAL esta ativo, pra alimentar o rail e o theme-color.

       IntersectionObserver com rootMargin negativo dos dois lados ("-49%")
       cria uma LINHA fina no meio exato da tela: so o capitulo que cruza
       essa linha entra em interseccao. Como o snap garante que sempre ha
       exatamente um capitulo ocupando a tela inteira, nunca ha ambiguidade
       — ao contrario da conta antiga baseada em posicao de scroll, que
       depedia de --respiro e virava alvo movel no celular.
       ------------------------------------------------------------------ */
    const io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (emDeck || !entrada.isIntersecting) continue;
          const i = secoes.indexOf(entrada.target as HTMLElement);
          if (i !== -1) setAtivo(i);
        }
      },
      { rootMargin: "-49% 0px -49% 0px", threshold: 0 }
    );
    secoes.forEach((s) => io.observe(s));

    const irPorScroll = (indice: number) => {
      const alvo = secoes[indice];
      if (!alvo) return;
      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      alvo.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "start" });
    };

    /* ------------------------------------------------------------------
       DESKTOP: nenhum scroll de pagina. Um gesto (roda do mouse, trackpad,
       toque em tela sensivel) avanca ou volta EXATAMENTE um capitulo — o
       plugin Observer le o gesto bruto, e quem decide o resultado e o
       `goTo` abaixo.

       Cada capitulo e uma caixa `position: fixed; inset: 0` (globals.css),
       todas exatamente sobre a mesma area da tela. Quem aparece e quem some
       e o `.palco` de dentro, arrastado por `yPercent` — 0 em cena, 100
       jogado uma tela inteira pra baixo, fora da area visivel do proprio
       pai. O `.capitulo` (a caixa fixa) nunca se move: so o filho.

       O empilhamento e a ORDEM DO DOCUMENTO (z-index = indice), e ela serve
       nos dois sentidos: indo pra frente, quem entra tem indice maior e sobe
       por cima; voltando, quem SAI tem indice maior e desce por cima de quem
       fica embaixo, desencobrindo ele. Subir quem entra pro topo quebraria a
       volta: o capitulo que desce sumiria atras do outro.
       ------------------------------------------------------------------ */
    let atual = 0;
    let travado = false;

    const preparar = () => {
      gsap.set(
        secoes.map(palco),
        { yPercent: (i: number) => (i === 0 ? 0 : 100), scale: 1, borderRadius: 0 }
      );
      gsap.set(secoes.map(dim), { opacity: 0 });
      secoes.forEach((s, i) => {
        s.style.zIndex = String(i + 1);
      });
      atual = 0;
      setAtivo(0);
    };

    function goTo(alvo: number) {
      const proximo = gsap.utils.clamp(0, n - 1, alvo);
      if (travado || proximo === atual) return;
      travado = true;
      const anterior = atual;
      atual = proximo;
      setAtivo(proximo);

      const tl = gsap.timeline({
        defaults: { duration: 0.85, ease: "power3.inOut" },
        onComplete: () => {
          // absorve a inercia do trackpad: sem essa folga, um gesto longo
          // (Magic Mouse, trackpad) dispara dois ou tres avancos em fila
          gsap.delayedCall(0.35, () => {
            travado = false;
          });
        },
      });

      if (proximo > anterior) {
        tl.to(palco(secoes[anterior]), { scale: 0.92, borderRadius: RAIO }, 0)
          .to(dim(secoes[anterior]), { opacity: OPACIDADE_DIM }, 0)
          .fromTo(palco(secoes[proximo]), { yPercent: 100 }, { yPercent: 0 }, 0)
          .add(() => {
            // capitulos pulados (goTo direto, pelo rail ou pelo indice) ficam
            // no estado final "coberto" sem precisar animar cada um
            for (let i = anterior + 1; i < proximo; i++) {
              gsap.set(palco(secoes[i]), { yPercent: 0, scale: 0.92, borderRadius: RAIO });
              gsap.set(dim(secoes[i]), { opacity: OPACIDADE_DIM });
            }
          });
      } else {
        for (let i = proximo + 1; i < anterior; i++) {
          gsap.set(palco(secoes[i]), { yPercent: 100, scale: 1, borderRadius: 0 });
          gsap.set(dim(secoes[i]), { opacity: 0 });
        }
        tl.to(palco(secoes[anterior]), { yPercent: 100 }, 0)
          .fromTo(
            palco(secoes[proximo]),
            { scale: 0.92, borderRadius: RAIO },
            { scale: 1, borderRadius: 0 },
            0
          )
          .fromTo(dim(secoes[proximo]), { opacity: OPACIDADE_DIM }, { opacity: 0 }, 0);
      }
    }

    let observer: Observer | undefined;
    let aoTeclado: ((e: KeyboardEvent) => void) | undefined;

    // Fora do deck, navegar e rolar. Tem que vir ANTES do `mm.add`: o
    // matchMedia roda o callback na hora quando a tela ja e desktop, e ele
    // troca isto pelo `goTo` — escrito depois, apagaria o `goTo`.
    irRef.current = irPorScroll;

    const mm = gsap.matchMedia();

    mm.add(DECK, () => {
      emDeck = true;
      preparar();

      observer = Observer.create({
        target: window,
        type: "wheel,touch",
        wheelSpeed: -1,
        tolerance: 12,
        preventDefault: true,
        onDown: () => goTo(atual - 1),
        onUp: () => goTo(atual + 1),
      });

      aoTeclado = (e: KeyboardEvent) => {
        // quem esta digitando (o nome no cracha) precisa do espaco e das setas
        const alvo = e.target;
        if (alvo instanceof Element && alvo.closest("input, textarea, select, [contenteditable]")) return;
        if (["ArrowDown", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          goTo(atual + 1);
        } else if (["ArrowUp", "PageUp"].includes(e.key)) {
          e.preventDefault();
          goTo(atual - 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          goTo(0);
        } else if (e.key === "End") {
          e.preventDefault();
          goTo(n - 1);
        }
      };
      window.addEventListener("keydown", aoTeclado);

      irRef.current = goTo;

      return () => {
        emDeck = false;
        observer?.kill();
        window.removeEventListener("keydown", aoTeclado!);
        irRef.current = irPorScroll;
        // limpa TODO estilo inline que o deck escreveu, pra devolver os
        // capitulos ao fluxo normal (sticky/snap) do CSS de fora do deck
        gsap.set(secoes.map(palco), { clearProps: "all" });
        gsap.set(secoes.map(dim), { clearProps: "opacity" });
        secoes.forEach((s) => {
          s.style.zIndex = "";
        });
      };
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(pedidoChecagem);
      window.removeEventListener("resize", checarCaber);
      mm.revert();
    };
  }, []);

  const ir = (indice: number) => irRef.current(indice);
  const capAtivo = chapters[ativo] ?? chapters[0];

  return (
    <ContextoCapituloAtivo.Provider value={{ ativo, ir }}>
      <ThemeColorSync cor={capAtivo.themeColor} />
      <ProgressRail ativo={ativo} cor={capAtivo.paleta.accent} onIr={ir} />
      <div className="pilha" ref={raiz}>
        {children}
      </div>
    </ContextoCapituloAtivo.Provider>
  );
}
