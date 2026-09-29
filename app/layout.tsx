import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { chapters } from "@/lib/chapters";

/* direction contract (oculto, pro proximo que mexer aqui)
   THESIS ......... O Andre nao e "um negocio": e seis frentes que se explicam
                    melhor uma de cada vez. O site e um baralho, nao uma lista.
   OWN-WORLD ...... Cada capitulo tem mundo proprio de cor e o proximo SOBE por
                    cima do anterior. O Linktree empilha links; aqui a pagina
                    empilha identidades.
   STORY .......... Quem e ele -> o evento -> os negocios -> o palco -> o canal
                    -> a barbearia. Termina onde o publico de Jacarei encosta.
   FIRST VIEWPORT . Nome, o que ele faz, e um unico caminho. Nada de menu: o
                    trafego vem da bio do Instagram e quer uma coisa so.
   FORM ........... Tela cheia, Archivo em larguras diferentes por capitulo,
                    foto sempre tratada na cor do capitulo. */

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  // UM arquivo de fonte so, e nao dois. A citacao do capitulo 04 e italica e
  // eu cheguei a carregar o Archivo Italic de verdade por causa dela — mas o
  // next/font poe ele como preload, ou seja, 100 KB no caminho critico da
  // primeira pintura, pra TODO visitante. Quase todo o trafego vem da bio do
  // Instagram, em 4G, e o hero e um indice: a maioria toca num capitulo e nunca
  // chega no 04. Comparados lado a lado em 2x, o italico real e melhor (cor do
  // traco mais uniforme, terminais cortados no angulo da inclinacao); no
  // tamanho real a diferenca some. Nao vale 100 KB. Se um dia valer, e uma
  // linha: style: ["normal", "italic"].
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "André Alves · André Santo Visu",
  description: "Eventos, mentoria, consultoria e conteúdos para donos de barbearia.",

  /**
   * DEMO: NAO PODE INDEXAR enquanto o Andre nao vir e aprovar.
   *
   * `noindex` nao atrapalha o preview do WhatsApp: o robots.txt e a meta
   * robots falam com BUSCADOR, e quem monta o cartao do link e o crawler do
   * proprio WhatsApp, que le a Open Graph e ignora isso. Ou seja, da pra ter
   * preview bonito e continuar fora do Google ao mesmo tempo. Tirar so quando
   * o Andre aprovar.
   */
  robots: { index: false, follow: false },

  /**
   * `metadataBase` decide como o Next transforma o caminho da imagem OG em
   * URL absoluta — e crawler de rede social NAO aceita caminho relativo. Sem
   * isto o preview sai sem imagem. Trocar pelo dominio de verdade quando
   * houver um; enquanto o site so existe em preview da Vercel, `VERCEL_URL` da
   * a URL daquele deploy.
   */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3010")
  ),

  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "André Alves",
    title: "André Alves · André Santo Visu",
    description: "Eventos, mentoria, consultoria e conteúdos para donos de barbearia.",
    // a imagem vem de app/opengraph-image.tsx; o Next pendura ela sozinho
  },

  twitter: {
    card: "summary_large_image",
    title: "André Alves · André Santo Visu",
    description: "Eventos, mentoria, consultoria e conteúdos para donos de barbearia.",
  },
};

export const viewport: Viewport = {
  // o ThemeColorSync troca isso por capitulo; aqui fica o valor do hero
  themeColor: chapters[0].themeColor,
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body>
        {children}
        {/* Medicao. Fora da Vercel (aqui no `next dev`, por exemplo) ele nao
            manda nada e nao aparece. Nao poe cookie e nao identifica pessoa. */}
        <Analytics />
      </body>
    </html>
  );
}
