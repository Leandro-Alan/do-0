/**
 * Mede o simbolo quadrado do Choque de Gestao direto no arquivo do logo e
 * imprime a decomposicao dele em retangulos, normalizada num viewBox.
 *
 * Por que medir em vez de desenhar no olho: o simbolo e 100% ortogonal (so
 * retangulos em angulo reto), entao ele nao precisa virar imagem — vira path
 * de SVG inline, nitido em qualquer tamanho, sem requisicao e colorido por
 * `currentColor`. Mas para isso as coordenadas tem que ser as DELE, nao as que
 * eu achei parecidas.
 *
 * Fonte: public/marca/choque-2.webp (marca escura sobre campo claro #DEE0DD —
 * a versao com o maior contraste entre tinta e fundo).
 *
 * Saida: o `d` pronto pra colar no componente. Nao escreve arquivo nenhum: o
 * destino do que ele mede e o Cracha.tsx.
 *
 * Rodar: node scripts/marca-choque.mjs
 */

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQUIVO = path.join(RAIZ, "public", "marca", "choque-2.webp");

const { data, info } = await sharp(ARQUIVO)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: L, height: A } = info;
const tinta = (x, y) => data[y * L + x] < 128;

// 1. caixa da marca inteira
let x0 = L, y0 = A, x1 = -1, y1 = -1;
for (let y = 0; y < A; y++) {
  for (let x = 0; x < L; x++) {
    if (!tinta(x, y)) continue;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
}
const larguraMarca = x1 - x0 + 1;
const alturaMarca = y1 - y0 + 1;

// 2. runs de tinta por linha. Linhas com o mesmo padrao viram uma banda so —
//    e a decomposicao minima em retangulos de uma figura ortogonal.
const runsDaLinha = (y) => {
  const runs = [];
  let inicio = -1;
  for (let x = x0; x <= x1 + 1; x++) {
    const dentro = x <= x1 && tinta(x, y);
    if (dentro && inicio < 0) inicio = x;
    if (!dentro && inicio >= 0) {
      runs.push([inicio, x - 1]);
      inicio = -1;
    }
  }
  return runs;
};

// A borda do JPG tem uma orla de antialias: linhas e colunas de 1-2px que nao
// existem no desenho e, sem filtro, viram 13 retangulos em vez de 5. TOLERANCIA
// e a espessura abaixo da qual uma banda ou um vao e ruido, nao traco.
const TOLERANCIA = 3;

const juntarRuns = (runs) => {
  const saida = [];
  for (const [a, b] of runs) {
    const ultimo = saida.at(-1);
    if (ultimo && a - ultimo[1] <= TOLERANCIA) ultimo[1] = b;
    else saida.push([a, b]);
  }
  return saida.filter(([a, b]) => b - a + 1 > TOLERANCIA);
};

const chave = (runs) => runs.map((r) => r.join("-")).join("|");

let bandas = [];
for (let y = y0; y <= y1; y++) {
  const runs = juntarRuns(runsDaLinha(y));
  const k = chave(runs);
  const ultima = bandas.at(-1);
  if (ultima && ultima.k === k) ultima.fim = y;
  else bandas.push({ k, runs, inicio: y, fim: y });
}
bandas = bandas.filter((b) => b.fim - b.inicio + 1 > TOLERANCIA);

// 3. o viewBox e a propria caixa da marca em pixels do arquivo: nenhuma
//    conversao, nenhum arredondamento — o que sai daqui e o que esta la.
const rects = [];
for (const banda of bandas) {
  for (const [a, b] of banda.runs) {
    rects.push({
      x: a - x0,
      y: banda.inicio - y0,
      w: b - a + 1,
      h: banda.fim - banda.inicio + 1,
    });
  }
}

// bandas verticalmente vizinhas com o mesmo run viram um retangulo so
const unidos = [];
for (const r of rects) {
  const anterior = unidos.find(
    (u) => u.x === r.x && u.w === r.w && Math.abs(u.y + u.h - r.y) <= TOLERANCIA
  );
  if (anterior) anterior.h = r.y + r.h - anterior.y;
  else unidos.push({ ...r });
}

const d = unidos.map((r) => `M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}z`).join("");

console.log(`arquivo:        ${path.relative(RAIZ, ARQUIVO)} (${L}x${A})`);
console.log(`caixa da marca: x ${x0}..${x1}  y ${y0}..${y1}  (${larguraMarca}x${alturaMarca}px)`);
console.log(`proporcao:      ${(larguraMarca / alturaMarca).toFixed(4)} (largura/altura)`);
console.log(`bandas:         ${bandas.length}  ->  ${unidos.length} retangulos`);
console.log("");
console.log(`viewBox="0 0 ${larguraMarca} ${alturaMarca}"`);
for (const r of unidos) console.log(`  x=${r.x} y=${r.y} w=${r.w} h=${r.h}`);
console.log("");
console.log("d:");
console.log(d);
