/**
 * Recorta a marca do Barbers Vale (o "pulso") do selo chapado.
 *
 *   entrada  assets-originais/marca/barbersvale-selo.jpg  (marca preta sobre
 *            verde #01DB84, 820x820, sem canal alpha)
 *   saida    public/marca/barbersvale-marca.webp          (marca BRANCA sobre
 *            transparente, aparada, pronta pra virar mascara CSS)
 *
 * O site nunca pinta essa imagem: ela entra como `mask-image` e a cor vem de
 * `--accent`. E o mesmo arranjo do selo da Santo Visu, e e o que a regra de
 * logos do CLAUDE.md manda fazer quando o arquivo vem com fundo chapado.
 *
 * Por que threshold e nao remocao de cor: o arquivo e JPG, entao a borda entre
 * preto e verde tem sujeira de compressao. Em escala de cinza a marca fica
 * perto de 0 e o verde perto de 167 — qualquer corte no meio separa os dois
 * sem deixar franja.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entrada = path.join(raiz, "assets-originais", "marca", "barbersvale-selo.jpg");
const saida = path.join(raiz, "public", "marca", "barbersvale-marca.webp");

const CORTE = 120; // entre o preto da marca (~0) e o verde do fundo (~167)

if (!fs.existsSync(entrada)) {
  console.error(`Nao achei ${path.relative(raiz, entrada)}.`);
  console.error("Os originais sao movidos pra assets-originais/ pelo optimize-images.mjs.");
  process.exit(1);
}

// greyscale -> threshold -> negate: a marca vira branca (255), o fundo preto (0)
const { data, info } = await sharp(entrada)
  .greyscale()
  .threshold(CORTE)
  .negate()
  .raw()
  .toBuffer({ resolveWithObject: true });

// esse canal unico vira o ALPHA de uma imagem branca
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i++) {
  rgba[i * 4] = 255;
  rgba[i * 4 + 1] = 255;
  rgba[i * 4 + 2] = 255;
  rgba[i * 4 + 3] = data[i];
}

const marca = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  // apara a moldura transparente pra marca encostar nas bordas do arquivo:
  // assim o tamanho no CSS e o tamanho da marca, sem respiro invisivel
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 });

await marca.webp({ alphaQuality: 100, effort: 6 }).toFile(saida);

const final = await sharp(saida).metadata();
console.log(
  `+ ${path.relative(raiz, saida)}  ${final.width}x${final.height}  ` +
    `${(fs.statSync(saida).size / 1024).toFixed(1)}KB  (alpha)`
);
