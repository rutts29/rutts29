import { ImageResponse } from "next/og";

import { portfolioContent } from "@/config/portfolioContent";

export const alt = `${portfolioContent.identity.name}, ${portfolioContent.identity.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { identity } = portfolioContent;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f7f7f5",
          color: "#161616",
          display: "flex",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          padding: "44px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #161616",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: "58px 64px 52px",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              justifyContent: "space-between",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>{identity.handle}</span>
            <span style={{ color: "#62625e", fontWeight: 500 }}>0xrutts.com</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 82,
                fontWeight: 700,
                letterSpacing: "-0.055em",
                lineHeight: 1,
              }}
            >
              {identity.name}
            </div>
            <div
              style={{
                color: "#4f4f4b",
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                marginTop: 24,
              }}
            >
              {identity.title}
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              borderTop: "2px solid #161616",
              display: "flex",
              fontSize: 24,
              justifyContent: "space-between",
              paddingTop: 24,
            }}
          >
            <span>{identity.workAuthorization}</span>
            <span style={{ color: "#62625e" }}>{identity.location}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
