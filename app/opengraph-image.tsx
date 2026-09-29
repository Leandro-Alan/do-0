import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { chapters } from "@/lib/chapters";

/**
 * A imagem que aparece quando alguém cola o link no WhatsApp.
 *
 * É a primeira impressão do site, e em muitos casos a ÚNICA: metade das
 * pessoas decide se toca no link olhando só este retângulo.
 *
 * Gerada no build (a rota é estática, como a página), então não custa nada em
 * tempo de visita. Quem desenha é o Satori, dentro do `next/og`, e ele tem
 * duas limitações que moldaram tudo aqui: **não tem `mix-blend-mode` e não tem
 * `mask-image`**. Por isso a foto já chega pronta — duotone e degradê assados
 * por `scripts/og-foto.mjs`, com os mesmos valores do capítulo 00 — e por isso
 * a fonte vem como bytes de um TTF (`scripts/fonte-og.mjs`) em vez de sair do
 * `next/font`.
 *
 * Os dois arquivos moram FORA de `public/`: são lidos no build e não são
 * servidos pra ninguém.
 */

export const alt = "André Alves — eventos, mentoria, consultoria e conteúdo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Os três caminhos são LITERAIS, um por chamada, e não passam por uma função
 * auxiliar. Parece repetição e não é: o Turbopack analisa `readFileSync`
 * estaticamente, e com o caminho vindo de variável ele desiste e traça o
 * projeto INTEIRO pra dentro do bundle do servidor — `public/` junto. O aviso
 * dele é literal: "causes tracing of the whole project". Com string literal
 * ele inclui só estes três arquivos.
 */
export default async function Imagem() {
  const hero = chapters[0].paleta;
  // as seis frentes, na ordem do site. O hero (00) fica de fora: ele é a capa,
  // não uma frente.
  const frentes = chapters.slice(1);

  const foto = readFileSync(
    join(process.cwd(), "assets-originais/og/andre-og.png")
  ).toString("base64");
  const archivo800 = readFileSync(
    join(process.cwd(), "assets-originais/fontes/archivo-800.ttf")
  );
  const archivo600 = readFileSync(
    join(process.cwd(), "assets-originais/fontes/archivo-600.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background: hero.bg,
          fontFamily: "Archivo",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- o Satori não
            tem next/image; aqui é uma tag de verdade, num PNG gerado no build */}
        <img
          src={`data:image/png;base64,${foto}`}
          alt=""
          width={470}
          height={630}
          style={{ position: "absolute", left: 0, top: 0 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "absolute",
            left: 520,
            top: 0,
            width: 620,
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: 23,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: hero.accent,
            }}
          >
            {chapters[0].categoria}
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              color: hero.fg,
            }}
          >
            {chapters[0].nome}
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 29,
              fontWeight: 600,
              lineHeight: 1.35,
              color: hero.muted,
            }}
          >
            Eventos, mentoria, consultoria e conteúdos para donos de barbearia.
          </div>

          {/* As seis cores em fila: é o índice do site reduzido a um gesto.
              Cada bolinha leva um anel porque metade das cores é quase preta
              sobre um fundo quase preto — o mesmo motivo do anel no índice do
              hero. */}
          <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
            {frentes.map((frente) => (
              <div
                key={frente.id}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  background: frente.paleta.bg,
                  border: `2px solid ${hero.fg}33`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo800, weight: 800, style: "normal" },
        { name: "Archivo", data: archivo600, weight: 600, style: "normal" },
      ],
    }
  );
}
