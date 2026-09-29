import Chapter from "./Chapter";
import Cta from "./Cta";
import MosaicoBarbearia from "./MosaicoBarbearia";
import SeloSantoVisu from "./SeloSantoVisu";
import { chapters, ou } from "@/lib/chapters";

/**
 * Capítulo 06. Onde tudo começou: mostarda e marrom couro, tijolo, madeira e o
 * selo dourado. Quente e acolhedor — ele fecha a página pra cima.
 *
 * **É o último, e o único que não é coberto por ninguém**: sai do sticky
 * (`ultimo`) e o rodapé vem depois dele em fluxo normal. Por isso é o único
 * capítulo em que passar de uma tela não custa nada — a base dele não some
 * embaixo de ninguém.
 *
 * Esqueleto normal do `<Chapter>`, sem slot novo. Os encaixes:
 *   `midia`       → o mosaico de fotos
 *   `assinatura`  → o selo que gira
 *
 * **Um CTA só, e ele leva pro site da barbearia.** Os endereços saíram daqui em
 * 29/09: este capítulo apresenta a barbearia, não é a ficha dela. Endereço,
 * horário e agendamento já existem no site da Santo Visu, com seletor de
 * unidade — e é pra lá que o botão vai. Um segundo botão "Conhecer a
 * barbearia" iria pro mesmo lugar, então não existe.
 *
 * O `Unidades.tsx` continua no projeto, pronto e testado, caso isso volte.
 */
export default function Barbearia() {
  const cap = chapters[6];
  const conteudo = cap.conteudo;
  if (!conteudo) return null;

  const { fotos, ctaPrincipal } = conteudo;

  return (
    <Chapter
      cap={cap}
      ultimo
      titulo={conteudo.titulo}
      subtitulo={
        <>
          {conteudo.subtitulo}
          {conteudo.texto && <span className="ba-texto">{conteudo.texto}</span>}
        </>
      }
      midia={<MosaicoBarbearia fotos={fotos} />}
      ctaPrincipal={
        ctaPrincipal && <Cta href={ou(ctaPrincipal.href)} capitulo={cap.id} nome="agendar">
            {ctaPrincipal.rotulo}
          </Cta>
      }
      assinatura={<SeloSantoVisu />}
    />
  );
}
