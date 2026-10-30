import Barbearia from "./components/Barbearia";
import BarbersVale from "./components/BarbersVale";
import ChapterStack from "./components/ChapterStack";
import Choque from "./components/Choque";
import Fortix from "./components/Fortix";
import Hero from "./components/Hero";
import Palestras from "./components/Palestras";
import Rodape from "./components/Rodape";
import YouTube from "./components/YouTube";

/**
 * Os sete capitulos. A ordem aqui tem que bater com a de lib/chapters.ts
 * (reordenada em 30/10 a pedido do Andre) — e ela que manda no numero da
 * etiqueta, no rail e na cor da barra do navegador.
 */
export default function Home() {
  return (
    <main>
      <ChapterStack>
        <Hero />
        <Choque />
        <Fortix />
        <Barbearia />
        <BarbersVale />
        <Palestras />
        <YouTube />
      </ChapterStack>
      <Rodape />
    </main>
  );
}
