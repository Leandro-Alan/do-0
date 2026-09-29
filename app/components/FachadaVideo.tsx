"use client";

import Image from "next/image";
import { useState } from "react";
import { CAPA_ALTURA, CAPA_LARGURA, capa, embed } from "@/lib/youtube";

/**
 * A fachada de um video: capa estatica + botao de play. **So no toque** ela
 * vira o iframe do youtube-nocookie, com autoplay.
 *
 * Isso nao e otimizacao de gosto, e regra do projeto: o CLAUDE.md proibe
 * iframe carregado de cara. Cada player do YouTube que nasce junto com a
 * pagina puxa cerca de 1 MB de JS de terceiro e planta cookie antes de a
 * pessoa pedir qualquer coisa — num site que abre dentro do Instagram, em 4G,
 * com SETE capitulos, isso mataria a pagina.
 *
 * A capa NAO passa pelo TreatedImage. Ela e arte pronta do proprio canal, e a
 * mesma regra do flyer do capitulo 01 vale aqui: tratar arte que ja tem
 * identidade propria so estraga. O duotone vermelho deste capitulo e pra foto
 * do Andre, que e material cru.
 *
 * Se o iframe falhar de verdade (erro de rede, embed bloqueado a nivel de
 * navegador), o `onError` devolve a fachada e o clique seguinte abre o video
 * direto no YouTube, em vez de mostrar um player quebrado. **Limite honesto:**
 * um dono de canal que DESATIVA embed nao gera erro de iframe nenhum — a
 * pagina de erro carrega normalmente dentro dele. Isso so o YouTube sabe
 * resolver de verdade (API oficial, que este capitulo nao usa de proposito —
 * ver YouTube.tsx).
 */
export default function FachadaVideo({
  id,
  titulo,
  tamanho = "grande",
}: {
  id: string;
  titulo: string;
  /** "grande" = a tela principal; "cartao" = um dos tres do trilho */
  tamanho?: "grande" | "cartao";
}) {
  const [tocando, setTocando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  const classe = `yt-fachada${tamanho === "cartao" ? " yt-fachada--cartao" : ""}`;

  if (tocando) {
    return (
      <div className={`${classe} yt-fachada--tocando`}>
        <iframe
          className="yt-player"
          src={embed(id)}
          title={titulo}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onError={() => {
            setTocando(false);
            setFalhou(true);
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classe}
      onClick={() => {
        if (falhou) {
          window.open(`https://www.youtube.com/watch?v=${id}`, "_blank", "noopener");
          return;
        }
        setTocando(true);
      }}
    >
      <Image
        src={capa(id)}
        alt=""
        width={CAPA_LARGURA}
        height={CAPA_ALTURA}
        sizes={tamanho === "grande" ? "(min-width: 900px) 480px, 92vw" : "216px"}
        className="yt-capa"
      />
      {/* Selo cheio, e nao um triangulo solto: capa de video e imagem de
          contraste imprevisivel (a do teste era amarela clara), e triangulo
          vermelho sumia nela. O par acento/acento-fg mede 5,07:1 e nao depende
          da capa. */}
      <span className="yt-play" aria-hidden="true">
        <span className="yt-play-selo">
          <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
            <path d="M9 6.5v11l9-5.5-9-5.5Z" />
          </svg>
        </span>
      </span>
      {/* O titulo do video E o nome acessivel do botao. A capa vai com alt=""
          de proposito: ela e a mesma informacao, e leitor de tela anunciaria
          duas vezes. */}
      <span className="yt-fachada-titulo">
        {/* O clamp de 2 linhas mora neste span de dentro, e nao no pai. O pai e
            `position: absolute`, e posicionamento absoluto BLOQUEIA o display:
            o `-webkit-box` que o clamp exige vira `flow-root` e o clamp para
            de valer. O resultado era titulo cortado no meio da terceira linha,
            sem reticencia. */}
        <span className="yt-fachada-texto">{titulo}</span>
      </span>
    </button>
  );
}
