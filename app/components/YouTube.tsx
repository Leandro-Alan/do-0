import Chapter from "./Chapter";
import Cta from "./Cta";
import TelaYouTube from "./TelaYouTube";
import TvLiga from "./TvLiga";
import { chapters, ou } from "@/lib/chapters";
import { ultimosVideos } from "@/lib/youtube";

/**
 * Capitulo 05. Preto quase puro com o vermelho do YouTube. E o capitulo
 * "tela": o video e o protagonista, e todo o resto se encolhe pra ele caber.
 *
 * **Server Component assincrono.** A leitura do feed acontece no servidor, no
 * build, e vale 6 horas (`REVALIDA_YOUTUBE`). Quem abre o site nunca fala com
 * o YouTube — nem pra saber que videos existem, nem pra montar a fachada. A
 * primeira e unica requisicao ao dominio deles sai quando alguem toca no play.
 *
 * `ultimosVideos` NUNCA lanca: sem `channelId` ela nem sai pra rede, e
 * qualquer falha vira `null`. Um `throw` aqui derrubaria a pagina inteira, e a
 * regra da demo e que nada apareca quebrado.
 *
 * A midia vai pelo slot `midia`, como o cracha do 03: no celular ela e a
 * primeira faixa do capitulo (o video vem antes do titulo, porque ele E o
 * capitulo) e no desktop sai do fluxo pra direita.
 */
export default async function YouTube() {
  const cap = chapters[5];
  const conteudo = cap.conteudo;
  if (!conteudo) return null;

  const { ctaPrincipal } = conteudo;
  const videos = await ultimosVideos(cap.links.channelId);
  const canal = cap.links.canal?.trim() || undefined;

  return (
    <Chapter
      cap={cap}
      titulo={conteudo.titulo}
      subtitulo={conteudo.subtitulo}
      midia={<TelaYouTube videos={videos} foto={conteudo.foto} canal={canal} capitulo={cap.id} />}
      ctaPrincipal={
        ctaPrincipal && <Cta href={ou(ctaPrincipal.href)} capitulo={cap.id} nome="inscrever">
            {ctaPrincipal.rotulo}
          </Cta>
      }
      assinatura={<TvLiga />}
    />
  );
}
