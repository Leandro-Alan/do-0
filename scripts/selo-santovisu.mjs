/**
 * Traz o selo da Santo Visu pra este projeto, em duas peças separadas.
 *
 * ORIGEM: `clientes/santo-visu/site/public/marca/`, o site DA BARBEARIA. Lá o
 * selo já tinha sido vetorizado (potrace, a partir de `Barbearia/logo1.jpg`) e
 * partido em anel (o texto circular) e miolo (o frade). São dois projetos
 * diferentes, então o arquivo é copiado e não referenciado: este site tem que
 * buildar sozinho, mesmo que a pasta vizinha suma.
 *
 * O QUE O SCRIPT FAZ além de copiar: arredonda as coordenadas pra inteiro. O
 * potrace cospe 3 casas decimais num viewBox de 2160 unidades — a menor delas
 * vale 0,0002px na tela. É precisão que ninguém vê e que custa ~40% do
 * arquivo, e aqui o arquivo é máscara CSS de um capítulo que abre em 4G.
 *
 * Os dois SVG viram MÁSCARA (`mask-image`), nunca `<img>`: a cor sai de
 * `--fg`/`--accent` do capítulo, como a marca do Barbers Vale no 01.
 *
 * Idempotente: rodar de novo reescreve o mesmo conteúdo. Não apaga nada na
 * pasta de origem.
 *
 *   node scripts/selo-santovisu.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const ORIGEM = resolve(RAIZ, "../../santo-visu/site/public/marca");
const DESTINO = resolve(RAIZ, "public/marca");

const PECAS = [
  { de: "selo-anel.svg", para: "santovisu-anel.svg" },
  { de: "selo-miolo.svg", para: "santovisu-miolo.svg" },
];

/** Arredonda todo número decimal do `d` pra inteiro. */
const enxugar = (svg) => svg.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n))));

if (!existsSync(ORIGEM)) {
  console.error(
    `Não achei a pasta de origem:\n  ${ORIGEM}\n` +
      "Ela é o site da Santo Visu (clientes/santo-visu/). Os SVG já gerados\n" +
      "estão em public/marca/ e o site não depende deste script pra rodar —\n" +
      "ele só existe pra regerar."
  );
  process.exit(1);
}

mkdirSync(DESTINO, { recursive: true });

for (const { de, para } of PECAS) {
  const caminho = resolve(ORIGEM, de);
  if (!existsSync(caminho)) {
    console.error(`Falta ${de} em ${ORIGEM}. Nada foi escrito.`);
    process.exit(1);
  }

  const cru = readFileSync(caminho, "utf8");
  const magro = enxugar(cru);
  writeFileSync(resolve(DESTINO, para), magro);

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(
    `${de} → ${para}   ${kb(Buffer.byteLength(cru))} → ${kb(Buffer.byteLength(magro))}`
  );
}
