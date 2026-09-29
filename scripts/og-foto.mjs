/**
 * Prepara a foto do André pra imagem de compartilhamento (`app/opengraph-image.tsx`).
 *
 * POR QUE ESTE SCRIPT EXISTE. O tratamento do site é feito com
 * `mix-blend-mode` em camadas de CSS — e quem desenha a imagem OG é o Satori,
 * que **não tem blend mode**. Se eu simplesmente jogasse a foto crua na imagem
 * de compartilhamento, a primeira coisa que aparece no WhatsApp seria a única
 * foto do site sem o tratamento do site.
 *
 * Então a conta do duotone é refeita aqui, pixel a pixel, com os MESMOS
 * valores do capítulo 00 (ver `Hero` e `TreatedImage`):
 *
 *   1. cinza, com `contrast(1.08)` e `brightness(1.02)`
 *   2. camada de sombra `#0D0C0A` em `lighten`, opacidade 0.38
 *   3. camada de luz `#D9A928` em `multiply`, opacidade 0.38
 *   4. vinheta radial na cor da sombra
 *
 * `forca = 0.38` não é gosto: acima de ~0.5 o ouro come o azul da pele e o
 * rosto fica oliva, com cara de filtro barato. Está no CLAUDE.md.
 *
 * O degradê da direita também é assado aqui, no canal alfa, porque é o mesmo
 * problema: no site ele é `mask-image`, e o Satori não tem máscara.
 *
 * A saída fica FORA de `public/`: ela só é lida no build, pra gerar o PNG do
 * OG. Não é servida pra ninguém e não pesa no carregamento do site.
 *
 * Idempotente. Roda de novo sem medo.
 *
 *   node scripts/og-foto.mjs
 */

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const ORIGEM = resolve(RAIZ, "public/fotos/andre-4.webp");
const DESTINO = resolve(RAIZ, "recursos/og");

/** O painel da esquerda na imagem de 1200x630. */
const L = 470;
const A = 630;

/** Paleta do capítulo 00, copiada de lib/chapters.ts. */
const SOMBRA = [0x0d, 0x0c, 0x0a];
const LUZ = [0xd9, 0xa9, 0x28];
const FORCA = 0.38;

/** Onde o degradê começa a comer a foto, em fração da largura. */
const FADE = 0.62;

const misturar = (a, b, t) => a + (b - a) * t;
const limitar = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

mkdirSync(DESTINO, { recursive: true });

const fonte = sharp(ORIGEM);
const meta = await fonte.metadata();

// `cover` no alto: o rosto dele vive no terço de cima da foto original.
const { data, info } = await sharp(ORIGEM)
  .resize(L, A, { fit: "cover", position: "top" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const canais = info.channels;
for (let y = 0; y < A; y++) {
  for (let x = 0; x < L; x++) {
    const i = (y * L + x) * canais;

    // 1. cinza, com o mesmo contraste e brilho do CSS
    const cinza = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const ajustado = limitar(((cinza / 255 - 0.5) * 1.08 + 0.5) * 1.02 * 255);

    const px = [ajustado, ajustado, ajustado];
    for (let c = 0; c < 3; c++) {
      // 2. sombra em `lighten`: o resultado nunca fica mais escuro que a cor
      const claro = Math.max(px[c], SOMBRA[c]);
      const comSombra = misturar(px[c], claro, FORCA);
      // 3. luz em `multiply`
      const multiplicado = (comSombra * LUZ[c]) / 255;
      px[c] = misturar(comSombra, multiplicado, FORCA);
    }

    // 4. vinheta: mesma ideia do `.tratada-vinheta`, na cor da sombra
    const dx = (x / L - 0.5) / 0.6;
    const dy = (y / A - 0.45) / 0.45;
    const raio = Math.sqrt(dx * dx + dy * dy);
    const vinheta = Math.min(1, Math.max(0, (raio - 0.42) / 0.58)) * 0.7;
    for (let c = 0; c < 3; c++) px[c] = misturar(px[c], SOMBRA[c], vinheta);

    data[i] = limitar(Math.round(px[0]));
    data[i + 1] = limitar(Math.round(px[1]));
    data[i + 2] = limitar(Math.round(px[2]));

    // o degradê da direita, no alfa: é o que costura a foto no breu do fundo
    const t = (x / L - FADE) / (1 - FADE);
    data[i + 3] = t <= 0 ? 255 : Math.round(255 * (1 - Math.min(1, t)) ** 1.6);
  }
}

const saida = resolve(DESTINO, "andre-og.png");
await sharp(data, { raw: { width: L, height: A, channels: canais } })
  .png({ compressionLevel: 9 })
  .toFile(saida);

console.log(
  `andre-4.webp (${meta.width}x${meta.height})  →  andre-og.png (${L}x${A}), ` +
    `duotone ouro a ${FORCA} e degradê a partir de ${Math.round(FADE * 100)}% da largura`
);
