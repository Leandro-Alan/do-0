/**
 * Gera `public/fotos/andre-salao.webp` a partir de `andre-2.webp`.
 *
 * Resolve DUAS coisas de uma vez:
 *
 * 1. `andre-2.webp` e print de carrossel do Instagram e tem a **seta ">" da UI
 *    embutida na borda direita** — pendencia registrada no CLAUDE.md e no
 *    TODO.md desde a fundacao. O circulo dela foi localizado no arquivo (nao
 *    chutado): x 611..634, y 416..439. Cortar a largura em 604 tira a seta com
 *    7px de folga.
 *
 * 2. A foto e retrato (640x818) e o capitulo 04 exibe ela dentro de uma
 *    moldura de tela de projetor, que e paisagem. A janela 4:3 escolhida corta
 *    perto da coxa: o Andre fica inteiro da cabeca pra baixo, com o telao azul
 *    e o salao montado atras. Corpo inteiro nao cabe em paisagem nenhuma —
 *    ele ocupa ~493px de altura numa largura de 604, o que daria proporcao
 *    1,22 e nao existe tela de projetor nesse formato.
 *
 * Idempotente: se o destino ja existe, nao faz nada. O original continua em
 * public/fotos/andre-2.webp — este script nao apaga nada.
 *
 * Rodar: node scripts/recorte-salao.mjs
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEM = path.join(RAIZ, "public", "fotos", "andre-2.webp");
const DESTINO = path.join(RAIZ, "public", "fotos", "andre-salao.webp");

/** janela medida no arquivo. 604x453 = 4:3, a proporcao classica de projetor. */
const JANELA = { left: 0, top: 262, width: 604, height: 453 };

if (fs.existsSync(DESTINO)) {
  console.log(`${path.relative(RAIZ, DESTINO)} ja existe — nada a fazer.`);
  process.exit(0);
}

const meta = await sharp(ORIGEM).metadata();
if (meta.width !== 640 || meta.height !== 818) {
  console.error(
    `ORIGEM mudou de tamanho (${meta.width}x${meta.height}, esperado 640x818). ` +
      `A janela acima foi medida NAQUELE arquivo — remedir antes de rodar.`
  );
  process.exit(1);
}

await sharp(ORIGEM).extract(JANELA).webp({ quality: 82 }).toFile(DESTINO);

const saida = await sharp(DESTINO).metadata();
console.log(
  `${path.relative(RAIZ, DESTINO)}  ${saida.width}x${saida.height}  ` +
    `(${(fs.statSync(DESTINO).size / 1024).toFixed(1)} KB)`
);
console.log("Use ESTAS dimensoes em lib/chapters.ts — sao o teto de exibicao.");
