import TreatedImage from "./TreatedImage";
import type { Foto } from "@/lib/chapters";

/**
 * Galeria recortada em paralelogramo, no angulo das listras do logo.
 *
 * Tres comportamentos, decididos so pela quantidade de foto que existe:
 *   0        -> nao renderiza NADA. E a regra da demo: dado faltando some, e
 *               nunca vira moldura cinza esperando conteudo.
 *   1 ou 2   -> uma foto grande, no mesmo recorte.
 *   3 ou mais-> faixa horizontal arrastavel, com scroll-snap NATIVO (CSS puro,
 *               sem biblioteca e sem listener de scroll).
 *
 * HOJE A FORTIX NAO TEM FOTO NENHUMA, entao isto devolve null. O componente
 * existe pronto pra que, quando o Andre mandar, seja so preencher o array em
 * lib/chapters.ts — nenhuma linha de layout pra escrever.
 */
export default function FaixaFotos({
  fotos,
  forca = 0.8,
}: {
  fotos?: Foto[];
  /** quanto o duotone do capitulo come da foto */
  forca?: number;
}) {
  if (!fotos || fotos.length === 0) return null;

  const uma = fotos.length < 3;

  return (
    <div className={`fx-galeria${uma ? " fx-galeria--unica" : ""}`}>
      <div className="fx-trilho">
        {(uma ? fotos.slice(0, 1) : fotos).map((foto) => (
          <div className="fx-quadro" key={foto.src}>
            <TreatedImage
              src={foto.src}
              alt={foto.alt}
              largura={foto.largura}
              altura={foto.altura}
              modo="capa"
              forca={forca}
              sizes={uma ? "(min-width: 900px) 70vw, 100vw" : "(min-width: 900px) 34vw, 78vw"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
