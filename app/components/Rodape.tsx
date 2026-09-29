import type { CSSProperties } from "react";
import LinkExterno from "./LinkExterno";
import MarcaSotalia from "./MarcaSotalia";
import { DM, chapters } from "@/lib/chapters";

/**
 * Fecha o círculo: volta à paleta do capítulo 00.
 *
 * Fica FORA da pilha. O último capítulo não é coberto por ninguém — ele vai
 * embora normalmente e o rodapé aparece atrás, em fluxo. Por isso ele não usa
 * `<Chapter>`: não é capítulo, é o fim da página.
 *
 * O índice aqui é o do hero de novo, e isso é de propósito. Quem chegou ao pé
 * da página rolou sete telas; obrigar essa pessoa a voltar ao topo pra trocar
 * de assunto é o tipo de detalhe que faz ela fechar a aba. As amostras de cor
 * são as mesmas do hero, então a memória visual funciona nos dois lugares.
 *
 * As âncoras do índice apontam pro MARCO de cada capítulo, e não pra seção:
 * seção sticky grudada no topo devolve `rect.top = 0` e o navegador conclui
 * que já chegou. Mesma regra do `Indice`.
 *
 * O crédito da Sotalia é discreto de propósito — é assinatura de quem fez, não
 * anúncio. É a MESMA de todos os sites da casa: a marca dos cinco pontos (o
 * salto do golfinho), "feito por Sotalia Hub", e os pontos pulando em sequência
 * quando o mouse passa. Igual está no site da Santo Visu.
 */

const ANO = 2026;
/**
 * A assinatura leva pro WhatsApp do Leandro, com a mensagem pronta — mesmo
 * arranjo do site da Santo Visu, trocando o nome do site na frase. Quem clica
 * em "feito por" viu o site e quer um igual: o caminho mais curto e a conversa.
 * `encodeURIComponent` e nao `URLSearchParams`: o segundo troca espaco por "+".
 */
const SOTALIA = `https://api.whatsapp.com/send/?phone=5511957610725&text=${encodeURIComponent(
  "Oi! Vi o site do André Alves e quero um site assim pro meu negócio."
)}&type=phone_number&app_absent=0`;

export default function Rodape() {
  const capa = chapters[0];
  const p = capa.paleta;
  const frentes = chapters.slice(1);

  const vars = {
    "--bg": p.bg,
    "--fg": p.fg,
    "--muted": p.muted,
    "--accent": p.accent,
    "--accent-fg": p.accentFg,
  } as CSSProperties;

  return (
    <footer className="rodape" style={vars}>
      <div className="rodape-topo">
        <div className="rodape-marca">
          <p className="rodape-nome">{capa.nome}</p>
          {capa.conteudo?.assinatura && (
            <p className="rodape-assinatura">{capa.conteudo.assinatura}</p>
          )}

          {capa.links.instagram && (
            <LinkExterno
              href={capa.links.instagram}
              capitulo={capa.id}
              nome="instagram_rodape"
              className="rodape-ig"
            >
              @andresantovisu
            </LinkExterno>
          )}
        </div>

        <nav className="rodape-indice" aria-label="Ir para um capítulo">
          {frentes.map((frente) => (
            <a key={frente.id} href={`#${frente.id}`} className="rodape-link">
              <span
                className="rodape-cor"
                aria-hidden="true"
                style={{ background: frente.paleta.bg }}
              />
              <span className="rodape-link-nome">{frente.nome}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="rodape-base">
        <p>
          © {ANO} {capa.nome}
        </p>

        <LinkExterno
          href={SOTALIA}
          capitulo="rodape"
          nome="sotalia"
          className="rodape-assinatura-sotalia"
          aria-label="Site feito por Sotalia Hub"
        >
          <MarcaSotalia className="rodape-golfinho" />
          <span>
            feito por <b>Sotalia Hub</b>
          </span>
        </LinkExterno>
      </div>

      {/* O caminho de contato fica por último e continua sendo o maior
          elemento do rodapé: é a única coisa aqui que a pessoa pode querer
          fazer, e não um link de navegação. */}
      <LinkExterno href={DM} capitulo="rodape" nome="direct" className="rodape-direct">
        Chamar no direct
      </LinkExterno>
    </footer>
  );
}
