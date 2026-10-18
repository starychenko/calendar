import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Фіскальний календар України - ISO 8601 та GfK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";
export default async function Image() {
  // Vendored OFL font: no network dependency at request time.
  const data = await readFile(
    join(process.cwd(), "public/fonts/inter-cyrillic-400-normal.woff"),
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        color: "white",
        fontFamily: "Inter",
        fontSize: 64,
      }}
    >
      <div style={{ display: "flex", marginBottom: 24 }}>
        Фіскальний календар
      </div>
      <div style={{ display: "flex", fontSize: 48 }}>України</div>
      <div style={{ display: "flex", fontSize: 32, marginTop: 48 }}>
        ISO 8601 · GfK
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: data.buffer.slice(
            data.byteOffset,
            data.byteOffset + data.byteLength,
          ) as ArrayBuffer,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
