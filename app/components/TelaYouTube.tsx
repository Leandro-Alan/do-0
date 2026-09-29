import FachadaVideo from "./FachadaVideo";
import TreatedImage from "./TreatedImage";
import type { Foto } from "@/lib/chapters";
import type { Video } from "@/lib/youtube";
import LinkExterno from "./LinkExterno";

/**
 * A midia do capitulo 05, nos dois estados possiveis.
 *
 * **Com feed:** o video mais recente grande em 16:9, e mais tres num trilho
 * horizontal com scroll-snap.
 *
 * **Sem feed** (sem `channelId`, id invalido, feed fora do ar, XML estranho):
 * o bloco de reserva — a mesma caixa 16:9, com a foto do Andre em vermelho e
 * uma marca de play. Ele nao e um remendo: e uma tela inteira, e a regra da
 * demo (dado faltando some, nunca vira caixa cinza) continua valendo porque
 * nada ali promete um video que nao existe.
 *
 * **O play da reserva so e clicavel quando existe canal pra abrir.** Sem link
 * ele nasce `aria-hidden` e sem foco: botao de play que nao toca nada e
 * exatamente o tipo de promessa vazia que a demo proibe. Com o link, o bloco
 * inteiro vira o atalho pro canal.
 */
export default function TelaYouTube({
  videos,
  foto,
  canal,
  capitulo,
}: {
  videos: Video[] | null;
  foto?: Foto;
  /** pagina do canal, ou undefined quando o Leandro ainda nao preencheu */
  canal?: string;
  capitulo: string;
}) {
  if (videos && videos.length > 0) {
    const [primeiro, ...resto] = videos;
    const trilho = resto.slice(0, 3);

    return (
      <div className="yt-tela">
        <FachadaVideo id={primeiro.id} titulo={primeiro.titulo} />

        {trilho.length > 0 && (
          <ul className="yt-trilho">
            {trilho.map((video) => (
              <li className="yt-trilho-item" key={video.id}>
                <FachadaVideo id={video.id} titulo={video.titulo} tamanho="cartao" />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (!foto) return null;

  const miolo = (
    <>
      <TreatedImage
        src={foto.src}
        alt={foto.alt}
        largura={foto.largura}
        altura={foto.altura}
        modo="capa"
        /* Alto de proposito, e so funciona porque o CSS escurece a luz do
           duotone antes (ver .yt-reserva em globals.css). Com o vermelho puro
           na luz, 0.75 estouraria a pele; com ele escurecido, 0.75 e o ponto
           em que a foto vira tela acesa sem perder o rosto. */
        forca={0.75}
        sizes="(min-width: 900px) 480px, 92vw"
      />
      <span className="yt-reserva-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
          <path d="M9 6.5v11l9-5.5-9-5.5Z" />
        </svg>
      </span>
    </>
  );

  return (
    <div className="yt-tela">
      {canal ? (
        <LinkExterno
          className="yt-reserva yt-reserva--link"
          href={canal}
          capitulo={capitulo}
          nome="reserva_canal"
        >
          {miolo}
          <span className="yt-reserva-rotulo">Ver o canal</span>
        </LinkExterno>
      ) : (
        <figure className="yt-reserva">{miolo}</figure>
      )}
    </div>
  );
}
