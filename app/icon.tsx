import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { chapters } from "@/lib/chapters";

/**
 * O favicon: "AA" em Archivo, ouro sobre o breu do hero.
 *
 * É gerado com o `next/og` e não é um SVG escrito à mão, e o motivo é chato
 * mas decisivo: **favicon não carrega webfont**. Um `<text>` num SVG de ícone
 * seria desenhado com a fonte que o sistema tiver — Arial no Windows, Helvetica
 * no Mac — ou seja, qualquer coisa menos Archivo. Aqui o texto é rasterizado no
 * build, com o TTF de verdade (`scripts/fonte-og.mjs`).
 *
 * As cores saem de `lib/chapters.ts`, como todo o resto: trocou a paleta do
 * hero, trocou o ícone.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icone() {
  const hero = chapters[0].paleta;
  const archivo = readFileSync(
    join(process.cwd(), "assets-originais/fontes/archivo-800.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: hero.bg,
          borderRadius: 14,
          fontFamily: "Archivo",
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: hero.accent,
        }}
      >
        AA
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: archivo, weight: 800, style: "normal" }] }
  );
}
