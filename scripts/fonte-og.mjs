/**
 * Baixa o Archivo em TTF pra gerar a imagem de compartilhamento e o favicon.
 *
 * POR QUE UM ARQUIVO SEPARADO, se o site já carrega Archivo pelo `next/font`.
 * Porque quem desenha a imagem OG é o **Satori** (dentro do `next/og`), e ele
 * roda no servidor, fora do navegador: não existe CSS, não existe `@font-face`
 * e ele precisa dos BYTES da fonte na mão. Os arquivos que o `next/font` baixa
 * ficam enterrados em `.next/` com nome com hash, e depender daquele caminho é
 * depender de detalhe interno do framework.
 *
 * O arquivo NÃO vai pro navegador de ninguém: fica fora de `public/`, é lido
 * só na hora do build, e a saída é um PNG. Não pesa no carregamento do site.
 *
 * O truque do User-Agent antigo é o jeito conhecido de fazer o Google Fonts
 * devolver TTF: com UA moderno ele devolve WOFF2, que o Satori não lê.
 *
 * Idempotente: se o arquivo já existe, não baixa de novo (use --forcar).
 *
 *   node scripts/fonte-og.mjs
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DESTINO = resolve(AQUI, "../recursos/fontes");

/**
 * UA velho o bastante pra o Google Fonts servir TTF em vez de WOFF2 — e tem
 * que ser ESTE nível de velho. Medi quatro:
 *
 *   Chrome de hoje  → .woff2   (Satori não lê)
 *   Chrome 20       → .woff    (Satori não lê)
 *   MSIE 6          → o endpoint `/l/font?kit=…`, que responde 200 com
 *                     `content-type: text/html` e um binário que não é fonte
 *                     nenhuma — assinatura `30 b6 01 00`
 *   Android 2.2     → uma URL .ttf de verdade  ✅
 */
const UA_ANTIGO =
  "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1";

const PESOS = [
  { peso: 800, arquivo: "archivo-800.ttf" },
  { peso: 600, arquivo: "archivo-600.ttf" },
];

const forcar = process.argv.includes("--forcar");

mkdirSync(DESTINO, { recursive: true });

for (const { peso, arquivo } of PESOS) {
  const caminho = resolve(DESTINO, arquivo);
  if (existsSync(caminho) && !forcar) {
    console.log(`${arquivo} já existe — pulando (use --forcar pra rebaixar)`);
    continue;
  }

  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wght@${peso}`, {
      headers: { "User-Agent": UA_ANTIGO },
    })
  ).text();

  // Sem exigir `format('truetype')` no CSS: pro UA antigo o Google devolve a
  // URL crua do endpoint `/l/font?kit=…`, sem declarar formato nenhum. Quem
  // decide se serviu é a assinatura do arquivo, logo abaixo — é ela que não
  // mente.
  const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!url) {
    console.error(
      `Não achei nenhuma URL de fonte na resposta do Google Fonts pro peso ${peso}.\n` +
        "O CSS veio assim:\n" +
        css.slice(0, 400)
    );
    process.exit(1);
  }

  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());

  // TTF começa com 0x00010000 ou "true"; OTF com "OTTO". WOFF e WOFF2 (wOFF /
  // wOF2) o Satori NÃO lê, e o erro dele é obscuro — melhor falhar aqui.
  const assinatura = bytes.subarray(0, 4);
  const ttf =
    assinatura.equals(Buffer.from([0x00, 0x01, 0x00, 0x00])) ||
    assinatura.toString("latin1") === "true" ||
    assinatura.toString("latin1") === "OTTO";
  if (!ttf) {
    console.error(
      `O Google devolveu "${assinatura.toString("latin1")}" pro peso ${peso}, e o ` +
        "Satori só lê TTF/OTF.\nO truque do User-Agent antigo parou de funcionar — " +
        "ver o comentário no topo deste arquivo."
    );
    process.exit(1);
  }

  writeFileSync(caminho, bytes);
  console.log(`${arquivo}  ${(bytes.length / 1024).toFixed(0)} KB`);
}
