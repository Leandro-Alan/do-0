/**
 * O selo da barbearia, em duas peças: o ANEL (o texto circular "SANTO VISU ·
 * BARBEARIA") e o MIOLO (o frade). O anel gira devagar e sem parar — carimbo
 * virando engrenagem, não carimbo assentando.
 *
 * **Só o anel gira; o frade fica em pé.** Girar o selo inteiro faria o rosto
 * dele dar voltas, que é o contrário de um carimbo. As duas peças existirem
 * separadas é o que torna isso possível — elas vêm assim de
 * `scripts/selo-santovisu.mjs`.
 *
 * Os dois SVG entram como `mask-image`, nunca como `<img>`: a cor sai do
 * `--fg` do capítulo. Mesmo arranjo da marca do Barbers Vale no 01.
 *
 * **O giro é CSS puro (`@keyframes ba-girar`), não GSAP.** Até 29/09 ele
 * assentava uma vez, disparado por `useAoAtivar` quando a Barbearia virava o
 * capítulo ativo — pedido do Leandro depois foi deixar girando sem parar, e
 * pra isso não faz sentido continuar em JS: uma animação de `transform`
 * infinita não precisa de gatilho nenhum, começa sozinha e nunca decide
 * parar. Também evita o efeito colateral de misturar os dois: GSAP escreve
 * `style.transform` inline, que sempre vence a `animation` da folha — as
 * duas juntas travariam o giro contínuo no ângulo onde o JS o deixasse.
 * `prefers-reduced-motion` mora inteiro no CSS, ver globals.css.
 */
export default function SeloSantoVisu({
  variante = "marca",
}: {
  /**
   * "marca"  = a marca d'agua grande sangrando na borda (desktop).
   * "inline" = o selo pequeno ao lado do texto de apoio (celular). No celular
   *            a marca d'agua caia no pe do capitulo, atras do botao, e o
   *            Leandro pediu o selo ao lado de "Onde tudo comecou". O CSS mostra
   *            um ou outro, nunca os dois.
   */
  variante?: "marca" | "inline";
}) {
  return (
    // `role="img"` com nome: o selo e a assinatura da casa e leitor de tela
    // precisa saber que ele esta ali. As duas peças sozinhas nao dizem nada.
    // <span>, nao <div>: a variante inline mora dentro do <p> do subtitulo
    <span
      className={`ba-selo ba-selo--${variante}`}
      role="img"
      aria-label="Selo da Santo Visu Barbearia"
    >
      <span className="ba-selo-anel" aria-hidden="true" />
      <span className="ba-selo-miolo" aria-hidden="true" />
    </span>
  );
}
