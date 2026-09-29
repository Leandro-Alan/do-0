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
 * Os SETE capitulos estao prontos: 00 (capa + indice), 01 (Barbers Vale),
 * 02 (Fortix), 03 (Choque de Gestao), 04 (Cursos e palestras), 05 (YouTube) e
 * 06 (Santo Visu). A ordem aqui tem que bater com a de lib/chapters.ts — e ela
 * que manda no numero da etiqueta, no rail e na cor da barra do navegador.
 */
export default function Home() {
  return (
    <main>
      <ChapterStack>
        <Hero />
        <BarbersVale />
        <Fortix />
        <Choque />
        <Palestras />
        <YouTube />
        <Barbearia />
      </ChapterStack>
      <Rodape />
    </main>
  );
}
