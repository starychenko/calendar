import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Фіскальний календар України - ISO 8601 та GfK";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Runtime configuration
export const runtime = "edge";

// ISR: Revalidate once a month for SEO
export const revalidate = 2592000; // 30 days in seconds

// Image generation
export default async function Image() {
  const currentYear = new Date().getFullYear();

  // Load Inter font with Cyrillic support
  // Using fetch for Edge runtime (alternative to readFile in Node.js runtime)
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/cyrillic-400-normal.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Фіскальний календар
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          України {currentYear}
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255, 255, 255, 0.2)",
              padding: "16px 32px",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 32 }}>📊</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>ISO 8601</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255, 255, 255, 0.2)",
              padding: "16px 32px",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 32 }}>📈</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>GfK</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255, 255, 255, 0.2)",
              padding: "16px 32px",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 32 }}>🎉</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>Свята</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
