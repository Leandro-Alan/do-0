import LinkExterno from "./LinkExterno";
import MarcaSotalia from "./MarcaSotalia";
import { DM, chapters } from "@/lib/chapters";

const ANO = 2026;
const SOTALIA = "https://sotaliahub.com";

/**
 * A versão compacta do rodapé, e ela só existe pro deck de desktop.
 *
 * Sem scroll de página no deck, não há mais como "chegar" a um rodapé
 * depois do último capítulo — ele teria que morar depois de uma pilha que
 * `overflow: hidden` nunca deixa passar. Por isso esta faixa vive DENTRO do
 * último capítulo (Barbearia), pelo slot `rodape` do `<Chapter>`; o
 * `<Rodape>` de verdade continua existindo em fluxo normal, só que
 * escondido no deck via CSS — é ele quem aparece no snap do celular, onde a
 * página ainda tem fim de verdade.
 *
 * Só o essencial: copyright, a assinatura da Sotalia (a MESMA de todo site
 * da casa) e o caminho de contato. O índice de capítulos não repete aqui —
 * o ProgressRail já cobre a navegação no deck.
 */
export default function RodapeCompacto() {
  const capa = chapters[0];

  return (
    <div className="rc">
      <p className="rc-copy">
        © {ANO} {capa.nome}
      </p>

      <LinkExterno
        href={SOTALIA}
        capitulo="rodape"
        nome="sotalia"
        className="rc-sotalia"
        aria-label="Site feito por Sotalia Hub"
      >
        <MarcaSotalia className="rc-golfinho" />
        <span>
          feito por <b>Sotalia Hub</b>
        </span>
      </LinkExterno>

      <LinkExterno href={DM} capitulo="rodape" nome="direct" className="rc-direct">
        Chamar no direct
      </LinkExterno>
    </div>
  );
}
