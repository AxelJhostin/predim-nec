import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita que Next tome el package-lock.json del directorio padre.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
