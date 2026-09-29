import Image from "next/image";
import Chapter from "./Chapter";
import Cta from "./Cta";
import FaixaFotos from "./FaixaFotos";
import ListrasFortix from "./ListrasFortix";
import Proof from "./Proof";
import { chapters, ou } from "@/lib/chapters";

/**
 * Capitulo 02. Campo claro de concreto, grafite e as tres listras do logo.
 * Sobrio: e clube, nao promocao.
 *
 * Esqueleto normal do <Chapter>. O elemento-assinatura sao as listras (slot
 * `midia`, porque atravessam a secao inteira por tras do texto) e a galeria vem
 * no slot `assinatura`, no pe — hoje vazia, porque nao existe foto da Fortix.
 */
export default function Fortix() {
  const cap = chapters[2];
  const conteudo = cap.conteudo;
  if (!conteudo) return null;

  const { marca, provas, ctaPrincipal, ctaSecundario } = conteudo;

  return (
    <Chapter
      cap={cap}
      midia={<ListrasFortix />}
      titulo={
        <>
          {marca && (
            // pastilha grafite: o arquivo tem fundo escuro proprio e so 150px,
            // entao ele nunca aparece solto nem maior que o tamanho real
            <span className="fx-pastilha">
              <Image
                src={marca.src}
                alt={marca.alt}
                width={marca.largura}
                height={marca.altura}
                sizes="120px"
              />
            </span>
          )}
          {conteudo.titulo}
          {conteudo.assinatura && <span className="fx-descritor">{conteudo.assinatura}</span>}
        </>
      }
      subtitulo={
        <>
          {conteudo.subtitulo}
          {conteudo.texto && <span className="fx-texto">{conteudo.texto}</span>}
        </>
      }
      provas={provas?.map((prova) => <Proof prova={prova} key={prova.rotulo} />)}
      ctaPrincipal={
        ctaPrincipal && <Cta href={ou(ctaPrincipal.href)} capitulo={cap.id} nome="whatsapp">
            {ctaPrincipal.rotulo}
          </Cta>
      }
      ctaSecundario={
        ctaSecundario && (
          <Cta
            href={ou(ctaSecundario.href)}
            capitulo={cap.id}
            nome="instagram"
            variante="secundario"
          >
            {ctaSecundario.rotulo}
          </Cta>
        )
      }
      assinatura={<FaixaFotos fotos={conteudo.fotos} />}
    />
  );
}
