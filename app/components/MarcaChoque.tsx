/**
 * O simbolo quadrado do Choque de Gestao, em SVG inline.
 *
 * Nao e imagem de proposito. O simbolo e 100% ortogonal — cinco retangulos em
 * angulo reto — entao virar path sai melhor que virar arquivo: nitido em
 * qualquer tamanho (o logo so existe em 1080px de raster), zero requisicao, e
 * a cor vem de `currentColor`, ou seja, do capitulo.
 *
 * As coordenadas NAO foram desenhadas no olho: sairam de
 * `scripts/marca-choque.mjs`, que le public/marca/choque-2.webp, isola a tinta
 * por threshold, agrupa as linhas em bandas e imprime a decomposicao em
 * retangulos. O viewBox e a caixa da marca em pixels do proprio arquivo
 * (429x477), sem conversao nenhuma. Regerar: `node scripts/marca-choque.mjs`.
 */
export default function MarcaChoque({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 429 477"
      fill="currentColor"
      // decorativo: o nome da marca vem escrito ao lado, em texto de verdade
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 1h429v99h-429zM0 100h99v89h-99zM330 100h99v188h-99zM0 190h204v98h-204zM0 378h429v99h-429z" />
    </svg>
  );
}
