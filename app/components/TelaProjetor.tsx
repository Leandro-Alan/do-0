import TreatedImage from "./TreatedImage";
import type { Foto } from "@/lib/chapters";

/**
 * A foto do capitulo 04 dentro de uma tela de projetor: caixa do rolo em cima,
 * o pano descendo, e um brilho suave por cima da imagem — como se ela fosse o
 * slide projetado.
 *
 * O brilho nao e branco: e o proprio `--bg` do capitulo em cima da foto. Foto
 * projetada lava PRA COR DA PAREDE, e a parede aqui e a areia do capitulo.
 *
 * `modo="foto"` de proposito: ele trava o quadro em `largura`px e a foto nunca
 * aparece maior que os 604px reais do arquivo.
 */
export default function TelaProjetor({
  foto,
  /**
   * Quanto o marrom do capitulo come da foto. A 0.6 ela ainda saia cinza — o
   * teto de ~0.5 que o hero e o 01 respeitam existe porque la o rosto dele
   * ocupa a foto inteira. Aqui ele e uma figura pequena num salao, entao da
   * pra ir mais forte sem a pele virar filtro.
   */
  forca = 0.74,
}: {
  foto?: Foto;
  forca?: number;
}) {
  if (!foto) return null;

  return (
    <div className="pl-tela">
      <span className="pl-tela-caixa" aria-hidden="true" />
      <div className="pl-tela-pano">
        <TreatedImage
          src={foto.src}
          alt={foto.alt}
          largura={foto.largura}
          altura={foto.altura}
          modo="foto"
          forca={forca}
          sizes="(min-width: 900px) 42vw, 92vw"
          className="pl-tela-foto"
        />
        <span className="pl-tela-brilho" aria-hidden="true" />
      </div>
    </div>
  );
}
