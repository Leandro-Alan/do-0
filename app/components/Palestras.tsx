import Chapter from "./Chapter";
import Citacao from "./Citacao";
import ConviteParaPalestrar from "./ConviteParaPalestrar";
import TelaProjetor from "./TelaProjetor";
import { chapters, ou } from "@/lib/chapters";

/**
 * Capitulo 04. O Andre como palestrante, falando com quem CONTRATA:
 * organizador de evento, empresa, associacao. Campo claro, areia com marrom
 * cafe, e o mais editorial do site — titulo em largura normal e a citacao
 * grande em italico.
 *
 * Esqueleto normal do <Chapter>, sem nenhum slot novo. Duas decisoes de
 * encaixe que valem ser lidas antes de mexer:
 *
 * - **O bloco editorial (temas + tela + citacao) entra pelo slot `provas`.**
 *   Ele e exatamente a regiao entre o subtitulo e os CTAs, que e onde este
 *   bloco tem que ficar: prova antes do pedido. O invólucro daquele slot e um
 *   flex com wrap e gap; passando UM filho so, com `flex: 1 1 100%`, o wrap e o
 *   gap viram inertes e ele se comporta como bloco. Assim o capitulo 04 nao
 *   precisou de slot novo no esqueleto.
 * - **Os campos e o botao entram juntos pelo slot `ctaPrincipal`**, porque sao
 *   a mesma coisa: os campos so existem pra montar o link do botao. Como nao
 *   ha `ctaSecundario`, o invólucro fica com um filho unico e o `sm:flex-row`
 *   dele nao muda nada.
 *
 * Sem `<Proof>` de proposito: nao existe UM numero confirmado sobre as
 * palestras do Andre. O unico numero da tela e o "3x" da citacao, que e
 * afirmacao da Harvard Business Review e vem com a fonte colada embaixo.
 */
export default function Palestras() {
  const cap = chapters[4];
  const conteudo = cap.conteudo;
  if (!conteudo) return null;

  const { temas, citacao, foto, ctaPrincipal, briefing } = conteudo;

  return (
    <Chapter
      cap={cap}
      titulo={conteudo.titulo}
      subtitulo={conteudo.subtitulo}
      provas={
        <div className="pl-editorial">
          {temas && temas.length > 0 && (
            <ul className="pl-temas">
              {temas.map((tema) => (
                <li className="pl-tema" key={tema}>
                  {tema}
                </li>
              ))}
            </ul>
          )}

          <TelaProjetor foto={foto} />

          {citacao?.texto && citacao.fonte && (
            <Citacao texto={citacao.texto} fonte={citacao.fonte} />
          )}
        </div>
      }
      ctaPrincipal={
        ctaPrincipal && (
          <ConviteParaPalestrar
            capitulo={cap.id}
            href={ou(ctaPrincipal.href)}
            rotulo={ctaPrincipal.rotulo}
            briefing={briefing}
          />
        )
      }
    />
  );
}
