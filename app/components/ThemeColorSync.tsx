"use client";

import { useEffect } from "react";

/**
 * Faz a barra do navegador acompanhar o capitulo ativo. E o detalhe que vende
 * o efeito no celular: a UI do telefone muda de cor junto com a pagina.
 *
 * Nao renderiza nada — mexe na <meta> que o layout ja deixou pronta.
 */
export default function ThemeColorSync({ cor }: { cor: string }) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = cor;
  }, [cor]);

  return null;
}
