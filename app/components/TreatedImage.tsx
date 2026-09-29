import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Toda foto de capitulo passa por aqui.
 *
 * O material do Andre e irregular (metade e print de Instagram, de 640px). O
 * tratamento serve pra que fotos de qualidades diferentes pareçam da mesma
 * familia: duotone nos tons do capitulo, granulacao e vinheta.
 *
 * Duas regras sao estruturais, nao decorativas:
 *   - `tratar={false}` em foto boa ou em arte pronta (flyer, logo). Tratar uma
 *     arte que ja tem identidade propria so estraga.
 *   - NUNCA exibir foto maior que a resolucao real. `modo="foto"` trava o
 *     quadro em `largura`px. Foto pequena que precisa cobrir muita area vai de
 *     `modo="fundo"`, onde o blur esconde a ampliacao.
 */
export default function TreatedImage({
  src,
  alt,
  largura,
  altura,
  tratar = true,
  modo = "foto",
  forca = 0.82,
  sizes = "100vw",
  prioridade = false,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  /** largura REAL do arquivo. E o teto do quadro em modo foto. */
  largura: number;
  /** altura REAL do arquivo. */
  altura: number;
  tratar?: boolean;
  /**
   * "foto"  = quadro na proporcao real, com teto de `largura`px.
   * "capa"  = preenche o container (object-fit: cover), nitida. Use so quando o
   *           container couber dentro de `largura` — senao a foto amplia.
   * "fundo" = preenche o container desfocada. E o unico modo onde ampliar e
   *           aceitavel, porque o blur esconde.
   */
  modo?: "foto" | "capa" | "fundo";
  /** 0 a 1. Quanto o duotone come da foto original. */
  forca?: number;
  sizes?: string;
  prioridade?: boolean;
  className?: string;
  /** vai por cima das camadas de tratamento (degrade, texto sobreposto). */
  children?: ReactNode;
}) {
  const estilo = {
    "--duo-forca": forca,
    ...(modo === "foto" ? { maxWidth: `${largura}px` } : null),
  } as CSSProperties;

  return (
    <figure
      className={[
        "tratada",
        modo === "fundo" ? "tratada--fundo" : "",
        modo === "capa" ? "tratada--capa" : "",
        tratar ? "tratada--tratada" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={estilo}
    >
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes={sizes}
        priority={prioridade}
        // fundo desfocado e decoracao: nao entra na arvore de acessibilidade
        aria-hidden={modo === "fundo" ? true : undefined}
      />

      {tratar && (
        <>
          <span className="tratada-camada tratada-sombra" aria-hidden="true" />
          <span className="tratada-camada tratada-luz" aria-hidden="true" />
          <span
            className="tratada-camada tratada-grao"
            aria-hidden="true"
            style={{ "--grao": `url("${GRAO}")` } as CSSProperties}
          />
          <span className="tratada-camada tratada-vinheta" aria-hidden="true" />
        </>
      )}

      {children}
    </figure>
  );
}

/* Granulacao em SVG inline: nao custa requisicao e nao vira arquivo binario. */
const GRAO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/></filter>
      <rect width="180" height="180" filter="url(#g)" opacity="0.38"/>
    </svg>`.replace(/\s+/g, " ")
  );
