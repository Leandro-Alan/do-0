/**
 * Converte todo JPG/PNG de /public pra WebP e tira o original do bundle.
 *
 *   entrada  public/fotos/andre-4.jpg
 *   saida    public/fotos/andre-4.webp        (<= 1800px no lado maior, q78)
 *   original assets-originais/fotos/andre-4.jpg
 *
 * Idempotente: se o WebP ja existe e o original ja saiu de /public, nao faz
 * nada. Rodar com `npm run imagens`.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publico = path.join(raiz, "public");
const arquivo = path.join(raiz, "assets-originais");

const LADO_MAX = 1800;
const QUALIDADE = 78;
const EXTENSOES = new Set([".jpg", ".jpeg", ".png"]);

function varrer(dir) {
  const achados = [];
  if (!fs.existsSync(dir)) return achados;
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const alvo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) achados.push(...varrer(alvo));
    else if (EXTENSOES.has(path.extname(entrada.name).toLowerCase())) achados.push(alvo);
  }
  return achados;
}

const kb = (bytes) => (bytes / 1024).toFixed(0) + "KB";

const originais = varrer(publico).sort();

if (originais.length === 0) console.log("Nada a converter: /public nao tem JPG nem PNG.");

let convertidos = 0;
let pulados = 0;

for (const entrada of originais) {
  const relativo = path.relative(publico, entrada);
  const saida = entrada.replace(/\.(jpe?g|png)$/i, ".webp");
  const guardado = path.join(arquivo, relativo);

  if (fs.existsSync(saida)) {
    // Ja convertido numa rodada anterior: so tira o original do bundle.
    fs.mkdirSync(path.dirname(guardado), { recursive: true });
    fs.renameSync(entrada, guardado);
    console.log(`= ${relativo} ja tinha WebP; original arquivado`);
    pulados += 1;
    continue;
  }

  const meta = await sharp(entrada).metadata();

  // `fit: inside` + `withoutEnlargement` limita o lado maior a 1800px e nunca
  // amplia — e o que protege o logo da Fortix, que tem so 150px.
  await sharp(entrada)
    .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALIDADE, alphaQuality: 100, effort: 5 })
    .toFile(saida);

  const antes = fs.statSync(entrada).size;
  const depois = fs.statSync(saida).size;
  const novaMeta = await sharp(saida).metadata();

  fs.mkdirSync(path.dirname(guardado), { recursive: true });
  fs.renameSync(entrada, guardado);

  const encolheu = meta.width !== novaMeta.width || meta.height !== novaMeta.height;
  const dimensoes = encolheu
    ? `${meta.width}x${meta.height} -> ${novaMeta.width}x${novaMeta.height}`
    : `${novaMeta.width}x${novaMeta.height}`;

  console.log(
    `+ ${relativo.padEnd(34)} ${dimensoes.padEnd(22)} ${kb(antes)} -> ${kb(depois)}` +
      (meta.hasAlpha ? " (alpha)" : "")
  );
  convertidos += 1;
}

console.log(
  `\n${convertidos} convertido(s), ${pulados} ja estava(m) pronto(s).` +
    `\nOriginais em assets-originais/ (fora de /public, nao vao pro bundle).`
);

/* ------------------------------------------------------------------------
   DUOTONE ASSADO. O tratamento das fotos era feito ao vivo no navegador: a
   foto em cinza por `filter` e duas camadas de cor em `mix-blend-mode` por
   cima (lighten pras sombras, multiply pras luzes), mais o grao em
   `overlay`. No celular isso e recomposto a cada quadro de rolagem, e o
   Leandro sentiu o site travando num iPhone X. Aqui a MESMA conta roda uma
   vez, com sharp, e sai um `<nome>-duo.webp` pronto — o TreatedImage so
   mostra o arquivo.

   As cores e a forca de cada foto vem de `lib/duotone.json`, que o
   TreatedImage tambem le: um lugar so. Foto nova com tratamento = uma linha
   la + `npm run imagens`.

   Sempre regera (e rapido, e mudar a cor no JSON tem que valer na hora).
   ------------------------------------------------------------------------ */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const duotone = JSON.parse(fs.readFileSync(path.join(raiz, "lib/duotone.json"), "utf8"));

for (const [src, { escuro, claro, forca }] of Object.entries(duotone)) {
  const entrada = path.join(publico, src);
  if (!fs.existsSync(entrada)) {
    console.log(`! ${src} nao existe em public/; pulando o duotone`);
    continue;
  }
  const saida = entrada.replace(/\.webp$/i, "-duo.webp");
  const E = hex(escuro);
  const C = hex(claro);
  const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 3) {
    // 1. cinza com o mesmo contraste e brilho que o CSS usava
    const cinza = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const ajustado = Math.min(255, Math.max(0, ((cinza / 255 - 0.5) * 1.08 + 0.5) * 1.02 * 255));
    for (let c = 0; c < 3; c++) {
      // 2. sombra em `lighten`, na opacidade `forca`
      const comSombra = ajustado + (Math.max(ajustado, E[c]) - ajustado) * forca;
      // 3. luz em `multiply`, na opacidade `forca`
      const comLuz = comSombra + ((comSombra * C[c]) / 255 - comSombra) * forca;
      data[i + c] = Math.round(Math.min(255, Math.max(0, comLuz)));
    }
  }

  await sharp(data, { raw: info }).webp({ quality: 80, effort: 5 }).toFile(saida);
  console.log(`~ ${src.padEnd(30)} -> ${path.basename(saida)}  (${escuro} / ${claro} a ${forca})`);
}
