import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * A UNICA origem externa do site: as capas dos videos do capitulo 05.
     * Todo o resto mora em `public/`.
     *
     * `pathname` fechado em `/vi/**` de proposito — o host do YouTube serve
     * outras coisas, e isto e uma lista de permissao, nao um portao aberto.
     * Sem esta entrada o `next/image` recusa a URL e o trilho de videos some.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
