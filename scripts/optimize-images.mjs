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

if (originais.length === 0) {
  console.log("Nada a converter: /public nao tem JPG nem PNG.");
  process.exit(0);
}

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
