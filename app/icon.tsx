import { ImageResponse } from "next/og";

/**
 * Favicon for La Guía de Chile
 *
 * This creates a favicon version of the isotipo
 * for browser tabs and bookmarks.
 *
 * Standard size: 32x32px
 *
 * Note: Using simplified approach compatible with Satori (ImageResponse engine)
 * Satori doesn't support blur filters, so we use solid circles with opacity
 */

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: "50%", // Circular style
            overflow: "hidden",
            // Pink background
            background: "#ff006e",
          }}
        >
        {/* Orange decorative circles - creating lava lamp effect */}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fd9809",
            top: "2px",
            left: "2px",
            opacity: 0.4,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "23px",
            height: "23px",
            borderRadius: "50%",
            background: "#fd9809",
            bottom: "2px",
            right: "2px",
            opacity: 0.3,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fd9809",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.25,
            display: "flex",
          }}
        />

        {/* Map Pin Icon */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "21px",
            color: "white",
          }}
        >
          📍
        </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
