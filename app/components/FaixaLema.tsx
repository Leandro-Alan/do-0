/**
 * A faixa do pe do capitulo 03: xadrez preto e branco (o dos paineis do evento)
 * com a frase do Choque passando devagar.
 *
 * O marquee e CSS puro — uma animacao de `translateX(-50%)` sobre um trilho com
 * a lista DUPLICADA EXATAMENTE DUAS VEZES. E a duplicacao que fecha o laco: a
 * -50% o segundo bloco esta onde o primeiro comecou, entao a volta ao inicio
 * nao tem emenda. Mexer no numero de tiras quebra isso; mexer no numero de
 * repeticoes DENTRO da tira, nao.
 *
 * A faixa inteira e `aria-hidden`: e a repeticao decorativa de uma frase que o
 * leitor de tela ja recebeu como subtitulo do capitulo. Anunciar oito vezes a
 * mesma coisa so atrapalha.
 */

/** repeticoes por tira: o bastante pra tira sozinha ja cobrir uma tela larga. */
const REPETICOES = 8;

export default function FaixaLema({ frase }: { frase?: string }) {
  if (!frase || !frase.trim()) return null;

  // a frase chega como subtitulo ("A gestão muda quando você muda."); na faixa
  // ela vira letreiro, e letreiro nao leva ponto final
  const letreiro = frase.trim().replace(/\.+$/, "");

  const tira = (
    <span className="cq-tira">
      {Array.from({ length: REPETICOES }, (_, i) => (
        <span className="cq-item" key={i}>
          {letreiro}
          <span className="cq-ponto" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="cq-faixa" aria-hidden="true">
      <span className="cq-xadrez" />
      <div className="cq-marquee">
        <div className="cq-trilho">
          {tira}
          {tira}
        </div>
      </div>
      <span className="cq-xadrez" />
    </div>
  );
}
