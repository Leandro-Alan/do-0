"use client";

import Cta from "./Cta";
import { useNome } from "./Cracha";

/**
 * O CTA principal do capitulo 03. O link e sempre o mesmo; o que muda e o
 * rotulo: enquanto o cracha estiver em branco ele vende a vaga em geral, e
 * assim que o visitante escreve o nome a vaga passa a ser a DELE.
 *
 * O servidor sempre escreve o rotulo neutro (o nome comeca vazio), entao nao ha
 * diferenca entre o HTML do servidor e o primeiro render do cliente.
 */
export default function CtaVaga({
  href,
  capitulo,
  rotulo,
  rotuloComNome,
}: {
  href: string;
  capitulo: string;
  rotulo: string;
  /** "{nome}" e trocado pelo que a pessoa digitou. Sem isso, rotulo fixo. */
  rotuloComNome?: string;
}) {
  const { nome } = useNome();
  const limpo = nome.trim();
  const texto = limpo && rotuloComNome ? rotuloComNome.replace("{nome}", limpo) : rotulo;

  // `nome="vaga"` fixo: com o nome digitado o rotulo vira "Garantir a vaga de
  // Fulano", e cada visitante viraria um evento diferente no relatorio.
  return (
    <Cta href={href} capitulo={capitulo} nome="vaga">
      {texto}
    </Cta>
  );
}
