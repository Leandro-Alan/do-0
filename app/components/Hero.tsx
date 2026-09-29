import Chapter from "./Chapter";
import LinkExterno from "./LinkExterno";
import EntradaHero from "./EntradaHero";
import Indice from "./Indice";
import SeloEvento from "./SeloEvento";
import TreatedImage from "./TreatedImage";
import { chapters, eventoVigente } from "@/lib/chapters";

/**
 * Capitulo 00. Nao e um capitulo de negocio: e capa e INDICE.
 *
 * Quem chega veio da bio do Instagram e ja sabe quem e o Andre — entao o hero
 * apresenta em uma frase e entrega, na mesma tela, os seis caminhos. Um toque
 * leva a pessoa ao que ela veio buscar.
 *
 * Servidor de proposito: o indice tem que existir no HTML e ser clicavel antes
 * de qualquer JS rodar. Quem anima e o <EntradaHero>, que so envolve.
 */
export default function Hero() {
  const cap = chapters[0];
  const destinos = chapters.slice(1);
  const barbersvale = chapters[1];
  const mostrarSelo = eventoVigente(barbersvale.evento);

  const foto = cap.conteudo?.foto;

  return (
    <Chapter
      cap={cap}
      corpo={
        <EntradaHero>
          <div className="hero">
            {foto && (
              <div className="hero-foto" data-entrada="foto">
                <TreatedImage
                  src={foto.src}
                  alt={foto.alt}
                  largura={foto.largura}
                  altura={foto.altura}
                  modo="capa"
                  // duotone quente (breu -> ouro), leve: e o rosto dele, nao
                  // pode virar cartaz. A foto boa aguenta pouco tratamento.
                  forca={0.38}
                  // a unica imagem do site com priority: e o LCP
                  prioridade
                  sizes="(min-width: 900px) 46vw, 100vw"
                />
                <span className="hero-degrade" aria-hidden="true" />
              </div>
            )}

            <div className="hero-corpo">
              <h1 className="hero-nome" id="hero-titulo">
                {cap.nome.split(" ").map((linha) => (
                  <span className="hero-linha" data-entrada="linha" key={linha}>
                    <span>{linha}</span>
                  </span>
                ))}
              </h1>

              {cap.conteudo?.assinatura && (
                <p className="hero-assinatura" data-entrada="texto">
                  {cap.conteudo.assinatura}
                </p>
              )}

              {cap.conteudo?.subtitulo && (
                <p className="hero-frase" data-entrada="texto">
                  {cap.conteudo.subtitulo}
                </p>
              )}

              {mostrarSelo && barbersvale.evento && (
                <SeloEvento
                  evento={barbersvale.evento}
                  destino={`#${barbersvale.id}`}
                  cor={barbersvale.paleta.accent}
                />
              )}

              <Indice destinos={destinos} />
            </div>

            {cap.links.instagram && (
              <LinkExterno
                href={cap.links.instagram}
                capitulo={cap.id}
                nome="instagram"
                className="hero-ig"
                aria-label="Instagram do André"
              >
                <IconeInstagram />
              </LinkExterno>
            )}
          </div>
        </EntradaHero>
      }
    />
  );
}

function IconeInstagram() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.15" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.35" cy="6.65" r="1.15" fill="currentColor" />
    </svg>
  );
}
