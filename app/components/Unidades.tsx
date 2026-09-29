import LinkExterno from "./LinkExterno";
import { comoChegar } from "@/lib/chapters";
import type { Unidade } from "@/lib/chapters";

/**
 * Onde a barbearia fica e a que horas abre.
 *
 * O prompt do capítulo falava de UM endereço. São **três** — e isso não é
 * detalhe de layout, é o fato mais forte do capítulo: três endereços em
 * Jacareí dizem sozinhos o tamanho da coisa, sem precisar de um número que
 * envelhece.
 *
 * Nada aqui renderiza sem dado: sem unidades, some a lista; sem horários, some
 * a tabela; sem as duas, o componente devolve `null` e o capítulo fecha com
 * título, foto e CTA. É a regra da demo — dado faltando não vira moldura
 * vazia.
 *
 * O "Como chegar" prefere a ficha oficial no Google Maps e, sem ela, monta uma
 * busca pelo endereço escrito (ver `comoChegar` em lib/chapters.ts). Os dois
 * caminhos funcionam; o segundo só cai numa lista em vez da ficha.
 */
const slug = (nome: string) =>
  nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");

export default function Unidades({
  unidades,
  horarios,
  capitulo,
}: {
  unidades?: Unidade[];
  horarios?: { dias: string; horas: string }[];
  capitulo: string;
}) {
  const temUnidades = Boolean(unidades && unidades.length > 0);
  const temHorarios = Boolean(horarios && horarios.length > 0);
  if (!temUnidades && !temHorarios) return null;

  return (
    <div className="ba-lugares">
      {temUnidades && (
        <ul className="ba-unidades">
          {unidades!.map((u) => (
            <li className="ba-unidade" key={u.nome}>
              <p className="ba-unidade-nome">{u.nome}</p>
              <p className="ba-unidade-endereco">
                {u.endereco}
                {u.local && (
                  <>
                    <br />
                    <span className="ba-unidade-local">{u.local}</span>
                  </>
                )}
              </p>
              <LinkExterno
                className="ba-chegar"
                href={comoChegar(u)}
                capitulo={capitulo}
                nome={`como_chegar_${slug(u.nome)}`}
              >
                Como chegar
                <Alfinete />
                {/* o nome da unidade entra no nome acessivel: fora de contexto,
                    tres links iguais dizendo "Como chegar" nao se distinguem */}
                <span className="sr-only"> — {u.nome}</span>
              </LinkExterno>
            </li>
          ))}
        </ul>
      )}

      {temHorarios && (
        <dl className="ba-horarios">
          {horarios!.map((h) => (
            <div className="ba-horario" key={h.dias}>
              <dt>{h.dias}</dt>
              <dd>{h.horas}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Alfinete() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5S13 9.9 13 6.4A5 5 0 0 0 3 6.4C3 9.9 8 14.5 8 14.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.3" r="1.7" fill="currentColor" />
    </svg>
  );
}
