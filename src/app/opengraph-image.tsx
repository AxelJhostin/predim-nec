import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const alt = `${SITE_NAME} - Herramientas de ingeniería civil Ecuador`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0F172A 0%, #0C4A6E 55%, #E65100 140%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>
          {SITE_TAGLINE}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 32, maxWidth: 820, lineHeight: 1.35, opacity: 0.92 }}>
            Calculadoras NEC para pregrado en Ecuador
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.75 }}>
          predim-nec.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
