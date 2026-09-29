import Chapter from "./Chapter";
import Cracha, { ProvedorNome } from "./Cracha";
import Cta from "./Cta";
import CtaVaga from "./CtaVaga";
import Proof from "./Proof";
import { chapters, ou } from "@/lib/chapters";

/**
 * Capitulo 03. Certificacao para donos e gestores de barbearia: azul marinho
 * chapado, branco, o simbolo quadrado do logo e o xadrez dos paineis do evento.
 * Institucional — e diploma, nao promocao.
 *
 * Esqueleto normal do <Chapter>. O cracha entra pelo slot `midia` porque ele
 * ocupa o lugar que uma foto ocuparia (nao existe foto nenhuma do Choque), e a
 * O pe do capitulo era uma faixa de xadrez com o lema correndo em laco; saiu
 * em 29/09 a pedido do Leandro ("ela esta perdida aqui"). O FaixaLema.tsx
 * continua no projeto, sem uso, como o Unidades.tsx.
 *
 * O <ProvedorNome> abraca o capitulo inteiro porque o cracha e o CTA dividem o
 * mesmo estado e vivem em slots diferentes. Ele nao emite DOM: o marco e a
 * secao continuam irmaos diretos de .pilha.
 */
export default function Choque() {
  const cap = chapters[3];
  const conteudo = cap.conteudo;
  if (!conteudo) return null;

  const { provas, ctaPrincipal, ctaSecundario } = conteudo;

  return (
    <ProvedorNome>
      <Chapter
        cap={cap}
        midia={<Cracha nome={cap.nome} lema={conteudo.lema} />}
        subtitulo={
          <>
            {conteudo.subtitulo}
            {conteudo.texto && <span className="cq-texto">{conteudo.texto}</span>}
          </>
        }
        provas={provas?.map((prova) => <Proof prova={prova} key={prova.rotulo} />)}
        ctaPrincipal={
          ctaPrincipal && (
            <CtaVaga
              capitulo={cap.id}
              href={ou(ctaPrincipal.href)}
              rotulo={ctaPrincipal.rotulo}
              rotuloComNome={ctaPrincipal.rotuloComNome}
            />
          )
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
      />
    </ProvedorNome>
  );
}
