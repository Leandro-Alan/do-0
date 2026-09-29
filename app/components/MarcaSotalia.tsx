/**
 * A marca da Sotalia: cinco pontos em arco, o salto do golfinho. Mesma
 * geometria dos outros sites da casa (`clientes/santo-visu`,
 * `empresa/sotalia/site`) — a assinatura tem que ser a mesma em todos.
 *
 * Cada ponto leva a classe `sot-ponto`, e é ela que o CSS usa pra dar o
 * pulinho em sequência quando o mouse passa pela assinatura. O atraso vem
 * inline porque é uma escada de 70ms por ponto: em CSS viraria cinco regras
 * `:nth-child` pra dizer a mesma coisa.
 */
export default function MarcaSotalia({ className }: { className?: string }) {
  const pontos: [number, number, number][] = [
    [2.5, 20, 1.5],
    [7.2, 12.8, 1.55],
    [12.4, 6.6, 2.2],
    [17.4, 10.8, 1.55],
    [21.6, 17.6, 1.5],
  ];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      overflow="visible"
      className={className}
    >
      <path
        d="M2.5 20 7.2 12.8 12.4 6.6 17.4 10.8 21.6 17.6"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      {pontos.map(([cx, cy, r], i) => (
        <circle
          key={i}
          className="sot-ponto"
          style={{ animationDelay: `${i * 70}ms` }}
          cx={cx}
          cy={cy}
          r={r}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
