import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import duotone from "@/lib/duotone.json";

/**
 * Toda foto de capitulo passa por aqui.
 *
 * O material do Andre e irregular (metade e print de Instagram, de 640px). O
 * tratamento serve pra que fotos de qualidades diferentes pareçam da mesma
 * familia: duotone nos tons do capitulo e vinheta.
 *
 * O DUOTONE E ASSADO NO ARQUIVO. Era feito ao vivo (foto em cinza por
 * `filter` + duas camadas em `mix-blend-mode` + grao em `overlay`), e no
 * celular isso era recomposto a cada quadro de rolagem — o site travava num
 * iPhone X. Agora `npm run imagens` gera `<nome>-duo.webp` com a mesma conta,
 * e as cores e a forca de cada foto moram em `lib/duotone.json`. Foto
 * tratada que nao esta la aparece crua, so com a vinheta: e o caso da Santo
 * Visu, que nao leva duotone de proposito. O grao virou uma camada unica do
 * site, so no desktop (globals.css).
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
  // `forca` fica na assinatura por compatibilidade com quem chama: quem manda
  // agora e o `lib/duotone.json`, lido pelo script que assa o arquivo.
  void forca;
  const assada = tratar && src in duotone;
  const arquivo = assada ? src.replace(/\.webp$/i, "-duo.webp") : src;

  const estilo = (modo === "foto" ? { maxWidth: `${largura}px` } : {}) as CSSProperties;

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
        src={arquivo}
        alt={alt}
        width={largura}
        height={altura}
        sizes={sizes}
        priority={prioridade}
        // fundo desfocado e decoracao: nao entra na arvore de acessibilidade
        aria-hidden={modo === "fundo" ? true : undefined}
      />

      {tratar && <span className="tratada-camada tratada-vinheta" aria-hidden="true" />}

      {children}
    </figure>
  );
}
