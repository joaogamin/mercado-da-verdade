import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O site inteiro e estatico: exportar como HTML puro elimina qualquer
  // dependencia de runtime e permite hospedar em qualquer lugar.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
