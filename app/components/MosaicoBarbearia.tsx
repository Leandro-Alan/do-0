"use client";

import { useRef } from "react";
import gsap from "gsap";
import TreatedImage from "./TreatedImage";
import { DECK, useAoAtivar } from "./ChapterStack";
import type { Foto } from "@/lib/chapters";

/**
 * A galeria do capítulo 06, e ela decide o formato sozinha pela quantidade de
 * foto que existe — mesma ideia do `FaixaFotos` do capítulo 02:
 *
 *   0        → não renderiza NADA.
 *   1        → uma foto grande e PARADA.
 *   2 a 5    → uma faixa só, com as fotos repetidas em laço e parallax leve.
 *   6 ou +   → três faixas horizontais, cada uma correndo em sentido contrário
 *              à de cima, com parallax por scrub.
 *
 * **Por que 1 foto não vira faixa em laço.** O prompt pedia "com menos, uma
 * faixa só com as fotos repetidas em loop" — e com DUAS ou mais é isso mesmo
 * que acontece. Com UMA, o laço seria a mesma imagem passando de novo e de
 * novo, que é a maneira mais rápida de anunciar que só existe uma foto. É o
 * mesmo motivo que fez o capítulo 04 não repetir o rosto do hero.
 *
 * E hoje é esse o caso: existe UMA foto do salão, e não é descuido — o próprio
 * site da barbearia registra que o acervo inteiro tem uma foto de ambiente.
 * Quando aparecerem outras, é só preencher `conteudo.fotos` em
 * `lib/chapters.ts`: nenhuma linha de layout pra escrever.
 *
 * **O deslocamento anda em fração da largura da tela, não em `xPercent`** —
 * as faixas têm larguras diferentes e porcentagem daria deslocamentos
 * desproporcionais. É a mesma lição das listras da Fortix.
 *
 * Era parallax continuo por scrub (ScrollTrigger, preso ao fim do documento
 * — "max"). Sem pin nem scroll de pagina no deck de desktop essa geometria
 * deixou de existir: agora cada faixa entra de um lado, UMA vez, quando a
 * Barbearia vira o capitulo ativo (`useAoAtivar`) — mesma direção alternada
 * entre faixas, sem depender de rolagem continua.
 *
 * **Essa entrada so existe no deck, e so com faixas.** No celular a rolagem e
 * normal e o capitulo vira ativo quando ja esta no meio da tela: a foto,
 * visivel, era jogada de lado e voltava — um tranco que o Leandro viu como
 * bug. E com UMA foto ela fica parada sempre, como diz o topo deste arquivo.
 */
export default function MosaicoBarbearia({
  fotos,
  forca = 0.72,
}: {
  fotos?: Foto[];
  forca?: number;
}) {
  const raiz = useRef<HTMLDivElement>(null);

  const total = fotos?.length ?? 0;
  const modo: "unica" | "faixa" | "faixas" =
    total >= 6 ? "faixas" : total >= 2 ? "faixa" : "unica";

  useAoAtivar("barbearia", () => {
    const el = raiz.current;
    if (!el || modo === "unica" || !window.matchMedia(DECK).matches) return;

    const faixas = [...el.querySelectorAll<HTMLElement>("[data-faixa]")];
    if (faixas.length === 0) return;

    faixas.forEach((faixa, i) => {
      // cada faixa entra do lado contrário da de cima, e a de baixo anda
      // mais: é o que separa os três planos
      const sentido = i % 2 === 0 ? 1 : -1;
      const curso = (0.14 + i * 0.05) * window.innerWidth;
      gsap.fromTo(
        faixa,
        { x: sentido * curso },
        { x: 0, duration: 1, ease: "power3.out", overwrite: true }
      );
    });
  });

  if (!fotos || total === 0) return null;

  if (modo === "unica") {
    const foto = fotos[0];
    return (
      <div className="ba-mosaico ba-mosaico--unica" ref={raiz}>
        <div className="ba-quadro" data-faixa>
          <TreatedImage
            src={foto.src}
            alt={foto.alt}
            largura={foto.largura}
            altura={foto.altura}
            modo="capa"
            forca={forca}
            sizes="(min-width: 900px) 46vw, 100vw"
          />
        </div>
      </div>
    );
  }

  // Três faixas com 6+ fotos, uma só com 2 a 5. Cada faixa recebe o suficiente
  // pra transbordar a tela nos dois lados — senão o parallax abre um vão na
  // borda no fim do curso.
  const bandas = modo === "faixas" ? repartir(fotos, 3) : [fotos];

  return (
    <div className={`ba-mosaico ba-mosaico--${modo}`} ref={raiz}>
      {bandas.map((banda, i) => (
        <div className="ba-faixa" key={i} data-faixa>
          {encher(banda).map((foto, j) => (
            <div className="ba-tijolo" key={`${foto.src}-${j}`}>
              <TreatedImage
                src={foto.src}
                alt={j < banda.length ? foto.alt : ""}
                largura={foto.largura}
                altura={foto.altura}
                modo="capa"
                forca={forca}
                sizes="(min-width: 900px) 22vw, 44vw"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Distribui as fotos em n faixas, mantendo a ordem em zigue-zague. */
function repartir(fotos: Foto[], n: number): Foto[][] {
  const bandas: Foto[][] = Array.from({ length: n }, () => []);
  fotos.forEach((foto, i) => bandas[i % n].push(foto));
  return bandas.filter((b) => b.length > 0);
}

/**
 * Repete a banda até dar pelo menos 4 quadros. As repetições vão com `alt=""`
 * — a mesma foto anunciada quatro vezes num leitor de tela é ruído, e quem
 * descreve é a primeira volta.
 */
function encher(banda: Foto[]): Foto[] {
  const cheia = [...banda];
  while (cheia.length < 4) cheia.push(...banda);
  return cheia;
}
