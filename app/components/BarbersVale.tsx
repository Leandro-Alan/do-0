import Chapter from "./Chapter";
import Contagem from "./Contagem";
import Cordilheira from "./Cordilheira";
import Cta from "./Cta";
import CtaIngresso from "./CtaIngresso";
import TreatedImage from "./TreatedImage";
import { chapters, ou } from "@/lib/chapters";

/**
 * Capitulo 01. E TEASER, nao pagina de evento: o Barbers Vale ja tem uma
 * landing propria (links.lp) e reproduzir a LP aqui so atrapalha os dois.
 * Impacto, os tres fatos que importam, e um clique pra la.
 *
 * Usa o esqueleto normal do <Chapter> — nada de `corpo`, que e exclusividade
 * da capa. A contagem entra pelo slot `assinatura`, que e exatamente pra que
 * ele existe: o elemento-assinatura do capitulo.
 */
export default function BarbersVale() {
  const cap = chapters[1];
  const { conteudo, evento } = cap;
  if (!conteudo || !evento) return null;

  const foto = conteudo.foto;
  const principal = conteudo.ctaPrincipal;
  const secundario = conteudo.ctaSecundario;

  // so vira linha de fatos o que existe de verdade; campo vazio nao vira "·" solto
  const fatos = [evento.rotulo, evento.local, evento.cidade].filter(Boolean);

  return (
    <Chapter
      cap={cap}
      midia={
        <>
          <Cordilheira />
          {foto && (
            <div className="bv-foto">
              <TreatedImage
                src={foto.src}
                alt={foto.alt}
                largura={foto.largura}
                altura={foto.altura}
                modo="capa"
                // verde forte o bastante pra matar o vermelho das poltronas, fraco
                // o bastante pra nao virar filtro neon — acima de ~0.6 o acento
                // come a pele, o mesmo limite que o hero achou com o ouro
                forca={0.55}
                sizes="(min-width: 900px) 42vw, 100vw"
              />
              <span className="bv-foto-degrade" aria-hidden="true" />
            </div>
          )}
        </>
      }
      titulo={
        <>
          <span className="bv-marca" aria-hidden="true" />
          {conteudo.titulo}
          {evento.edicao && <span className="bv-edicao">{evento.edicao}</span>}
        </>
      }
      subtitulo={
        <>
          {conteudo.subtitulo}
          {fatos.length > 0 && (
            <span className="bv-fatos">
              {fatos.map((fato, i) => (
                // o separador vem DEPOIS do fato, nunca antes: no celular a
                // linha quebra, e linha nova comecando com "·" fica torta
                <span className="bv-fato" key={fato}>
                  {fato}
                  {i < fatos.length - 1 && (
                    <span className="bv-fatos-sep" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </span>
          )}
        </>
      }
      ctaPrincipal={
        principal && (
          <CtaIngresso
              capitulo={cap.id}
            evento={evento}
            href={ou(principal.href)}
            rotulo={principal.rotulo}
            rotuloDepois={principal.rotuloDepois ?? principal.rotulo}
          />
        )
      }
      ctaSecundario={
        secundario && (
          <Cta
            href={ou(secundario.href)}
            capitulo={cap.id}
            nome="instagram"
            variante="secundario"
          >
            {secundario.rotulo}
          </Cta>
        )
      }
      assinatura={<Contagem evento={evento} />}
    />
  );
}
