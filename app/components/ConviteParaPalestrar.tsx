"use client";

import { useState } from "react";
import Cta from "./Cta";
import type { Conteudo } from "@/lib/chapters";

type Briefing = NonNullable<Conteudo["briefing"]>;

/** teto por campo: e mensagem de WhatsApp, nao formulario de cadastro */
const MAX = 60;

/** So wa.me tem mensagem pra montar. Qualquer outro destino nao tem. */
const ehWhatsApp = (href: string) => /^https:\/\/wa\.me\//i.test(href.trim());

/**
 * O CTA do capitulo 04 e os quatro campos opcionais que vao junto nele.
 *
 * Os dois vivem no MESMO componente porque sao a mesma coisa: o botao nao tem
 * estado proprio, ele so le o que a pessoa escreveu. Foi o que dispensou o
 * provedor de contexto que o capitulo 03 precisou — la o cracha e o CTA estao
 * em slots diferentes do <Chapter>, aqui estao lado a lado.
 *
 * O briefing SO aparece quando o destino e wa.me. Em e-mail, formulario, ou no
 * fallback da DM nao existe mensagem pra montar, e quatro campos que nao levam
 * nada a lugar nenhum seriam pior que nao ter campo. Nesse caso sobra o botao.
 *
 * Nada e salvo e nada e enviado daqui: nao ha <form> nem chamada de rede. O
 * texto vai como parametro do link, e quem envia e o WhatsApp da pessoa.
 *
 * Servidor e primeiro render do cliente escrevem o mesmo href (todos os campos
 * comecam vazios), entao nao ha divergencia na hidratacao.
 */
export default function ConviteParaPalestrar({
  href,
  capitulo,
  rotulo,
  briefing,
}: {
  href: string;
  capitulo: string;
  rotulo: string;
  briefing?: Briefing;
}) {
  const campos = ehWhatsApp(href) ? briefing?.campos ?? [] : [];
  const [valores, setValores] = useState<string[]>(() => campos.map(() => ""));

  if (campos.length === 0)
    return (
      <Cta href={href} capitulo={capitulo} nome="proposta">
        {rotulo}
      </Cta>
    );

  const preenchidos = campos
    .map((campo, i) => ({ chave: campo.naMensagem, valor: (valores[i] ?? "").trim() }))
    .filter((c) => c.valor);

  const mensagem = [
    briefing?.saudacao ?? "",
    ...preenchidos.map((c) => `${c.chave}: ${c.valor}.`),
  ]
    .filter(Boolean)
    .join(" ");

  // encodeURIComponent, nao URLSearchParams: searchParams troca espaco por "+",
  // e o wa.me mostra o "+" literal na caixa de mensagem.
  const destino = `${href}${href.includes("?") ? "&" : "?"}text=${encodeURIComponent(mensagem)}`;

  const escrever = (i: number, valor: string) =>
    setValores((atual) => atual.map((v, j) => (j === i ? valor.slice(0, MAX) : v)));

  return (
    <div className="pl-convite">
      <p className="pl-convite-nota">Tudo opcional — o que você preencher vai junto na mensagem.</p>

      <div className="pl-campos">
        {campos.map((campo, i) => (
          <label className="pl-campo" key={campo.naMensagem}>
            <span className="pl-campo-rotulo">{campo.rotulo}</span>
            <input
              className="pl-campo-input"
              type="text"
              placeholder={campo.dica}
              value={valores[i] ?? ""}
              maxLength={MAX}
              autoComplete="off"
              enterKeyHint="next"
              onChange={(e) => escrever(i, e.target.value)}
            />
          </label>
        ))}
      </div>

      <Cta href={destino} capitulo={capitulo} nome="proposta">
        {rotulo}
      </Cta>
    </div>
  );
}
