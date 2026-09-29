"use client";

import type { CSSProperties } from "react";
import { chapters } from "@/lib/chapters";

/**
 * Um traco por capitulo, na cor de acento do capitulo ativo. Vertical a
 * direita no desktop, fita horizontal no topo no celular.
 *
 * Cada traco e um <button> de 28px de alvo, ainda que o risco visivel tenha
 * 3px — dedo nao acerta 3px.
 */
export default function ProgressRail({
  ativo,
  cor,
  onIr,
}: {
  ativo: number;
  cor: string;
  onIr: (indice: number) => void;
}) {
  return (
    <nav
      className="rail"
      style={{ "--rail-cor": cor } as CSSProperties}
      aria-label="Capítulos"
    >
      {chapters.map((cap, i) => (
        <button
          key={cap.id}
          type="button"
          className="rail-traco"
          aria-current={i === ativo ? "true" : undefined}
          aria-label={`${cap.numero === "00" ? "Início" : cap.nome}`}
          onClick={() => onIr(i)}
        />
      ))}
    </nav>
  );
}
